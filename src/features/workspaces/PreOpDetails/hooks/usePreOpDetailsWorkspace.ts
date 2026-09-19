import { useEffect,useMemo,useRef,useState } from "react";
import { useLocation,useNavigate,useParams } from "react-router-dom";
import { useSurgeryStore } from "../../../../store/surgeryStore";
import { anesthesiaHistoryItems,anesthesiaTypes,initialAdditionalSupplies,initialRequiredSupplies,MIN_PAGE_SIZE,preOpHistoryItems,ROW_HEIGHT,tests } from "../config";
import { type AnesthesiaExamState,type IntraNote,type IntraSection,type Period,type ReviewMap,type ReviewValue,type SafetyNote,type SortDirection,type SortKey,type SupplyItem,type SupplySection,type TabKey,type ToastState } from "../types";
import { getDateSortValue,getDoctor,getMeta,getPatientCode,getPatientName,getPreOpWorkflowStatus,getProcedures,getSurgeryClock,isDateInPeriod,toStringArray } from "../utils";

export function usePreOpDetailsWorkspace() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const workspaceHeadingRef = useRef<HTMLHeadingElement>(null);

  const {
    surgeries,
    updateSurgery,
    setPreOpStatus,
    confirmAnesthesiaType,
  } = useSurgeryStore();

  const selectedId = id ?? null;

  useEffect(() => {
    if (selectedId) workspaceHeadingRef.current?.focus();
  }, [selectedId]);

  

  const [search] =
    useState("");

  const [filterOpen, setFilterOpen] =
    useState(false);

  const [selectedDoctors] =
    useState<string[]>([]);

  const [selectedStatuses] =
    useState<string[]>([]);

  const [period] =
    useState<Period>("Day");

  const [selectedDate] =
    useState("2026-09-03");

  const [sortKey] =
    useState<SortKey>("date");

  const [sortDirection] =
    useState<SortDirection>("asc");

  const [page, setPage] =
    useState(0);

  const rowsContainerRef =
    useRef<HTMLDivElement | null>(null);

  const filterRef =
    useRef<HTMLDivElement | null>(null);

  const [pageSize, setPageSize] =
    useState(5);

  const [toast, setToast] =
    useState<ToastState>(null);

  const [activeTab, setActiveTab] =
    useState<TabKey>("preop-assessment");

  const [intraSection, setIntraSection] =
    useState<IntraSection>("supplies");

  const [supplySection, setSupplySection] =
    useState<SupplySection>("required");

  const [supplyCategory, setSupplyCategory] =
    useState<string>("All");

  const [completedTests, setCompletedTests] =
    useState<string[]>([]);

  const [preOpReview, setPreOpReview] =
    useState<ReviewMap>({});

  const [anesthesiaReview, setAnesthesiaReview] =
    useState<ReviewMap>({});

  const [anesthesiaExam, setAnesthesiaExam] =
    useState<AnesthesiaExamState>({
      functionalCapacity: "",
      canLieFlat: "",
      smoking: "",
      recentUri: "",
      airway: "",
      dental: "",
      heart: "",
      lungs: "",
      height: "",
      weight: "",
      currentMedications: "",
      priorAnesthesiaHistory: "",
      familyAnesthesiaHistory: "",
      ekg: "",
      labs: "",
      other: "",
      npoConfirmed: "",
      asaClass: "",
    });

  const [editingAnesthesia, setEditingAnesthesia] = useState(false);

  const [anesthesia, setAnesthesia] =
    useState("");


  const [safety, setSafety] =
    useState<SafetyNote>({
      exceptions: [],
      acknowledged: false,
    });

  const [
    showExceptionForm,
    setShowExceptionForm,
  ] = useState(false);

  const [exceptionText, setExceptionText] =
    useState("");

  const [
    requiredSupplies,
    setRequiredSupplies,
  ] = useState<SupplyItem[]>(
    initialRequiredSupplies,
  );

  const [
    additionalSupplies,
    setAdditionalSupplies,
  ] = useState<SupplyItem[]>(
    initialAdditionalSupplies,
  );

  const [notes, setNotes] =
    useState<IntraNote[]>([]);

  const [noteType] =
    useState<IntraNote["type"]>("routine");

  const [noteText, setNoteText] =
    useState("");

  /*
   * Tracks when the selected patient's persisted workspace has finished
   * hydrating into React state. This prevents the autosave effect from
   * overwriting saved data with the initial empty state during navigation.
   */
  const [
    hydratedWorkspaceId,
    setHydratedWorkspaceId,
  ] = useState<string | null>(null);

  /*
   * Keep an in-memory notes copy as a fast session fallback. Notes are also
   * persisted to localStorage together with the rest of the Pre-Op workspace.
   */
  const transientWorkspaceRef =
    useRef<
      Record<
        string,
        {
          notes: IntraNote[];
        }
      >
    >({});

  const selected = useMemo(
    () =>
      surgeries.find(
        (surgery) =>
          surgery.id === selectedId,
      ),
    [surgeries, selectedId],
  );

  useEffect(() => {
    if (!selected) return;
    loadPatientWorkspace(selected);
  }, [selected?.id]);


  const admissionDate = selected?.admittedAt
    ? new Date(selected.admittedAt)
    : null;
  const hasAdmissionTime = admissionDate !== null && !Number.isNaN(admissionDate.getTime());


  const preOpCases = useMemo(() => {
    return surgeries.filter(
      (surgery) =>
        surgery.status === "Financially Cleared" ||
        surgery.status === "Admitted" ||
        surgery.status === "Pre-Op" ||
        surgery.status === "Ready",
    );
  }, [surgeries]);



  const filteredCases = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    return preOpCases.filter(
      (surgery) => {
        const name =
          getPatientName(
            surgery,
          ).toLowerCase();

        const code =
          getPatientCode(
            surgery,
          ).toLowerCase();

        const procedure =
          getProcedures(surgery)
            .map(
              (item) => item.name,
            )
            .join(" ")
            .toLowerCase();

        const doctor =
          getDoctor(
            surgery,
          );

        const caseNumber =
          String(
            surgery.id ?? "",
          ).toLowerCase();

        const matchesSearch =
          !query ||
          name.includes(query) ||
          code.includes(query) ||
          caseNumber.includes(query) ||
          procedure.includes(query);

        const matchesDoctor =
          selectedDoctors.length === 0 ||
          selectedDoctors.includes(
            doctor,
          );

        const matchesStatus =
          selectedStatuses.length === 0 ||
          selectedStatuses.includes(
            surgery.status,
          );

        const matchesDate =
          isDateInPeriod(
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
    preOpCases,
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
        switch (sortKey) {
          case "patient":
            return getPatientName(
              surgery,
            );

          case "case":
            return String(
              surgery.id ?? "",
            );

          case "procedures":
            return getProcedures(
              surgery,
            )
              .map(
                (item) =>
                  item.name,
              )
              .join(" ");

          case "surgeon":
            return getDoctor(
              surgery,
            );

          case "date":
            return getDateSortValue(
              surgery,
            );

          case "time":
            return getSurgeryClock(
              surgery,
            );

          case "preOpStatus":
            return getPreOpWorkflowStatus(
              surgery,
            );

          default:
            return "";
        }
      };

      const result = String(
        getValue(a),
      ).localeCompare(
        String(getValue(b)),
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
      sortedCases.length /
        pageSize,
    ),
  );


  useEffect(() => {
    const element =
      rowsContainerRef.current;

    if (!element) return;

    const updatePageSize = () => {
      const availableHeight =
        element.getBoundingClientRect()
          .height;

      // Keep pagination stable while the full-page workspace hides the queue.
      if (availableHeight === 0) return;

      const nextPageSize = Math.max(
        MIN_PAGE_SIZE,
        Math.floor(
          availableHeight /
            ROW_HEIGHT,
        ),
      );

      setPageSize((current) =>
        current === nextPageSize
          ? current
          : nextPageSize,
      );
    };

    updatePageSize();

    const observer =
      new ResizeObserver(
        updatePageSize,
      );

    observer.observe(element);

    window.addEventListener(
      "resize",
      updatePageSize,
    );

    return () => {
      observer.disconnect();

      window.removeEventListener(
        "resize",
        updatePageSize,
      );
    };
  }, []);

  useEffect(() => {
    if (!filterOpen) return;

    const handleMouseDown = (
      event: MouseEvent,
    ) => {
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
    };

    document.addEventListener(
      "mousedown",
      handleMouseDown,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleMouseDown,
      );
    };
  }, [filterOpen]);



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
    if (
      page >
      totalPages - 1
    ) {
      setPage(
        Math.max(
          0,
          totalPages - 1,
        ),
      );
    }
  }, [
    page,
    totalPages,
  ]);

  useEffect(() => {
    if (!toast) return;

    const timer = window.setTimeout(
      () => setToast(null),
      3500,
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





  const testProgress = {
    completed: tests.filter(
      (test) =>
        completedTests.includes(
          test.id,
        ),
    ).length,
    total: tests.length,
  };

  const preOpAssessmentProgress = {
    completed: preOpHistoryItems.filter(
      (item) => Boolean(preOpReview[item.id]?.value),
    ).length,
    total: preOpHistoryItems.length,
  };

  const anesthesiaHistoryProgress = {
    completed: anesthesiaHistoryItems.filter(
      (item) => Boolean(anesthesiaReview[item.id]?.value),
    ).length,
    total: anesthesiaHistoryItems.length,
  };

  const currentSupplies =
    supplySection === "required"
      ? requiredSupplies
      : additionalSupplies;

  const filteredSupplies = useMemo(() => {
    if (supplyCategory === "All") {
      return currentSupplies;
    }

    return currentSupplies.filter(
      (item) =>
        item.category ===
        supplyCategory,
    );
  }, [
    currentSupplies,
    supplyCategory,
  ]);

  const requiredSuppliesProgress = {
    completed:
      requiredSupplies.filter(
        (item) => item.checked,
      ).length,
    total: requiredSupplies.length,
  };

  const anesthesiaConfirmed = Boolean(
    selected?.anesthesiaType &&
      (
        selected.anesthesiaTypeConfirmedAt ||
        selected.anesthesiaCompleted
      ),
  );

  const anesthesiaPlanningProgress = {
    completed: [
      anesthesiaExam.functionalCapacity,
      anesthesiaExam.canLieFlat,
      anesthesiaExam.npoConfirmed,
      anesthesiaExam.asaClass,
      anesthesiaConfirmed ? "confirmed" : "",
    ].filter(Boolean).length,
    total: 5,
  };

  const anesthesiaProgress = {
    completed:
      anesthesiaHistoryProgress.completed +
      anesthesiaPlanningProgress.completed,
    total:
      anesthesiaHistoryProgress.total +
      anesthesiaPlanningProgress.total,
  };

  const selectedPlanConfirmed = Boolean(
    anesthesia &&
      selected?.anesthesiaType === anesthesia &&
      anesthesiaConfirmed &&
      !editingAnesthesia,
  );

  /*
   * Confirm Pre-Op Ready intentionally depends ONLY on:
   * 1) every Pre-Operative Test being checked
   * 2) the anesthesia type chosen by the user being explicitly confirmed
   *
   * Planned anesthesia has no default selection.
   */
  const allPreOpReady =
    testProgress.completed ===
      testProgress.total &&
    selectedPlanConfirmed;

  const exceptions = safety.exceptions;

  function loadPatientWorkspace(
    surgery: typeof selected,
  ) {
    if (!surgery) return;

    const id = String(surgery.id);

    /*
     * Mark this workspace as not hydrated for the current render. The value
     * is set back to the patient id only after every persisted field has been
     * pushed into React state.
     */
    setHydratedWorkspaceId(null);

    setActiveTab(location.state?.copilotSection === "pre-tests" || location.state?.copilotSection === "anesthesia"
      ? location.state.copilotSection : "preop-assessment");
    setEditingAnesthesia(false);
    setIntraSection("supplies");
    setSupplySection("required");
    setSupplyCategory("All");

    const parseStorage = (
      key: string,
    ): any | null => {
      try {
        const raw =
          localStorage.getItem(key);

        if (!raw) return null;

        const parsed =
          JSON.parse(raw);

        return parsed &&
          typeof parsed === "object"
          ? parsed
          : null;
      } catch {
        return null;
      }
    };

    const surgeryMeta =
      getMeta(surgery);

    const sharedPreOpData =
      surgeryMeta.preOpData &&
      typeof surgeryMeta.preOpData === "object"
        ? (surgeryMeta.preOpData as Record<
            string,
            any
          >)
        : null;

    /*
     * New canonical snapshot. Keep reading the older split keys too so
     * previously saved patients continue to work.
     */
    const workspace =
      parseStorage(
        `pre-op-workspace-${id}`,
      );

    const legacyProgress =
      parseStorage(
        `pre-op-progress-${id}`,
      );

    const progress =
      workspace ??
      legacyProgress ??
      sharedPreOpData;

    const emptyAnesthesiaExam: AnesthesiaExamState = {
      functionalCapacity: "",
      canLieFlat: "",
      smoking: "",
      recentUri: "",
      airway: "",
      dental: "",
      heart: "",
      lungs: "",
      height: "",
      weight: "",
      currentMedications: "",
      priorAnesthesiaHistory: "",
      familyAnesthesiaHistory: "",
      ekg: "",
      labs: "",
      other: "",
      npoConfirmed: "",
      asaClass: "",
    };

    setCompletedTests(
      Array.isArray(
        progress?.completedTests,
      )
        ? [
            ...new Set<string>(
              progress.completedTests.filter(
                (value: unknown) =>
                  typeof value === "string",
              ),
            ),
          ]
        : [],
    );

    setPreOpReview(
      progress?.preOpReview &&
      typeof progress.preOpReview ===
        "object"
        ? progress.preOpReview
        : {},
    );

    setAnesthesiaReview(
      progress?.anesthesiaReview &&
      typeof progress.anesthesiaReview ===
        "object"
        ? progress.anesthesiaReview
        : {},
    );

    setAnesthesiaExam(
      progress?.anesthesiaExam &&
      typeof progress.anesthesiaExam ===
        "object"
        ? {
            ...emptyAnesthesiaExam,
            ...progress.anesthesiaExam,
          }
        : emptyAnesthesiaExam,
    );

    const sharedAnesthesia =
      typeof surgeryMeta.anesthesiaType ===
      "string"
        ? surgeryMeta.anesthesiaType
        : "";

    const sharedAnesthesiaConfirmed =
      Boolean(
        surgeryMeta.anesthesiaTypeConfirmedAt ||
          surgeryMeta.anesthesiaCompleted,
      );

    const savedAnesthesia =
      typeof progress?.anesthesia ===
        "string"
        ? progress.anesthesia
        : "";

    /*
     * IMPORTANT:
     * Restore the user's saved planned anesthesia even when it has not been
     * confirmed yet. The old implementation discarded this value on reopen.
     */
    const nextAnesthesia =
      savedAnesthesia ||
      (sharedAnesthesiaConfirmed
        ? sharedAnesthesia
        : "");

    setAnesthesia(nextAnesthesia);

    setEditingAnesthesia(
      Boolean(
        sharedAnesthesiaConfirmed &&
          nextAnesthesia &&
          nextAnesthesia !==
            sharedAnesthesia,
      ),
    );

    const savedAnesthesiaConfirmed =
      workspace?.anesthesiaPlanConfirmed ===
        true ||
      sharedPreOpData
        ?.anesthesiaPlanConfirmed ===
        true ||
      workspace?.confirmedReady === true ||
      sharedPreOpData?.confirmedReady ===
        true;

    /*
     * If browser/store recreation lost the shared anesthesia confirmation,
     * rebuild it from the persisted Pre-Op snapshot.
     */
    if (
      savedAnesthesiaConfirmed &&
      nextAnesthesia &&
      anesthesiaTypes.includes(
        nextAnesthesia,
      ) &&
      !sharedAnesthesiaConfirmed
    ) {
      const restored =
        confirmAnesthesiaType(
          surgery.id,
          nextAnesthesia,
        );

      if (!restored) {
        updateSurgery(
          surgery.id,
          {
            anesthesiaType:
              nextAnesthesia,
            anesthesiaTypeConfirmedAt:
              workspace
                ?.anesthesiaTypeConfirmedAt ??
              sharedPreOpData
                ?.anesthesiaTypeConfirmedAt ??
              new Date().toISOString(),
            anesthesiaCompleted: true,
          } as any,
        );
      }
    }

    const legacySafety =
      parseStorage(
        `pre-op-safety-${id}`,
      );

    const savedSafety =
      workspace?.safety ??
      legacySafety ??
      sharedPreOpData?.safety;

    if (
      savedSafety &&
      typeof savedSafety === "object"
    ) {
      setSafety({
        exceptions: Array.isArray(
          savedSafety.exceptions,
        )
          ? savedSafety.exceptions.filter(
              (value: unknown) =>
                typeof value === "string",
            )
          : [],
        acknowledged: Boolean(
          savedSafety.acknowledged,
        ),
      });
    } else {
      setSafety({
        exceptions: [
          ...toStringArray(
            surgeryMeta.allergies ??
              surgeryMeta.allergy,
          ),
          ...toStringArray(
            surgeryMeta.medicationRestrictions ??
              surgeryMeta.medicationsNotAllowed,
          ),
          ...toStringArray(
            surgeryMeta.precautions ??
              surgeryMeta.clinicalPrecautions,
          ),
        ],
        acknowledged: false,
      });
    }

    const legacySupplies =
      parseStorage(
        `pre-op-supplies-${id}`,
      );

    const savedRequiredSupplies =
      workspace?.requiredSupplies ??
      legacySupplies?.required ??
      sharedPreOpData?.requiredSupplies;

    const savedAdditionalSupplies =
      workspace?.additionalSupplies ??
      legacySupplies?.additional ??
      sharedPreOpData?.additionalSupplies;

    setRequiredSupplies(
      Array.isArray(
        savedRequiredSupplies,
      )
        ? savedRequiredSupplies
        : initialRequiredSupplies,
    );

    setAdditionalSupplies(
      Array.isArray(
        savedAdditionalSupplies,
      )
        ? savedAdditionalSupplies
        : initialAdditionalSupplies,
    );

    const legacyNotes =
      parseStorage(
        `intra-op-notes-${id}`,
      );

    const savedNotes =
      Array.isArray(workspace?.notes)
        ? workspace.notes
        : Array.isArray(
              legacyNotes?.notes,
            )
          ? legacyNotes.notes
          : Array.isArray(
                legacyNotes,
              )
            ? legacyNotes
            : Array.isArray(
                  sharedPreOpData?.notes,
                )
              ? sharedPreOpData.notes
              : transientWorkspaceRef
                  .current[id]
                  ?.notes ?? [];

    setNotes(savedNotes);

    transientWorkspaceRef.current[
      id
    ] = {
      notes: savedNotes,
    };

    /*
     * If the case was previously confirmed Ready, restore that workflow state
     * too. This makes Confirm Pre-Op Ready survive leaving/re-entering the page
     * and also protects against a store that is recreated after a refresh.
     */
    const wasConfirmedReady =
      workspace?.confirmedReady ===
        true ||
      sharedPreOpData?.confirmedReady ===
        true ||
      surgery.status === "Ready" ||
      surgeryMeta.preOpStatus ===
        "Ready" ||
      surgeryMeta.preOpCompleted ===
        true;

    if (
      wasConfirmedReady &&
      ["Admitted", "Pre-Op"].includes(surgery.status) &&
      surgery.paymentStatus === "Paid" && Boolean(surgery.admittedAt)
    ) {
      setPreOpStatus(
        surgery.id,
        "Ready",
      );

      updateSurgery(
        surgery.id,
        {
          status: "Ready",
          preOpCompletedAt:
            workspace?.preOpCompletedAt ??
            sharedPreOpData
              ?.preOpCompletedAt ??
            surgeryMeta.preOpCompletedAt ??
            new Date().toISOString(),
        } as any,
      );
    }

    /*
     * This state change happens together with all of the setState calls above.
     * The autosave effect will only run once the hydrated values are rendered.
     */
    setHydratedWorkspaceId(id);
  }

  function persistWorkspace(
    options?: {
      confirmedReady?: boolean;
      preOpCompletedAt?: string;
    },
  ) {
    if (!selectedId) return null;

    const id =
      String(selectedId);

    const savedAt =
      new Date().toISOString();

    let previousWorkspace:
      | Record<string, any>
      | null = null;

    try {
      const previousRaw =
        localStorage.getItem(
          `pre-op-workspace-${id}`,
        );

      if (previousRaw) {
        const parsed =
          JSON.parse(previousRaw);

        if (
          parsed &&
          typeof parsed === "object"
        ) {
          previousWorkspace =
            parsed;
        }
      }
    } catch {
      previousWorkspace = null;
    }

    const selectedMeta =
      selected
        ? getMeta(selected)
        : {};

    const confirmedReady =
      options?.confirmedReady ??
      previousWorkspace
        ?.confirmedReady ??
      Boolean(
        selected?.status === "Ready" ||
          selectedMeta.preOpStatus ===
            "Ready" ||
          selectedMeta.preOpCompleted ===
            true,
      );

    const preOpCompletedAt =
      options?.preOpCompletedAt ??
      previousWorkspace
        ?.preOpCompletedAt ??
      (typeof selectedMeta
        .preOpCompletedAt === "string"
        ? selectedMeta
            .preOpCompletedAt
        : undefined);

    const anesthesiaPlanConfirmed =
      Boolean(
        anesthesia &&
          selectedMeta.anesthesiaType ===
            anesthesia &&
          (
            selectedMeta
              .anesthesiaTypeConfirmedAt ||
            selectedMeta
              .anesthesiaCompleted
          ),
      );

    const workspace = {
      version: 2,
      completedTests,
      preOpReview,
      anesthesiaReview,
      anesthesiaExam,
      anesthesia,
      anesthesiaPlanConfirmed,
      anesthesiaTypeConfirmedAt:
        typeof selectedMeta
          .anesthesiaTypeConfirmedAt ===
        "string"
          ? selectedMeta
              .anesthesiaTypeConfirmedAt
          : undefined,
      safety,
      requiredSupplies,
      additionalSupplies,
      notes,
      confirmedReady,
      preOpCompletedAt,
      savedAt,
    };

    try {
      /*
       * Canonical snapshot used by the current page.
       */
      localStorage.setItem(
        `pre-op-workspace-${id}`,
        JSON.stringify(workspace),
      );

      /*
       * Backward-compatible split keys. getPreOpWorkflowStatus and any older
       * code that still reads these keys continue to work.
       */
      localStorage.setItem(
        `pre-op-progress-${id}`,
        JSON.stringify({
          completedTests,
          preOpReview,
          anesthesiaReview,
          anesthesiaExam,
          anesthesia,
          anesthesiaPlanConfirmed,
          anesthesiaTypeConfirmedAt:
            workspace.anesthesiaTypeConfirmedAt,
          confirmedReady,
          preOpCompletedAt,
          savedAt,
        }),
      );

      localStorage.setItem(
        `pre-op-safety-${id}`,
        JSON.stringify({
          ...safety,
          savedAt,
        }),
      );

      localStorage.setItem(
        `pre-op-supplies-${id}`,
        JSON.stringify({
          required:
            requiredSupplies,
          additional:
            additionalSupplies,
          savedAt,
        }),
      );

      localStorage.setItem(
        `intra-op-notes-${id}`,
        JSON.stringify({
          notes,
          savedAt,
        }),
      );
    } catch (error) {
      console.error(
        "Unable to persist Pre-Op workspace",
        error,
      );

      return null;
    }

    transientWorkspaceRef.current[
      id
    ] = {
      notes,
    };

    return workspace;
  }





  function closeWorkspace() {
    persistWorkspace();
    navigate("/pre-op");
  }

  function toggleValue(
    current: string[],
    value: string,
    setter: (
      value: string[],
    ) => void,
  ) {
    setter(
      current.includes(value)
        ? current.filter(
            (item) =>
              item !== value,
          )
        : [...current, value],
    );
  }

  function addException() {
    const value =
      exceptionText.trim();

    if (!value) return;

    setSafety((current) => ({
      ...current,
      exceptions: [
        ...current.exceptions,
        value,
      ],
      acknowledged: false,
    }));

    setExceptionText("");
    setShowExceptionForm(false);
  }

  function removeException(
    value: string,
  ) {
    setSafety((current) => ({
      ...current,
      exceptions:
        current.exceptions.filter(
          (item) =>
            item !== value,
        ),
      acknowledged: false,
    }));
  }

  function updateSupply(
    id: string,
    additional: boolean,
  ) {
    if (additional) {
      setAdditionalSupplies(
        (current) =>
          current.map((item) =>
            item.id === id
              ? {
                  ...item,
                  checked:
                    !item.checked,
                }
              : item,
          ),
      );
    } else {
      setRequiredSupplies(
        (current) =>
          current.map((item) =>
            item.id === id
              ? {
                  ...item,
                  checked:
                    !item.checked,
                }
              : item,
          ),
      );
    }
  }

  function addClinicalNote(reviewedText = noteText) {
    const value =
      reviewedText.trim();

    if (!value) return;

    setNotes((current) => [
      {
        id: `${Date.now()}`,
        type: noteType,
        text: value,
        createdAt:
          new Date().toISOString(),
      },
      ...current,
    ]);

    setNoteText("");
  }

  function setReviewValue(
    setter: React.Dispatch<React.SetStateAction<ReviewMap>>,
    id: string,
    value: ReviewValue,
  ) {
    setter((current) => ({
      ...current,
      [id]: {
        value,
        detail: current[id]?.detail ?? "",
      },
    }));
  }

  function setReviewDetail(
    setter: React.Dispatch<React.SetStateAction<ReviewMap>>,
    id: string,
    detail: string,
  ) {
    setter((current) => ({
      ...current,
      [id]: {
        value: current[id]?.value ?? "",
        detail,
      },
    }));
  }



  function saveProgress() {
    if (!selected) {
      showToast(
        "error",
        "Progress not saved",
        "No patient is selected.",
      );

      return;
    }

    const workspace =
      persistWorkspace();

    if (!workspace) {
      showToast(
        "error",
        "Progress not saved",
        "Browser storage could not save the Pre-Op workspace.",
      );

      return;
    }

    /*
     * Keep the shared surgery record in sync too. localStorage remains the
     * fast persistence layer, while preOpData gives us a second source when
     * the patient is opened again.
     */
    updateSurgery(
      selected.id,
      {
        preOpData: workspace,
        preOpSavedAt:
          workspace.savedAt,
      } as any,
    );

    showToast(
      "success",
      "Pre-Op progress saved",
      "All entered Pre-Op information has been saved for this patient.",
    );
  }

  function handleSelectAnesthesia(type: string) {
    setAnesthesia(type);

    const confirmedType =
      typeof selected?.anesthesiaType === "string"
        ? selected.anesthesiaType
        : "";

    setEditingAnesthesia(
      Boolean(
        anesthesiaConfirmed &&
          confirmedType !== type,
      ),
    );
  }

  function confirmAnesthesiaPlan() {
    if (
      !selected ||
      !anesthesiaTypes.includes(anesthesia)
    ) {
      return;
    }
    if (!confirmAnesthesiaType(selected.id, anesthesia)) {
      showToast("error", "Unable to confirm anesthesia", "Check the patient status and browser storage, then try again.");
      return;
    }
    setEditingAnesthesia(false);
    showToast("success", "Anesthesia type confirmed", anesthesia + " is now visible in the patient header.");
  }

  function confirmReady() {
    if (selected && selected.status !== "Pre-Op") {
      showToast("success", "Pre-Op status", selected.status === "Ready" ? "Pre-Op readiness is already recorded." : "Start Pre-Op after recording OR admission. Completed preparation cannot reset a later workflow phase.");
      return;
    }
    if (!selected) {
      showToast(
        "error",
        "Pre-Op not completed",
        "No patient is selected. Select a patient and try again.",
      );

      return;
    }

    /*
     * Confirm is also an explicit save action.
     * Save everything entered across all tabs before validation so
     * the user's work is preserved even if the case is not ready yet.
     */
    persistWorkspace();

    const missing: string[] = [];

    if (
      testProgress.completed !==
      testProgress.total
    ) {
      missing.push(
        `Pre-Operative Tests — complete all required tests (${testProgress.completed}/${testProgress.total})`,
      );
    }

    if (!selectedPlanConfirmed) {
      if (!anesthesia) {
        missing.push(
          "Anesthesia Plan — choose a Planned anesthesia type, then check Confirm Plan",
        );
      } else {
        missing.push(
          `Anesthesia Plan — check Confirm Plan so ${anesthesia} becomes confirmed`,
        );
      }
    }

    if (missing.length > 0) {
      showToast(
        "error",
        "Pre-Op is not ready yet",
        "Complete the following before marking the patient Ready for Surgery:",
        missing,
      );

      return;
    }

    try {
      /*
       * Persist once more immediately before the workflow transition.
       * localStorage writes are synchronous, so the complete workspace
       * is stored before navigating away.
       */
      const preOpCompletedAt =
        new Date().toISOString();

      const confirmedWorkspace =
        persistWorkspace({
          confirmedReady: true,
          preOpCompletedAt,
        });

      if (!confirmedWorkspace) {
        throw new Error(
          "The Pre-Op workspace could not be saved before completion.",
        );
      }

      setPreOpStatus(
        selected.id,
        "Ready",
      );

      updateSurgery(
        selected.id,
        {
          status: "Ready",
          preOpCompletedAt,
          preOpData: {
            ...confirmedWorkspace,
            confirmedReady: true,
            preOpCompletedAt,
            savedAt: preOpCompletedAt,
          },
        } as any,
      );

      const patientName =
        getPatientName(selected);

      showToast("success", "Pre-Op successful", `${patientName} is now ready for surgery.`);
    } catch (error) {
      const message =
        error instanceof Error &&
        error.message
          ? error.message
          : "Something went wrong while completing Pre-Op.";

      showToast(
        "error",
        "Pre-Op failed",
        message,
      );
    }
  }

  useEffect(() => {
    if (
      !selectedId ||
      hydratedWorkspaceId !==
        String(selectedId)
    ) {
      return;
    }

    const timer =
      window.setTimeout(() => {
        persistWorkspace();
      }, 300);

    return () =>
      window.clearTimeout(timer);
  }, [
    selectedId,
    hydratedWorkspaceId,
    completedTests,
    preOpReview,
    anesthesiaReview,
    anesthesiaExam,
    anesthesia,
    safety,
    requiredSupplies,
    additionalSupplies,
    notes,
  ]);


  
  return { selected, navigate, hydratedWorkspaceId, notes, addClinicalNote, selectedPlanConfirmed, setActiveTab, toast, setToast, showToast, workspaceHeadingRef, closeWorkspace, hasAdmissionTime, admissionDate, anesthesiaConfirmed, activeTab, preOpAssessmentProgress, testProgress, anesthesiaProgress, requiredSuppliesProgress, preOpReview, setReviewValue, setPreOpReview, setReviewDetail, completedTests, toggleValue, setCompletedTests, safety, exceptions, setShowExceptionForm, showExceptionForm, exceptionText, setExceptionText, addException, removeException, setSafety, anesthesiaReview, setAnesthesiaReview, anesthesiaExam, setAnesthesiaExam, handleSelectAnesthesia, anesthesia, confirmAnesthesiaPlan, setIntraSection, intraSection, setSupplySection, setSupplyCategory, supplySection, additionalSupplies, filteredSupplies, updateSupply, noteText, setNoteText, allPreOpReady, saveProgress, confirmReady };
}
