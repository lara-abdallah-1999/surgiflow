import { useEffect,useMemo,useRef,useState } from "react";
import { useLocation,useNavigate } from "react-router-dom";
import { useTablePageSize } from "../../../../hooks/useTablePageSize";
import { useSurgeryStore } from "../../../../store/surgeryStore";
import { ROW_HEIGHT } from "../config";
import { type Period,type SortDirection,type SortKey } from "../types";
import { getCaseNumber,getSurgerySortValue,isDateInPeriod } from "../utils";

export function useSurgeryWorkspace() {
  const navigate = useNavigate();
  const location = useLocation();

  const incomingHighlightId =
    (
      location.state as
        | { highlightSurgeryId?: string }
        | null
    )?.highlightSurgeryId ?? null;

  const highlightHandledRef =
    useRef<string | null>(null);

  const [highlightedRowId, setHighlightedRowId] =
    useState<string | null>(null);

  const surgeries = useSurgeryStore((state) => state.surgeries);
  const updateSurgery = useSurgeryStore((state) => state.updateSurgery);

  const [selectedDoctors, setSelectedDoctors] = useState<string[]>([]);
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [period, setPeriod] = useState<Period>("Day");
  const [selectedDate, setSelectedDate] = useState("2026-09-03");
  const [search, setSearch] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement | null>(null);
  const rowsContainerRef = useRef<HTMLDivElement | null>(null);
  const pageSize = useTablePageSize(rowsContainerRef, ROW_HEIGHT);

  const [page, setPage] = useState(0);
  

  const [sortKey, setSortKey] =
    useState<SortKey>("patient");

  const [sortDirection, setSortDirection] =
    useState<SortDirection>("asc");

  const [, setTimerTick] = useState(0);

  /*
   * Keep all running surgery timers live in the table.
   * This only refreshes the displayed elapsed time; it does not
   * change the shared surgery state.
   */
  useEffect(() => {
    const hasRunningSurgery = surgeries.some(
      (surgery) =>
        surgery.status === "In Progress" &&
        Boolean(surgery.surgeryStartedAt),
    );

    if (!hasRunningSurgery) return;

    const timer = window.setInterval(() => {
      setTimerTick((value) => value + 1);
    }, 1000);

    return () => window.clearInterval(timer);
  }, [surgeries]);

  function toggleDoctor(doctor: string) {
    if (doctor === "All Doctors") {
      setSelectedDoctors([]);
      return;
    }
    setSelectedDoctors((current) =>
      current.includes(doctor)
        ? current.filter((item) => item !== doctor)
        : [...current, doctor],
    );
  }

  function toggleState(state: string) {
    if (state === "All States") {
      setSelectedStates([]);
      return;
    }
    setSelectedStates((current) =>
      current.includes(state)
        ? current.filter((item) => item !== state)
        : [...current, state],
    );
  }

  function clearFilters() {
    setSelectedDoctors([]);
    setSelectedStates([]);
    setPeriod("Day");
    setSelectedDate("2026-09-03");
    setPage(0);
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

  function startSurgery(
    event: React.MouseEvent<HTMLButtonElement>,
    id: string,
  ) {
    event.stopPropagation();
    updateSurgery(id, {
      status: "In Progress",
      surgeryStartedAt: new Date().toISOString(),
    });
  }

  function completeSurgery(
    event: React.MouseEvent<HTMLButtonElement>,
    id: string,
  ) {
    event.stopPropagation();
    updateSurgery(id, {
      status: "Completed",
      surgeryCompletedAt: new Date().toISOString(),
    });
  }

  useEffect(() => {
    setPage(0);
  }, [
    selectedDoctors,
    selectedStates,
    period,
    selectedDate,
  ]);

  const filteredSurgeries = useMemo(() => {
    const query = search.trim().toLowerCase();

    return surgeries.filter((surgery) => {
      const doctorMatches =
        selectedDoctors.length === 0 || selectedDoctors.includes(surgery.doctor);
      const stateMatches =
        selectedStates.length === 0 || selectedStates.includes(surgery.status);
      const procedureText = Array.isArray((surgery as any).procedures)
        ? (surgery as any).procedures
            .map((item: any) =>
              typeof item === "string" ? item : item?.name ?? "",
            )
            .join(" ")
            .toLowerCase()
        : surgery.procedure.toLowerCase();
      const searchMatches =
        !query ||
        surgery.patientName.toLowerCase().includes(query) ||
        String(surgery.id ?? "").toLowerCase().includes(query) ||
        getCaseNumber(surgery).toLowerCase().includes(query) ||
        procedureText.includes(query) ||
        surgery.doctor.toLowerCase().includes(query);
      const dateMatches = isDateInPeriod(
        surgery.date,
        selectedDate,
        period,
      );

      return doctorMatches && stateMatches && searchMatches && dateMatches;
    });
  }, [
    surgeries,
    selectedDoctors,
    selectedStates,
    search,
    selectedDate,
    period,
  ]);

  const sortedSurgeries = useMemo(() => {
    const copy = [...filteredSurgeries];

    copy.sort((a, b) => {
      const left =
        getSurgerySortValue(
          a,
          sortKey,
        );

      const right =
        getSurgerySortValue(
          b,
          sortKey,
        );

      let result = 0;

      if (
        typeof left === "number" &&
        typeof right === "number"
      ) {
        result = left - right;
      } else {
        result = String(left).localeCompare(
          String(right),
          undefined,
          {
            numeric: true,
            sensitivity: "base",
          },
        );
      }

      return sortDirection === "asc"
        ? result
        : -result;
    });

    return copy;
  }, [
    filteredSurgeries,
    sortKey,
    sortDirection,
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(
      sortedSurgeries.length / pageSize,
    ),
  );

  const visibleSurgeries = useMemo(
    () =>
      sortedSurgeries.slice(
        page * pageSize,
        page * pageSize + pageSize,
      ),
    [
      sortedSurgeries,
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
        !filterRef.current.contains(target)
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

    const target = surgeries.find(
      (surgery) =>
        surgery.id === incomingHighlightId,
    );

    if (!target) return;

    highlightHandledRef.current =
      incomingHighlightId;

    setSearch("");
    setSelectedDoctors([]);
    setSelectedStates([]);
    setPeriod("Day");

    if (target.date) {
      setSelectedDate(target.date);
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
    surgeries,
  ]);

  useEffect(() => {
    if (!highlightedRowId) return;

    const rowIndex =
      sortedSurgeries.findIndex(
        (surgery) =>
          surgery.id === highlightedRowId,
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
    sortedSurgeries,
    pageSize,
  ]);

  useEffect(() => {
    if (page > totalPages - 1) {
      setPage(
        Math.max(0, totalPages - 1),
      );
    }
  }, [page, totalPages]);

  const totalCount = surgeries.length;
  const readyCount = surgeries.filter((s) => s.status === "Ready").length;
  const inProgressCount = surgeries.filter(
    (s) => s.status === "In Progress",
  ).length;
  const completedCount = surgeries.filter(
    (s) => s.status === "Completed",
  ).length;

  const activeFilterCount =
    selectedDoctors.length +
    selectedStates.length +
    (period !== "Day" ? 1 : 0);

  const hasActiveFilters =
    activeFilterCount > 0;

  
  return { totalCount, readyCount, inProgressCount, completedCount, search, setSearch, setPage, filterRef, setFilterOpen, filterOpen, hasActiveFilters, activeFilterCount, clearFilters, selectedDoctors, toggleDoctor, selectedStates, toggleState, setPeriod, period, selectedDate, setSelectedDate, sortKey, sortDirection, handleSort, rowsContainerRef, filteredSurgeries, visibleSurgeries, highlightedRowId, navigate, startSurgery, completeSurgery, sortedSurgeries, page, pageSize, totalPages };
}
