import { useEffect,useMemo,useRef,useState } from "react";
import { useLocation,useNavigate } from "react-router-dom";
import { useTablePageSize } from "../../../../hooks/useTablePageSize";
import { useSurgeryStore } from "../../../../store/surgeryStore";
import { initialAdditionalSupplies,initialRequiredSupplies,ROW_HEIGHT } from "../config";
import { type AnesthesiaExamState,type IntraNote,type Period,type ReviewMap,type SafetyNote,type SortDirection,type SortKey,type SupplyItem,type ToastState } from "../types";
import { getDateSortValue,getDoctor,getPatientCode,getPatientName,getPreOpWorkflowStatus,getProcedures,getSurgeryClock,isDateInPeriod } from "../utils";

export function usePreOpWorkspace() {
  const location = useLocation();
  const navigate = useNavigate();
  const workspaceHeadingRef = useRef<HTMLHeadingElement>(null);

  const routeState =
    location.state as
      | {
          highlightSurgeryId?: string;
          preOpToast?: Exclude<
            ToastState,
            null
          >;
        }
      | null;

  const incomingHighlightId =
    routeState?.highlightSurgeryId ?? null;

  const incomingPreOpToast =
    routeState?.preOpToast ?? null;

  const highlightHandledRef =
    useRef<string | null>(null);

  const [highlightedRowId, setHighlightedRowId] =
    useState<string | null>(null);

  const {
    surgeries,
    admitPatient,
    startPreOp,
  } = useSurgeryStore();

  const [selectedId] =
    useState<string | null>(null);

  useEffect(() => {
    if (selectedId) workspaceHeadingRef.current?.focus();
  }, [selectedId]);

  const [
    admitCandidateId,
    setAdmitCandidateId,
  ] = useState<string | null>(null);

  const [search, setSearch] =
    useState("");

  const [filterOpen, setFilterOpen] =
    useState(false);

  const [selectedDoctors, setSelectedDoctors] =
    useState<string[]>([]);

  const [selectedStatuses, setSelectedStatuses] =
    useState<string[]>([]);

  const [period, setPeriod] =
    useState<Period>("Day");

  const [selectedDate, setSelectedDate] =
    useState("2026-09-03");

  const [sortKey, setSortKey] =
    useState<SortKey>("date");

  const [sortDirection, setSortDirection] =
    useState<SortDirection>("asc");

  const [page, setPage] =
    useState(0);

  const rowsContainerRef =
    useRef<HTMLDivElement | null>(null);
  const pageSize = useTablePageSize(rowsContainerRef, ROW_HEIGHT);

  const filterRef =
    useRef<HTMLDivElement | null>(null);

  

  const [toast, setToast] =
    useState<ToastState>(null);

  

  

  

  

  const [completedTests] =
    useState<string[]>([]);

  const [preOpReview] =
    useState<ReviewMap>({});

  const [anesthesiaReview] =
    useState<ReviewMap>({});

  const [anesthesiaExam] =
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

  

  const [anesthesia] =
    useState("");


  const [safety] =
    useState<SafetyNote>({
      exceptions: [],
      acknowledged: false,
    });

  

  

  const [requiredSupplies] = useState<SupplyItem[]>(
    initialRequiredSupplies,
  );

  const [additionalSupplies] = useState<SupplyItem[]>(
    initialAdditionalSupplies,
  );

  const [notes] =
    useState<IntraNote[]>([]);

  

  

  /*
   * Intra-op notes are session-only while working on this page.
   * They reset naturally after a browser refresh.
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



  const admitCandidate = useMemo(
    () =>
      surgeries.find(
        (surgery) =>
          surgery.id === admitCandidateId,
      ) ?? null,
    [surgeries, admitCandidateId],
  );

  /*
   * Keep every surgery/patient visible in the Pre-Op table.
   * The row no longer moves between module tables as status changes.
   */
  const preOpCases = useMemo(
    () => surgeries,
    [surgeries],
  );

  const doctors = useMemo(
    () =>
      Array.from(
        new Set(
          preOpCases.map((surgery) =>
            getDoctor(surgery),
          ),
        ),
      ),
    [preOpCases],
  );

  const statuses = useMemo(
    () =>
      Array.from(
        new Set(
          preOpCases.map(
            (surgery) =>
              surgery.status,
          ),
        ),
      ),
    [preOpCases],
  );

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

  const visibleCases = useMemo(
    () =>
      sortedCases.slice(
        page * pageSize,
        page * pageSize +
          pageSize,
      ),
    [
      sortedCases,
      page,
      pageSize,
    ],
  );

  

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
    if (
      !incomingHighlightId ||
      highlightHandledRef.current ===
        incomingHighlightId
    ) {
      return;
    }

    const target = preOpCases.find(
      (surgery) =>
        surgery.id ===
        incomingHighlightId,
    );

    if (!target) return;

    highlightHandledRef.current =
      incomingHighlightId;

    setSearch("");
    setSelectedDoctors([]);
    setSelectedStatuses([]);
    setPeriod("Day");

    const rawDate =
      getDateSortValue(target);

    if (rawDate) {
      const date = new Date(
        String(rawDate).length === 10
          ? `${rawDate}T00:00:00`
          : String(rawDate),
      );

      if (
        !Number.isNaN(
          date.getTime(),
        )
      ) {
        setSelectedDate(
          [
            date.getFullYear(),
            String(
              date.getMonth() + 1,
            ).padStart(2, "0"),
            String(
              date.getDate(),
            ).padStart(2, "0"),
          ].join("-"),
        );
      }
    }

    setHighlightedRowId(
      incomingHighlightId,
    );

    const timer =
      window.setTimeout(() => {
        setHighlightedRowId(null);
      }, 3500);

    return () =>
      window.clearTimeout(timer);
  }, [
    incomingHighlightId,
    preOpCases,
  ]);

  useEffect(() => {
    if (!highlightedRowId) return;

    const rowIndex =
      sortedCases.findIndex(
        (surgery) =>
          surgery.id ===
          highlightedRowId,
      );

    if (rowIndex >= 0) {
      setPage(
        Math.floor(
          rowIndex / pageSize,
        ),
      );
    }
  }, [
    highlightedRowId,
    sortedCases,
    pageSize,
  ]);

  useEffect(() => {
    surgeries.forEach(
      (surgery) => {
        const id = String(
          surgery.id ?? "",
        );

        if (!id) return;

        localStorage.removeItem(
          `intra-op-notes-${id}`,
        );

        const key =
          `pre-op-progress-${id}`;

        const raw =
          localStorage.getItem(key);

        if (!raw) return;

        try {
          const parsed =
            JSON.parse(raw);

          localStorage.setItem(
            key,
            JSON.stringify({
              completedTests:
                Array.isArray(
                  parsed.completedTests,
                )
                  ? parsed.completedTests
                  : [],
              completedAssessment:
                Array.isArray(
                  parsed.completedAssessment,
                )
                  ? parsed.completedAssessment
                  : [],
              anesthesia:
                typeof parsed.anesthesia ===
                "string"
                  ? parsed.anesthesia
                  : "",
            }),
          );
        } catch {
          localStorage.removeItem(key);
        }
      },
    );
  }, [surgeries]);

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


  useEffect(() => {
    if (!incomingPreOpToast) return;

    setToast(incomingPreOpToast);

    // Consume the flash message so refreshing / revisiting the list
    // does not show the same success notification again.
    navigate(location.pathname, {
      replace: true,
      state: null,
    });
  }, [
    incomingPreOpToast,
    location.pathname,
    navigate,
  ]);

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
        current.includes(
          doctor,
        )
          ? current.filter(
              (item) =>
                item !== doctor,
            )
          : [
              ...current,
              doctor,
            ],
    );
  }

  function toggleStatus(
    status: string,
  ) {
    setSelectedStatuses(
      (current) =>
        current.includes(
          status,
        )
          ? current.filter(
              (item) =>
                item !== status,
            )
          : [
              ...current,
              status,
            ],
    );
  }

  function clearFilters() {
    setSelectedDoctors([]);
    setSelectedStatuses([]);
    setPeriod("Day");
    setSelectedDate(
      "2026-09-03",
    );
  }













  function persistWorkspace() {
    if (!selectedId) return;

    localStorage.setItem(
      `pre-op-progress-${selectedId}`,
      JSON.stringify({
        completedTests,
        preOpReview,
        anesthesiaReview,
        anesthesiaExam,
        anesthesia,
      }),
    );

    /*
     * Keep intra-op notes for this browser-page session only.
     * They are not written to localStorage.
     */
    transientWorkspaceRef.current[
      selectedId
    ] = {
      notes,
    };

    localStorage.setItem(
      `pre-op-safety-${selectedId}`,
      JSON.stringify({
        ...safety,
        acknowledged: false,
      }),
    );

    localStorage.setItem(
      `pre-op-supplies-${selectedId}`,
      JSON.stringify({
        required: requiredSupplies,
        additional: additionalSupplies,
      }),
    );

    localStorage.removeItem(
      `intra-op-notes-${selectedId}`,
    );
  }

  function selectPatient(id: string) {
    const surgery = surgeries.find((item) => item.id === id);
    if (!surgery) return;

    if (
      surgery.status !== "Pre-Op" &&
      surgery.status !== "Ready"
    ) {
      return;
    }

    navigate(`/pre-op/${id}`);
  }

  function confirmAdmission() {
    if (!admitCandidate) return;

    admitPatient(admitCandidate.id);
    setAdmitCandidateId(null);

    setToast({
      type: "success",
      title: "Patient admitted",
      message: `${getPatientName(admitCandidate)} is now inside the OR section. Pre-Op can be started.`,
    });
  }

  function beginPreOp(id: string) {
    startPreOp(id);

    const latest = useSurgeryStore
      .getState()
      .surgeries.find((item) => item.id === id);

    if (latest?.status === "Pre-Op") {
      setToast({
        type: "success",
        title: "Pre-Op started",
        message: `${getPatientName(latest)} is ready for the Pre-Op assessment.`,
      });

      navigate(`/pre-op/${id}`);
    }
  }















  useEffect(() => {
    if (!selectedId) return;

    const timer =
      window.setTimeout(() => {
        persistWorkspace();
      }, 300);

    return () =>
      window.clearTimeout(timer);
  }, [
    selectedId,
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

  const readyCasesCount = preOpCases.filter((item) => item.status === "Ready").length;
  const activePreOpCount = preOpCases.filter((item) => item.status === "Pre-Op").length;
  const paidCasesCount = preOpCases.filter((item) => item.paymentStatus === "Paid").length;
  const anesthesiaRecordedCount = preOpCases.filter((item) =>
    Boolean(item.anesthesiaType),
  ).length;

  
  return { activePreOpCount, readyCasesCount, paidCasesCount, anesthesiaRecordedCount, search, setSearch, filterRef, setFilterOpen, filterOpen, selectedDoctors, selectedStatuses, period, clearFilters, doctors, toggleDoctor, statuses, toggleStatus, setPeriod, selectedDate, setSelectedDate, setPage, sortKey, sortDirection, handleSort, rowsContainerRef, visibleCases, selectedId, highlightedRowId, selectPatient, setAdmitCandidateId, beginPreOp, sortedCases, page, pageSize, totalPages, admitCandidate, confirmAdmission, toast, setToast };
}
