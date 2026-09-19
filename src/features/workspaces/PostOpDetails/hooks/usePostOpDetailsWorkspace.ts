import { useEffect,useMemo,useRef,useState } from "react";
import { useNavigate,useParams } from "react-router-dom";
import { useSurgeryStore } from "../../../../store/surgeryStore";
import { EMPTY_STATE,MIN_PAGE_SIZE,ROW_HEIGHT } from "../config";
import { type ExpandedList,type FollowUpOrder,type LifestyleHabit,type LifestyleHabitType,type Medication,type MedicationStatus,type OrderStatus,type PatientCondition,type Period,type PostOpState,type PostOpVisit,type SortDirection,type SortKey,type ToastState,type VisitStatus } from "../types";
import { buildPostOpVisitWhatsAppMessage,createId,createSarahDemoState,formatDischargeDateTime,formatShortDate,formatVisitTime,getDoctorAvailableVisitSlots,getPatientPhoneForWhatsApp,getPostOpDateSortValue,getProcedureNames,isPostOpDateInPeriod,isPostOpStateEmpty,loadPostOp,openPostOpWhatsApp,persistPostOp } from "../utils";

export function usePostOpDetailsWorkspace() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const surgeries = useSurgeryStore(
    (state) => state.surgeries,
  );

  const updateSurgery = useSurgeryStore(
    (state) => state.updateSurgery,
  );

  const [search] = useState("");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);

  const rowsContainerRef =
    useRef<HTMLDivElement | null>(null);

  const selectedId = id ?? null;

  const setSelectedId = (
    nextId: string | null,
  ) => {
    navigate(
      nextId
        ? `/post-op/${nextId}`
        : "/post-op",
    );
  };

  const [postOp, setPostOp] =
    useState<PostOpState>(EMPTY_STATE);

  const [addingMedication, setAddingMedication] =
    useState(false);

  const [addingOrder, setAddingOrder] =
    useState(false);

  const [addingVisit, setAddingVisit] =
    useState(false);

  const [addingLifestyle, setAddingLifestyle] =
    useState(false);

  const [newLifestyleType, setNewLifestyleType] =
    useState<LifestyleHabitType>("Walking");

  const [newLifestyleInstruction, setNewLifestyleInstruction] =
    useState("");

  const [lifestyleTypePanelOpen, setLifestyleTypePanelOpen] =
    useState(false);

  const [expandedList, setExpandedList] =
    useState<ExpandedList>(null);

  const [reportOpen, setReportOpen] =
    useState(false);

  const [reportExpanded, setReportExpanded] =
    useState(false);

  const [surgeonReport, setSurgeonReport] =
    useState("");

  const reportEditorRef =
    useRef<HTMLDivElement | null>(null);

  const savedReportRangeRef =
    useRef<Range | null>(null);

  const [recoveryNotesOpen, setRecoveryNotesOpen] =
    useState(false);

  const [noteOpen, setNoteOpen] =
    useState(false);

  const [noteDraft, setNoteDraft] =
    useState("");

  const [toast, setToast] =
    useState<ToastState>(null);

  const [filterOpen, setFilterOpen] =
    useState(false);

  const [selectedDoctors] =
    useState<string[]>([]);

  const [selectedConditions] =
    useState<PatientCondition[]>([]);

  const [period] =
    useState<Period>("Day");

  const [selectedDate] =
    useState("");

  const [sortKey] =
    useState<SortKey>("date");

  const [sortDirection] =
    useState<SortDirection>("asc");

  const filterRef =
    useRef<HTMLDivElement | null>(null);

  const [medicationDraft, setMedicationDraft] =
    useState({
      name: "",
      dose: "",
      frequency: "",
      duration: "",
    });

  const [orderDraft, setOrderDraft] =
    useState({
      type: "Lab Test" as FollowUpOrder["type"],
      name: "",
      dueDate: "",
    });

  const [visitDraft, setVisitDraft] =
    useState({
      date: "",
      time: "",
      progress: "",
      notes: "",
    });

  const postOpCases = useMemo(
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


  const filteredCases = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    return postOpCases.filter(
      (surgery) => {
        const procedures =
          getProcedureNames(
            surgery,
          )
            .join(" ")
            .toLowerCase();

        const stored =
          loadPostOp(
            surgery.id,
          );

        const matchesSearch =
          !query ||
          surgery.patientName
            .toLowerCase()
            .includes(query) ||
          surgery.id
            .toLowerCase()
            .includes(query) ||
          surgery.doctor
            .toLowerCase()
            .includes(query) ||
          procedures.includes(
            query,
          );

        const matchesDoctor =
          selectedDoctors.length === 0 ||
          selectedDoctors.includes(
            surgery.doctor,
          );

        const matchesCondition =
          selectedConditions.length === 0 ||
          selectedConditions.includes(
            stored.condition,
          );

        const matchesDate =
          !selectedDate ||
          isPostOpDateInPeriod(
            surgery,
            selectedDate,
            period,
          );


        return (
          matchesSearch &&
          matchesDoctor &&
          matchesCondition &&
          matchesDate
        );
      },
    );
  }, [
    postOpCases,
    search,
    selectedDoctors,
    selectedConditions,
    selectedDate,
    period,
  ]);

  const sortedCases = useMemo(() => {
    const copy = [
      ...filteredCases,
    ];

    copy.sort((a, b) => {
      const getValue = (
        surgery: (typeof copy)[number],
      ) => {
        const stored =
          loadPostOp(
            surgery.id,
          );

        switch (sortKey) {
          case "patient":
            return surgery.patientName;

          case "patientId":
            return surgery.id;

          case "procedures":
            return getProcedureNames(
              surgery,
            ).join(" ");

          case "surgeon":
            return surgery.doctor;

          case "date":
            return getPostOpDateSortValue(
              surgery,
            );

          case "condition":
            return stored.condition;

          case "followUp":
            return stored.followUps.filter(
              (item) =>
                item.status !==
                "Completed",
            ).length;

          default:
            return "";
        }
      };

      const aValue =
        getValue(a);

      const bValue =
        getValue(b);

      const result =
        typeof aValue === "number" &&
        typeof bValue === "number"
          ? aValue - bValue
          : String(
              aValue,
            ).localeCompare(
              String(bValue),
              undefined,
              {
                numeric: true,
                sensitivity: "base",
              },
            );

      return sortDirection ===
        "asc"
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


  const selected = surgeries.find(
    (surgery) =>
      surgery.id === selectedId,
  );

  useEffect(() => {
    if (!selectedId || !selected) return;

    const stored =
      loadPostOp(selectedId);

    if (
      selectedId === "SRG-2048" &&
      isPostOpStateEmpty(stored)
    ) {
      setPostOp(
        createSarahDemoState(),
      );
    } else {
      setPostOp(stored);
    }

    const currentReport =
      stored.surgeonReport ||
      selected.operativeReport ||
      "";

    setSurgeonReport(currentReport);

    setPostOp((current) => ({
      ...current,
      surgeonReport: currentReport,
    }));
  }, [selectedId, selected?.operativeReport]);


  useEffect(() => {
    const element = rowsContainerRef.current;

    if (!element) return;

    const updatePageSize = () => {
      const availableHeight =
        element.getBoundingClientRect().height;

      const nextPageSize = Math.max(
        MIN_PAGE_SIZE,
        Math.floor(
          availableHeight / ROW_HEIGHT,
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
      new ResizeObserver(updatePageSize);

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
    if (page > totalPages - 1) {
      setPage(
        Math.max(
          0,
          totalPages - 1,
        ),
      );
    }
  }, [page, totalPages]);

  useEffect(() => {
    /*
     * Post-Op always opens on the patient table.
     * Only close an already-open drawer if its patient is no longer
     * available after filtering; never auto-select the first record.
     */
    if (
      selectedId &&
      !filteredCases.some(
        (item) =>
          item.id === selectedId,
      )
    ) {
      setSelectedId(null);
      setPostOp(EMPTY_STATE);
    }
  }, [
    filteredCases,
    selectedId,
  ]);

  useEffect(() => {
    if (!selectedId) return;

    const timer =
      window.setTimeout(() => {
        persistPostOp(
          selectedId,
          postOp,
        );
      }, 250);

    return () =>
      window.clearTimeout(timer);
  }, [selectedId, postOp]);




  useEffect(() => {
    if (!toast) return;

    const timer = window.setTimeout(
      () => setToast(null),
      3800,
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

  useEffect(() => {
    setPage(0);
  }, [
    search,
    selectedDoctors,
    selectedConditions,
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






  function addMedication() {
    const missing: string[] = [];

    if (!medicationDraft.name.trim()) {
      missing.push(
        "Medication name is required",
      );
    }

    if (!medicationDraft.dose.trim()) {
      missing.push(
        "Dose is required",
      );
    }

    if (
      !medicationDraft.frequency.trim()
    ) {
      missing.push(
        "Frequency is required",
      );
    }

    if (
      !medicationDraft.duration.trim()
    ) {
      missing.push(
        "Duration is required",
      );
    }

    if (missing.length > 0) {
      showToast(
        "error",
        "Medication not added",
        "Please complete the following required fields:",
        missing,
      );

      return;
    }

    try {
      const item: Medication = {
        id: createId("med"),
        name:
          medicationDraft.name.trim(),
        dose:
          medicationDraft.dose.trim(),
        frequency:
          medicationDraft.frequency.trim(),
        duration:
          medicationDraft.duration.trim(),
        status: "Active",
        stopReason: "",
      };

      setPostOp((current) => ({
        ...current,
        medications: [
          ...current.medications,
          item,
        ],
      }));

      setMedicationDraft({
        name: "",
        dose: "",
        frequency: "",
        duration: "",
      });

      setAddingMedication(false);

      showToast(
        "success",
        "Medication added",
        `${item.name} was added successfully to the Post-Op medication plan.`,
      );
    } catch (error) {
      showToast(
        "error",
        "Medication not added",
        error instanceof Error
          ? error.message
          : "Something went wrong while adding the medication.",
      );
    }
  }

  function updateMedication(
    id: string,
    nextItem: Medication,
  ) {
    setPostOp((current) => ({
      ...current,
      medications:
        current.medications.map(
          (item) =>
            item.id === id
              ? nextItem
              : item,
        ),
    }));
  }

  function deleteMedication(
    id: string,
  ) {
    setPostOp((current) => ({
      ...current,
      medications:
        current.medications.filter(
          (item) =>
            item.id !== id,
        ),
    }));
  }

  function updateMedicationStatus(
    id: string,
    status: MedicationStatus,
    stopReason = "",
  ) {
    setPostOp((current) => ({
      ...current,
      medications:
        current.medications.map(
          (item) =>
            item.id === id
              ? {
                  ...item,
                  status,
                  stopReason:
                    status === "Stopped"
                      ? stopReason
                      : "",
                }
              : item,
        ),
    }));
  }

  function addFollowUpOrder() {
    const missing: string[] = [];

    if (!orderDraft.type) {
      missing.push(
        "Request type is required",
      );
    }

    if (!orderDraft.name.trim()) {
      missing.push(
        "Test or imaging name is required",
      );
    }

    if (!orderDraft.dueDate) {
      missing.push(
        "Due date is required",
      );
    }

    if (missing.length > 0) {
      showToast(
        "error",
        "Request not added",
        "Please complete the following required fields:",
        missing,
      );

      return;
    }

    try {
      const item: FollowUpOrder = {
        id: createId("order"),
        type: orderDraft.type,
        name:
          orderDraft.name.trim(),
        dueDate:
          orderDraft.dueDate,
        status: "Requested",
        result: "",
      };

      setPostOp((current) => ({
        ...current,
        followUps: [
          ...current.followUps,
          item,
        ],
      }));

      setOrderDraft({
        type: "Lab Test",
        name: "",
        dueDate: "",
      });

      setAddingOrder(false);

      showToast(
        "success",
        "Request added",
        `${item.name} was added successfully to Tests & Imaging.`,
      );
    } catch (error) {
      showToast(
        "error",
        "Request not added",
        error instanceof Error
          ? error.message
          : "Something went wrong while adding the request.",
      );
    }
  }

  function updateOrder(
    id: string,
    nextItem: FollowUpOrder,
  ) {
    setPostOp((current) => ({
      ...current,
      followUps:
        current.followUps.map(
          (item) =>
            item.id === id
              ? nextItem
              : item,
        ),
    }));
  }

  function deleteOrder(
    id: string,
  ) {
    setPostOp((current) => ({
      ...current,
      followUps:
        current.followUps.filter(
          (item) =>
            item.id !== id,
        ),
    }));
  }

  function updateOrderStatus(
    id: string,
    status: OrderStatus,
  ) {
    setPostOp((current) => ({
      ...current,
      followUps:
        current.followUps.map(
          (item) =>
            item.id === id
              ? {
                  ...item,
                  status,
                }
              : item,
        ),
    }));
  }


  function updateOrderResult(
    id: string,
    result: string,
  ) {
    setPostOp((current) => ({
      ...current,
      followUps:
        current.followUps.map(
          (item) =>
            item.id === id
              ? {
                  ...item,
                  result,
                }
              : item,
        ),
    }));
  }

  function addVisit() {
    if (!selected) {
      showToast(
        "error",
        "Visit not scheduled",
        "No patient is selected.",
      );

      return;
    }

    const missing: string[] = [];

    if (!visitDraft.date) {
      missing.push(
        "Visit date is required",
      );
    }

    if (!visitDraft.time) {
      missing.push(
        "Available time slot is required",
      );
    }

    if (!visitDraft.progress.trim()) {
      missing.push(
        "Visit purpose is required",
      );
    }

    if (missing.length > 0) {
      showToast(
        "error",
        "Visit not scheduled",
        "Please complete the following required fields:",
        missing,
      );

      return;
    }

    const availableSlots =
      getDoctorAvailableVisitSlots(
        selected.doctor,
        visitDraft.date,
        surgeries,
        postOp.visits,
      );

    if (
      availableSlots.length === 0
    ) {
      showToast(
        "error",
        "Date is not available",
        `${selected.doctor} has no available Post-Op visit slots on ${formatShortDate(
          visitDraft.date,
        )}. Please choose another date.`,
      );

      return;
    }

    try {
      const item: PostOpVisit = {
        id: createId("visit"),
        date: visitDraft.date,
        time: visitDraft.time,
        status: "Upcoming",
        condition:
          postOp.condition,
        progress:
          visitDraft.progress.trim(),
        notes:
          visitDraft.notes.trim(),
        result: "",
      };

      setPostOp((current) => ({
        ...current,
        visits: [
          ...current.visits,
          item,
        ],
      }));

      setVisitDraft({
        date: "",
        time: "",
        progress: "",
        notes: "",
      });

      setAddingVisit(false);

      const patientPhone =
        getPatientPhoneForWhatsApp(
          selected,
        );

      const medicationsForMessage = [
        ...postOp.medications,
      ];

      const followUpsForMessage = [
        ...postOp.followUps,
      ];

      openPostOpWhatsApp(
        patientPhone,
        buildPostOpVisitWhatsAppMessage({
          action: "booked",
          patientName:
            selected.patientName,
          doctor:
            selected.doctor,
          date: item.date,
          time: item.time,
          medications:
            medicationsForMessage,
          followUps:
            followUpsForMessage,
        }),
      );

      showToast(
        "success",
        "Post-Op visit scheduled",
        `${selected.patientName}'s visit with ${selected.doctor} was scheduled for ${formatShortDate(
          item.date,
        )} at ${formatVisitTime(
          item.time,
        )}.`,
      );
    } catch (error) {
      showToast(
        "error",
        "Visit not scheduled",
        error instanceof Error
          ? error.message
          : "Something went wrong while scheduling the Post-Op visit.",
      );
    }
  }

  function updateVisit(
    id: string,
    nextVisit: PostOpVisit,
  ) {
    if (!selected) return;

    const previous =
      postOp.visits.find(
        (visit) =>
          visit.id === id,
      );

    setPostOp((current) => ({
      ...current,
      visits:
        current.visits.map(
          (visit) =>
            visit.id === id
              ? nextVisit
              : visit,
        ),
    }));

    const patientPhone =
      getPatientPhoneForWhatsApp(
        selected,
      );

    openPostOpWhatsApp(
      patientPhone,
      buildPostOpVisitWhatsAppMessage({
        action: "updated",
        patientName:
          selected.patientName,
        doctor:
          selected.doctor,
        date: nextVisit.date,
        time: nextVisit.time,
        previousDate:
          previous?.date,
        previousTime:
          previous?.time,
        medications:
          postOp.medications,
        followUps:
          postOp.followUps,
      }),
    );

    showToast(
      "success",
      "Post-Op visit updated",
      `${selected.patientName}'s visit was updated to ${formatShortDate(
        nextVisit.date,
      )} at ${formatVisitTime(
        nextVisit.time,
      )}.`,
    );
  }

  function deleteVisit(
    id: string,
  ) {
    if (!selected) return;

    const removedVisit =
      postOp.visits.find(
        (visit) =>
          visit.id === id,
      );

    setPostOp((current) => ({
      ...current,
      visits:
        current.visits.filter(
          (visit) =>
            visit.id !== id,
        ),
    }));

    if (removedVisit) {
      const patientPhone =
        getPatientPhoneForWhatsApp(
          selected,
        );

      openPostOpWhatsApp(
        patientPhone,
        buildPostOpVisitWhatsAppMessage({
          action: "cancelled",
          patientName:
            selected.patientName,
          doctor:
            selected.doctor,
          date:
            removedVisit.date,
          time:
            removedVisit.time,
          medications: [
            ...postOp.medications,
          ],
          followUps: [
            ...postOp.followUps,
          ],
        }),
      );

      showToast(
        "success",
        "Post-Op visit cancelled",
        `${selected.patientName}'s visit on ${formatShortDate(
          removedVisit.date,
        )} at ${formatVisitTime(
          removedVisit.time,
        )} was cancelled.`,
      );
    }
  }

  function updateVisitStatus(
    id: string,
    status: VisitStatus,
  ) {
    setPostOp((current) => ({
      ...current,
      visits:
        current.visits.map(
          (visit) =>
            visit.id === id
              ? {
                  ...visit,
                  status,
                  condition:
                    status ===
                    "Completed"
                      ? current.condition
                      : visit.condition,
                }
              : visit,
        ),
    }));
  }


  function updateVisitResult(
    id: string,
    result: string,
  ) {
    setPostOp((current) => ({
      ...current,
      visits:
        current.visits.map(
          (visit) =>
            visit.id === id
              ? {
                  ...visit,
                  result,
                }
              : visit,
        ),
    }));
  }

  function savePostOp() {
  if (!selected) {
    showToast(
      "error",
      "Post-Op plan not saved",
      "No patient is selected.",
    );

    return;
  }

  try {
    const patientId = selected.id;
    const patientName = selected.patientName;

    persistPostOp(
      patientId,
      postOp,
    );

    updateSurgery(
      patientId,
      {
        postOpCompleted: true,

        postOpCondition:
          postOp.condition,

        postOpInstructions:
          postOp.instructions,

        postOpMedications:
          postOp.medications,

        postOpFollowUps:
          postOp.followUps,

        postOpVisits:
          postOp.visits,

        postOpDischargeChecklist:
          postOp.dischargeChecklist,

        postOpDischarged:
          postOp.discharged,
      } as any,
    );

    showToast(
      "success",
      "Post-Op plan saved",
      `${patientName}'s medications, follow-ups and visits were saved successfully.`,
    );

    window.setTimeout(() => {
      navigate(
        `/patients/${encodeURIComponent(patientId)}`,
      );
    }, 900);
  } catch (error) {
    showToast(
      "error",
      "Post-Op plan not saved",
      error instanceof Error
        ? error.message
        : "Something went wrong while saving the post-op plan.",
    );
  }
}


  const dischargeReady =
    postOp.condition !==
    "Needs Attention";

  function addLifestyleHabit() {
    const instruction =
      newLifestyleInstruction.trim();

    if (!instruction) {
      showToast(
        "error",
        "Lifestyle instruction required",
        "Add the instruction the patient should follow before saving the habit.",
      );

      return;
    }

    const newHabit: LifestyleHabit = {
      id: `lifestyle-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 7)}`,
      type: newLifestyleType,
      instruction,
    };

    setPostOp((current) => ({
      ...current,
      lifestyle: [
        ...current.lifestyle,
        newHabit,
      ],
    }));

    setNewLifestyleInstruction("");
    setLifestyleTypePanelOpen(false);
    setAddingLifestyle(false);
  }

  function updateLifestyleHabit(
    id: string,
    instruction: string,
  ) {
    setPostOp((current) => ({
      ...current,
      lifestyle:
        current.lifestyle.map(
          (habit) =>
            habit.id === id
              ? {
                  ...habit,
                  instruction,
                }
              : habit,
        ),
    }));
  }

  function removeLifestyleHabit(
    id: string,
  ) {
    setPostOp((current) => ({
      ...current,
      lifestyle:
        current.lifestyle.filter(
          (habit) =>
            habit.id !== id,
        ),
    }));
  }

  function openSurgeonReport() {
    const currentReport =
      postOp.surgeonReport ||
      surgeonReport ||
      selected?.operativeReport ||
      "";

    setSurgeonReport(currentReport);
    setReportOpen(true);

    window.requestAnimationFrame(() => {
      if (reportEditorRef.current) {
        reportEditorRef.current.innerHTML =
          currentReport;
      }
    });
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

    try {
      document.execCommand(
        "styleWithCSS",
        false,
        "true",
      );
    } catch {}

    if (command === "hiliteColor") {
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
    setSurgeonReport(
      editor.innerHTML,
    );
  }

  function handleReportInput(
    event: React.FormEvent<HTMLDivElement>,
  ) {
    const html =
      event.currentTarget.innerHTML;

    setSurgeonReport(html);

    setPostOp((current) => ({
      ...current,
      surgeonReport: html,
    }));
  }

  function toggleReportExpanded() {
    const html =
      reportEditorRef.current?.innerHTML ??
      surgeonReport;

    setSurgeonReport(html);

    setReportExpanded(
      (current) => !current,
    );

    window.requestAnimationFrame(() => {
      reportEditorRef.current?.focus();
    });
  }

  function closeReportEditor() {
    const html =
      reportEditorRef.current?.innerHTML ??
      surgeonReport;

    setSurgeonReport(html);

    setPostOp((current) => ({
      ...current,
      surgeonReport: html,
    }));

    setReportExpanded(false);
    setReportOpen(false);
  }

  function saveSurgeonReport() {
    if (!selected) return;

    const html =
      reportEditorRef.current?.innerHTML ??
      surgeonReport;

    const nextPostOp = {
      ...postOp,
      surgeonReport: html,
    };

    setSurgeonReport(html);
    setPostOp(nextPostOp);

    persistPostOp(
      selected.id,
      nextPostOp,
    );

    updateSurgery(
      selected.id,
      {
        operativeReport: html,
      } as any,
    );

    showToast(
      "success",
      "Surgeon report saved",
      `${selected.patientName}'s Surgeon Post-Operative Report was saved successfully.`,
    );

    setReportExpanded(false);
    setReportOpen(false);
  }


  function dischargePatient() {
    if (!selected) {
      showToast(
        "error",
        "Patient not ready for discharge",
        "No patient is selected.",
      );

      return;
    }

    if (!dischargeReady) {
      showToast(
        "error",
        "Patient not ready for discharge",
        "Set the patient condition to Improving or Stable before discharge.",
      );

      return;
    }

    const dischargedAt =
      new Date().toISOString();

    const next = {
      ...postOp,
      discharged: true,
      dischargedAt,
    };

    setPostOp(next);

    persistPostOp(
      selected.id,
      next,
    );

    updateSurgery(
      selected.id,
      {
        status: "Discharged",
        postOpCompleted: true,
        postOpDischarged: true,
        dischargedAt,
      } as any,
    );

    showToast(
      "success",
      "Patient discharged successfully",
      `${selected.patientName} completed the Post-Op plan and was discharged on ${formatDischargeDateTime(
        dischargedAt,
      )}.`,
    );
  }

  
  return { selected, navigate, postOp, surgeonReport, openSurgeonReport, setRecoveryNotesOpen, setNoteDraft, setNoteOpen, setAddingMedication, addingMedication, medicationDraft, setMedicationDraft, addMedication, updateMedicationStatus, updateMedication,toast,
  setToast,
  showToast, deleteMedication, setExpandedList, setAddingOrder, addingOrder, orderDraft, setOrderDraft, addFollowUpOrder, updateOrderStatus, updateOrderResult, updateOrder, deleteOrder, setAddingLifestyle, setNewLifestyleInstruction, addingLifestyle, setLifestyleTypePanelOpen, lifestyleTypePanelOpen, newLifestyleType, setNewLifestyleType, newLifestyleInstruction, addLifestyleHabit, updateLifestyleHabit, removeLifestyleHabit, setAddingVisit, addingVisit, visitDraft, setVisitDraft, surgeries, addVisit, updateVisitStatus, updateVisitResult, updateVisit, deleteVisit, setPostOp, dischargeReady, dischargePatient, savePostOp, noteOpen, noteDraft, recoveryNotesOpen, reportOpen, reportExpanded, closeReportEditor, saveSurgeonReport, toggleReportExpanded, applyReportCommand, rememberReportSelection, reportEditorRef, handleReportInput, expandedList };
}
