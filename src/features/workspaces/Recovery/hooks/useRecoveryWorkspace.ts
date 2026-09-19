import { useEffect,useMemo,useRef,useState } from "react";
import { useTablePageSize } from '../../../../hooks/useTablePageSize';
import { useSurgeryStore } from "../../../../store/surgeryStore";
import { awakeningStages,emptyRecovery,recoveryAssessments,ROW_HEIGHT } from "../config";
import { type Period,type RecoveryState,type RecoveryStatus,type SortDirection,type SortKey,type Stability,type ToastState } from "../types";
import { getRecoveryDateSortValue,getSurgeryDurationSeconds,getSurgeryProcedures,hasRichTextContent,isRecoveryDateInPeriod } from "../utils";

export function useRecoveryWorkspace() {
  const surgeries = useSurgeryStore(
    (state) => state.surgeries,
  );

  const updateSurgery = useSurgeryStore(
    (state) => state.updateSurgery,
  );

  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] =
    useState<string | null>(null);
  const [page, setPage] = useState(0);
  

  const rowsContainerRef =
    useRef<HTMLDivElement | null>(null);
  const pageSize = useTablePageSize(rowsContainerRef, ROW_HEIGHT);

  const [toast, setToast] =
    useState<ToastState>(null);

  const [filterOpen, setFilterOpen] =
    useState(false);

  const [selectedDoctors, setSelectedDoctors] =
    useState<string[]>([]);

  const [selectedStatuses, setSelectedStatuses] =
    useState<string[]>([]);

  const [period, setPeriod] =
    useState<Period>("Day");

  const [selectedDate, setSelectedDate] =
    useState("");

  const [sortKey, setSortKey] =
    useState<SortKey>("date");

  const [sortDirection, setSortDirection] =
    useState<SortDirection>("asc");

  const filterRef =
    useRef<HTMLDivElement | null>(null);

  const [recovery, setRecovery] =
    useState<RecoveryState>(emptyRecovery);

  const [reportExpanded, setReportExpanded] =
    useState(false);

  const reportEditorRef =
    useRef<HTMLDivElement | null>(null);

  const savedReportRangeRef =
    useRef<Range | null>(null);

  /*
   * These Recovery fields are intentionally session-only:
   * - Patient Awakening
   * - Recovery Notes
   * - Surgeon Post-Operative Report
   *
   * They remain available while this Recovery page stays mounted,
   * including drawer close/reopen and patient switching, but reset
   * naturally after a browser refresh.
   */
  const transientRecoveryRef =
    useRef<
      Record<
        string,
        {
          awakeningStage: number;
          notes: string;
          surgeonReport: string;
        }
      >
    >({});

  /*
   * Recovery receives patients after surgery is finished.
   * We also keep "Recovery" and "Discharged" visible so a saved
   * recovery record can still be reviewed later.
   */
  const recoveryCases = useMemo(
    () =>
      surgeries.filter((surgery) =>
        [
          "Completed",
          "Recovery",
          "Discharged",
        ].includes(surgery.status),
      ),
    [surgeries],
  );

  const doctors = useMemo(
    () =>
      Array.from(
        new Set(
          recoveryCases.map(
            (surgery) => surgery.doctor,
          ),
        ),
      ).filter(Boolean),
    [recoveryCases],
  );

  const statuses = useMemo(
    () =>
      Array.from(
        new Set(
          recoveryCases.map(
            (surgery) =>
              loadRecovery(
                surgery.id,
              ).status,
          ),
        ),
      ),
    [recoveryCases],
  );

  const filteredCases = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    return recoveryCases.filter(
      (surgery) => {
        const procedures =
          getSurgeryProcedures(
            surgery,
          )
            .map(
              (item) => item.name,
            )
            .join(" ")
            .toLowerCase();

        const stored =
          loadRecovery(surgery.id);

        const matchesSearch =
          !query ||
          surgery.patientName
            .toLowerCase()
            .includes(query) ||
          surgery.id
            .toLowerCase()
            .includes(query) ||
          procedures.includes(query) ||
          surgery.doctor
            .toLowerCase()
            .includes(query);

        const matchesDoctor =
          selectedDoctors.length === 0 ||
          selectedDoctors.includes(
            surgery.doctor,
          );

        const matchesStatus =
          selectedStatuses.length === 0 ||
          selectedStatuses.includes(
            stored.status,
          );

        const matchesDate =
          !selectedDate ||
          isRecoveryDateInPeriod(
            surgery,
            selectedDate,
            period,
          );

        return (
          matchesSearch &&
          matchesDoctor &&
          matchesStatus &&
          matchesDate
        );
      },
    );
  }, [
    recoveryCases,
    search,
    selectedDoctors,
    selectedStatuses,
    selectedDate,
    period,
  ]);

  const sortedCases = useMemo(() => {
    const copy = [...filteredCases];

    copy.sort((a, b) => {
      const getValue = (
        surgery: (typeof copy)[number],
      ) => {
        const stored =
          loadRecovery(surgery.id);

        switch (sortKey) {
          case "patient":
            return surgery.patientName;

          case "patientId":
            return surgery.id;

          case "procedures":
            return getSurgeryProcedures(
              surgery,
            )
              .map(
                (item) => item.name,
              )
              .join(" ");

          case "surgeon":
            return surgery.doctor;

          case "date":
            return getRecoveryDateSortValue(
              surgery,
            );

          case "duration":
            return getSurgeryDurationSeconds(
              surgery,
            );

          case "condition":
            return stored.stability;

          case "recoveryStatus":
            return stored.status;

          default:
            return "";
        }
      };

      const aValue = getValue(a);
      const bValue = getValue(b);

      const result =
        typeof aValue === "number" &&
        typeof bValue === "number"
          ? aValue - bValue
          : String(aValue).localeCompare(
              String(bValue),
              undefined,
              {
                numeric: true,
                sensitivity: "base",
              },
            );

      return sortDirection === "asc"
        ? result
        : -result;
    });

    return copy;
  }, [
    filteredCases,
    sortKey,
    sortDirection,
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(
      sortedCases.length / pageSize,
    ),
  );

  const visibleCases = useMemo(
    () =>
      sortedCases.slice(
        page * pageSize,
        page * pageSize + pageSize,
      ),
    [sortedCases, page, pageSize],
  );

  const selected = useMemo(
    () =>
      surgeries.find(
        (surgery) =>
          surgery.id === selectedId,
      ),
    [surgeries, selectedId],
  );

  const assessmentProgress =
    recovery.assessments.length;

  const allAssessmentsComplete =
    recoveryAssessments.every((item) =>
      recovery.assessments.includes(item),
    );

  const readyForTransfer =
    recovery.started &&
    recovery.awakeningStage ===
      awakeningStages.length - 1 &&
    allAssessmentsComplete &&
    recovery.stability === "stable";

  /*
   * Remove transient fields saved by older Recovery versions.
   * This runs once for the current surgery list and prevents stale
   * awakening / notes / reports from coming back after refresh.
   */
  useEffect(() => {
    surgeries.forEach(
      (surgery) => {
        const id = String(
          surgery.id ?? "",
        );

        if (!id) return;

        const key =
          `recovery-${id}`;

        const raw =
          localStorage.getItem(
            key,
          );

        if (!raw) return;

        try {
          const parsed =
            JSON.parse(raw);

          localStorage.setItem(
            key,
            JSON.stringify({
              assessments:
                Array.isArray(
                  parsed.assessments,
                )
                  ? parsed.assessments.filter(
                      (
                        value: unknown,
                      ) =>
                        typeof value ===
                        "string",
                    )
                  : [],
              stability:
                parsed.stability ===
                "unstable"
                  ? "unstable"
                  : "stable",
            }),
          );
        } catch {
          localStorage.removeItem(
            key,
          );
        }
      },
    );
  }, [surgeries]);

  

  /*
   * Keep page position valid after a search.
   */
  useEffect(() => {
    if (page > totalPages - 1) {
      setPage(
        Math.max(0, totalPages - 1),
      );
    }
  }, [page, totalPages]);

  /*
   * Auto-save Recovery workspace without introducing another
   * scrolling/modal workflow.
   */
  useEffect(() => {
    if (!selectedId) return;

    const timer = window.setTimeout(
      () => {
        persistRecovery(
          selectedId,
          recovery,
        );
      },
      300,
    );

    return () =>
      window.clearTimeout(timer);
  }, [selectedId, recovery]);

  /*
   * Load the saved rich-text report into the editor when the selected
   * patient changes. Keeping the contentEditable element uncontrolled
   * avoids resetting the cursor while the doctor is typing.
   */
  useEffect(() => {
    if (!reportEditorRef.current) return;

    reportEditorRef.current.innerHTML =
      recovery.surgeonReport || "";
    // Only reload the document when switching patients.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

  useEffect(() => {
    setPage(0);
  }, [
    search,
    selectedDoctors,
    selectedStatuses,
    selectedDate,
    period,
  ]);

  useEffect(() => {
    if (!filterOpen) return;

    function handleOutsideClick(
      event: MouseEvent,
    ) {
      const target =
        event.target as Node | null;

      if (
        target &&
        filterRef.current &&
        !filterRef.current.contains(
          target,
        )
      ) {
        setFilterOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleOutsideClick,
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handleOutsideClick,
      );
  }, [filterOpen]);

  useEffect(() => {
    if (!toast) return;

    const timer = window.setTimeout(
      () => setToast(null),
      4000,
    );

    return () =>
      window.clearTimeout(timer);
  }, [toast]);

  function showToast(
    type: "success" | "error",
    title: string,
    message: string,
    items?: string[],
  ) {
    setToast({
      type,
      title,
      message,
      items,
    });
  }

  function handleSort(
    key: SortKey,
  ) {
    if (sortKey === key) {
      setSortDirection(
        (current) =>
          current === "asc"
            ? "desc"
            : "asc",
      );

      return;
    }

    setSortKey(key);
    setSortDirection("asc");
  }

  function toggleDoctor(
    doctor: string,
  ) {
    setSelectedDoctors(
      (current) =>
        current.includes(doctor)
          ? current.filter(
              (item) =>
                item !== doctor,
            )
          : [...current, doctor],
    );
  }

  function toggleStatus(
    status: string,
  ) {
    setSelectedStatuses(
      (current) =>
        current.includes(status)
          ? current.filter(
              (item) =>
                item !== status,
            )
          : [...current, status],
    );
  }

  function clearFilters() {
    setSelectedDoctors([]);
    setSelectedStatuses([]);
    setPeriod("Day");
    setSelectedDate("");
  }

  function selectPatient(id: string) {
    setReportExpanded(false);

    if (selectedId) {
      persistRecovery(
        selectedId,
        recovery,
      );
    }

    const surgery = surgeries.find(
      (item) => item.id === id,
    );

    if (!surgery) return;

    setSelectedId(id);

    const stored =
      loadRecovery(id);

    setRecovery({
      ...stored,

      /*
       * Do not fall back to surgery.operativeReport / surgeonNotes here.
       * Those shared values would make the Recovery inputs reappear
       * after a browser refresh.
       */
      surgeonReport:
        stored.surgeonReport,

      stability:
        stored.stability ||
        (surgery.patientCondition ===
        "Unstable"
          ? "unstable"
          : "stable"),
    });
  }

  function persistRecovery(
    id: string,
    value: RecoveryState,
  ) {
    /*
     * Persist only the durable Recovery information.
     *
     * Awakening, Notes and Surgeon Report are intentionally omitted
     * so refreshing the browser opens them in their default state.
     */
    localStorage.setItem(
      `recovery-${id}`,
      JSON.stringify({
        assessments:
          value.assessments,
        stability:
          value.stability,
      }),
    );

    /*
     * Preserve the transient values only for this mounted page session.
     */
    transientRecoveryRef.current[id] = {
      awakeningStage:
        value.awakeningStage,
      notes:
        value.notes,
      surgeonReport:
        value.surgeonReport,
    };
  }

  function loadRecovery(
    id: string,
  ): RecoveryState {
    const raw =
      localStorage.getItem(
        `recovery-${id}`,
      );

    const transient =
      transientRecoveryRef.current[id];

    let assessments: string[] = [];
    let stability: Stability =
      "stable";

    if (raw) {
      try {
        const parsed =
          JSON.parse(raw);

        assessments =
          Array.isArray(
            parsed.assessments,
          )
            ? parsed.assessments.filter(
                (value: unknown) =>
                  typeof value ===
                  "string",
              )
            : [];

        stability =
          parsed.stability ===
          "unstable"
            ? "unstable"
            : "stable";
      } catch {
        /*
         * Ignore old/invalid Recovery localStorage and use defaults.
         */
      }
    }

    return {
      started: true,

      /*
       * On a browser refresh transientRecoveryRef is empty,
       * so Patient Awakening returns to:
       * "Anesthesia ongoing".
       */
      awakeningStage:
        transient?.awakeningStage ??
        0,

      assessments,

      /*
       * Notes and report are session-only and therefore empty
       * after refresh.
       */
      notes:
        transient?.notes ?? "",

      status:
        transient &&
        transient.awakeningStage >
          1
          ? transient.awakeningStage >=
            awakeningStages.length -
              1
            ? "Ready for Transfer"
            : "Progressing"
          : "Monitoring",

      stability,

      surgeonReport:
        transient?.surgeonReport ??
        "",
    };
  }

  function updateRecoveryStage(
    stage: number,
  ) {
    /*
     * Awakening is intentionally sequential.
     * The user can only move from the current stage to the next one.
     */
    if (
      stage !==
      recovery.awakeningStage + 1
    ) {
      return;
    }

    const status: RecoveryStatus =
      stage >=
      awakeningStages.length - 1
        ? "Ready for Transfer"
        : stage <= 1
          ? "Monitoring"
          : "Progressing";

    setRecovery((current) => {
      const next = {
        ...current,
        started: true,
        awakeningStage: stage,
        status,
      };

      if (selectedId) {
        transientRecoveryRef.current[
          selectedId
        ] = {
          awakeningStage:
            next.awakeningStage,
          notes:
            next.notes,
          surgeonReport:
            next.surgeonReport,
        };
      }

      return next;
    });
  }

  function toggleAssessment(
    item: string,
  ) {
    setRecovery((current) => ({
      ...current,
      assessments:
        current.assessments.includes(item)
          ? current.assessments.filter(
              (value) =>
                value !== item,
            )
          : [
              ...current.assessments,
              item,
            ],
    }));
  }

  function saveRecovery() {
    if (!selected) return;

    const savedState = {
      ...recovery,
      status: readyForTransfer
        ? ("Ready for Transfer" as const)
        : recovery.status,
    };

    setRecovery(savedState);

    persistRecovery(
      selected.id,
      savedState,
    );

    /*
     * Save the doctor report and recovery result on the shared
     * surgery record so Surgery Details / later workflow pages
     * can reuse the same information.
     */
    updateSurgery(
      selected.id,
      {
        status: "Recovery",
        operativeReport:
          savedState.surgeonReport,
        surgeonNotes:
          savedState.notes,
        patientCondition:
          savedState.stability ===
          "stable"
            ? "Stable"
            : "Unstable",

        // These additional properties are useful to later
        // Recovery / Admission / Discharge screens. Cast keeps
        // this page compatible even if your Surgery type has
        // not added them yet.
        recoveryStatus:
          savedState.status,
        recoveryCompleted:
          readyForTransfer,
        recoveryAssessments:
          savedState.assessments,
        awakeningStage:
          savedState.awakeningStage,
      } as any,
    );
  }

  function rememberReportSelection() {
    const editor =
      reportEditorRef.current;

    const selection =
      window.getSelection();

    if (
      !editor ||
      !selection ||
      selection.rangeCount === 0
    ) {
      return;
    }

    const range =
      selection.getRangeAt(0);

    if (
      editor.contains(
        range.commonAncestorContainer,
      )
    ) {
      savedReportRangeRef.current =
        range.cloneRange();
    }
  }

  function restoreReportSelection() {
    const range =
      savedReportRangeRef.current;

    if (!range) return;

    const selection =
      window.getSelection();

    if (!selection) return;

    selection.removeAllRanges();
    selection.addRange(range);
  }

  function applyReportCommand(
    command: string,
    value?: string,
  ) {
    const editor =
      reportEditorRef.current;

    if (!editor) return;

    editor.focus();
    restoreReportSelection();

    /*
     * styleWithCSS makes foreColor/highlight behave consistently
     * inside the contentEditable report.
     */
    try {
      document.execCommand(
        "styleWithCSS",
        false,
        "true",
      );
    } catch {
      // Browser can safely continue with normal execCommand.
    }

    if (
      command === "hiliteColor"
    ) {
      const applied =
        document.execCommand(
          "hiliteColor",
          false,
          value,
        );

      if (!applied) {
        document.execCommand(
          "backColor",
          false,
          value,
        );
      }
    } else {
      document.execCommand(
        command,
        false,
        value,
      );
    }

    rememberReportSelection();

    const html =
      editor.innerHTML;

    setRecovery((current) => ({
      ...current,
      surgeonReport: html,
    }));
  }

  function handleReportInput(
    event: React.FormEvent<HTMLDivElement>,
  ) {
    /*
     * IMPORTANT:
     * Capture the HTML immediately. Do not read event.currentTarget
     * from inside the state-updater callback because React may clear
     * currentTarget after the event handler finishes.
     */
    const html =
      event.currentTarget.innerHTML;

    setRecovery((current) => {
      const next = {
        ...current,
        surgeonReport: html,
      };

      if (selectedId) {
        transientRecoveryRef.current[
          selectedId
        ] = {
          awakeningStage:
            next.awakeningStage,
          notes:
            next.notes,
          surgeonReport:
            next.surgeonReport,
        };
      }

      return next;
    });
  }

  function toggleReportExpanded() {
    /*
     * Sync the current DOM document before changing layout mode so
     * expanding/collapsing never loses what the doctor has typed.
     */
    const html =
      reportEditorRef.current?.innerHTML ??
      recovery.surgeonReport;

    setRecovery((current) => ({
      ...current,
      surgeonReport: html,
    }));

    setReportExpanded(
      (current) => !current,
    );

    /*
     * The contentEditable node stays mounted, but its layout changes
     * from normal to fixed. Restore focus after the browser has applied
     * that layout change.
     */
    window.requestAnimationFrame(() => {
      reportEditorRef.current?.focus();
    });
  }

  function collapseReport() {
    const html =
      reportEditorRef.current?.innerHTML ??
      recovery.surgeonReport;

    setRecovery((current) => ({
      ...current,
      surgeonReport: html,
    }));

    setReportExpanded(false);
  }

  function confirmReadyForTransfer() {
    if (!selected) {
      showToast(
        "error",
        "Recovery not completed",
        "No patient is selected. Select a patient and try again.",
      );

      return;
    }

    const missing: string[] = [];

    if (
      recovery.awakeningStage !==
      awakeningStages.length - 1
    ) {
      missing.push(
        "Complete all Patient Awakening stages",
      );
    }

    if (!allAssessmentsComplete) {
      missing.push(
        "Complete all Recovery Assessment checks",
      );
    }

    if (
      recovery.stability !== "stable"
    ) {
      missing.push(
        "Confirm that the patient is Stable",
      );
    }

    if (
      !hasRichTextContent(
        recovery.surgeonReport,
      )
    ) {
      missing.push(
        "Complete the Surgeon Post-Operative Report",
      );
    }

    if (missing.length > 0) {
      showToast(
        "error",
        "Recovery needs attention",
        "Please complete the following requirements before marking the patient ready for transfer:",
        missing,
      );

      /*
       * Same behavior as Pre-Op:
       * keep the drawer open so the user can fix the missing items.
       */
      return;
    }

    try {
      const completedState: RecoveryState =
        {
          ...recovery,
          started: true,
          status:
            "Ready for Transfer",
        };

      setRecovery(
        completedState,
      );

      persistRecovery(
        selected.id,
        completedState,
      );

      updateSurgery(
        selected.id,
        {
          status: "Recovery",
          operativeReport:
            completedState.surgeonReport,
          surgeonNotes:
            completedState.notes,
          patientCondition:
            "Stable",
          recoveryStatus:
            "Ready for Transfer",
          recoveryCompleted: true,
          recoveryCompletedAt:
            new Date().toISOString(),
          recoveryAssessments:
            completedState.assessments,
          awakeningStage:
            completedState.awakeningStage,
        } as any,
      );

      showToast(
        "success",
        "Recovery completed",
        `${selected.patientName} has recovered successfully and is ready for transfer.`,
      );

      /*
       * Close only after a successful Recovery confirmation.
       */
      setReportExpanded(false);
      setSelectedId(null);
    } catch (error) {
      const message =
        error instanceof Error &&
        error.message
          ? error.message
          : "Something went wrong while completing Recovery. Please try again.";

      showToast(
        "error",
        "Recovery failed",
        message,
      );
    }
  }

  
  return { selected, selectedId, selectPatient, recoveryCases, loadRecovery, search, setSearch, filterRef, setFilterOpen, filterOpen, selectedDoctors, selectedStatuses, selectedDate, period, clearFilters, doctors, toggleDoctor, statuses, toggleStatus, setPeriod, setSelectedDate, setPage, sortKey, sortDirection, handleSort, rowsContainerRef, visibleCases, sortedCases, page, pageSize, totalPages, toast, setToast, setSelectedId, setRecovery, recovery, assessmentProgress, updateRecoveryStage, allAssessmentsComplete, toggleAssessment, transientRecoveryRef, reportExpanded, collapseReport, toggleReportExpanded, applyReportCommand, rememberReportSelection, reportEditorRef, handleReportInput, readyForTransfer, saveRecovery, confirmReadyForTransfer };
}
