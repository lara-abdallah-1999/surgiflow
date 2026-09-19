import { useEffect,useMemo,useRef,useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTablePageSize } from "../../../../hooks/useTablePageSize";
import { useSurgeryStore } from "../../../../store/surgeryStore";
import { EMPTY_STATE,ROW_HEIGHT } from "../config";
import { type PatientCondition,type Period,type PostOpState,type SortDirection,type SortKey,type ToastState } from "../types";
import { getPostOpDateSortValue,getProcedureNames,hasReachedPostOp,isPostOpDateInPeriod,loadPostOp,persistPostOp } from "../utils";

export function usePostOpWorkspace() {
  const navigate = useNavigate();

  const surgeries = useSurgeryStore(
    (state) => state.surgeries,
  );


  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  

  const rowsContainerRef =
    useRef<HTMLDivElement | null>(null);
  const pageSize = useTablePageSize(rowsContainerRef, ROW_HEIGHT);

  const [selectedId, setSelectedId] =
    useState<string | null>(null);

  const [postOp, setPostOp] =
    useState<PostOpState>(EMPTY_STATE);

  

  

  

  

  

  

  

  

  const [toast, setToast] =
    useState<ToastState>(null);

  const [filterOpen, setFilterOpen] =
    useState(false);

  const [selectedDoctors, setSelectedDoctors] =
    useState<string[]>([]);

  const [selectedConditions, setSelectedConditions] =
    useState<PatientCondition[]>([]);

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

  

  

  

  /*
   * Keep every shared surgery/patient visible in the Post-Op table.
   * Patients who have not reached Post-Op appear as Not Started.
   */
  const postOpCases = useMemo(
    () => surgeries,
    [surgeries],
  );

  const reachedPostOpCount = useMemo(
    () =>
      surgeries.filter(
        hasReachedPostOp,
      ).length,
    [surgeries],
  );

  const doctors = useMemo(
    () =>
      Array.from(
        new Set(
          postOpCases.map(
            (surgery) =>
              surgery.doctor,
          ),
        ),
      ).filter(Boolean),
    [postOpCases],
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

        const reachedPostOp =
          hasReachedPostOp(
            surgery,
          );

        const matchesCondition =
          selectedConditions.length === 0 ||
          (
            reachedPostOp &&
            selectedConditions.includes(
              stored.condition,
            )
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
            return hasReachedPostOp(
              surgery,
            )
              ? stored.condition
              : "Not Started";

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

  const visibleCases = useMemo(
    () =>
      sortedCases.slice(
        page * pageSize,
        page * pageSize +
          pageSize,
      ),
    [sortedCases, page, pageSize],
  );


  

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

  const activeMedicationCount =
    postOp.medications.filter(
      (item) =>
        item.status === "Active",
    ).length;

  const pendingOrderCount =
    postOp.followUps.filter(
      (item) =>
        item.status !== "Completed",
    ).length;

  const upcomingVisitCount =
    postOp.visits.filter(
      (item) =>
        item.status === "Upcoming",
    ).length;

  useEffect(() => {
    if (!toast) return;

    const timer = window.setTimeout(
      () => setToast(null),
      3800,
    );

    return () =>
      window.clearTimeout(timer);
  }, [toast]);


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

  function toggleCondition(
    condition: PatientCondition,
  ) {
    setSelectedConditions(
      (current) =>
        current.includes(
          condition,
        )
          ? current.filter(
              (item) =>
                item !== condition,
            )
          : [
              ...current,
              condition,
            ],
    );
  }

  function clearFilters() {
    setSelectedDoctors([]);
    setSelectedConditions([]);
    setPeriod("Day");
    setSelectedDate("");
  }

  function selectPatient(
    id: string,
  ) {
    navigate(`/post-op/${id}`);
  }






















  
  return { reachedPostOpCount, activeMedicationCount, pendingOrderCount, upcomingVisitCount, search, setSearch, filterRef, setFilterOpen, filterOpen, selectedDoctors, selectedConditions, selectedDate, period, clearFilters, doctors, toggleDoctor, toggleCondition, setPeriod, setSelectedDate, setPage, sortKey, sortDirection, handleSort, rowsContainerRef, visibleCases, selectedId, selectPatient, sortedCases, page, pageSize, totalPages, toast, setToast };
}
