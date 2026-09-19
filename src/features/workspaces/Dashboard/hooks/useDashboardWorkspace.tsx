import { useMemo,useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSurgeryStore } from "../../../../store/surgeryStore";
import { TODAY } from "../config";
import { type OperatingFilter,type Period,type RoomItem,type SortDirection,type SortKey } from "../types";
import { isDateInPeriod } from "../utils";

export function useDashboardWorkspace() {
  const navigate = useNavigate();

  const surgeries = useSurgeryStore(
    (state) => state.surgeries,
  );

  const [sortKey, setSortKey] =
    useState<SortKey>("time");
  const [sortDirection, setSortDirection] =
    useState<SortDirection>("asc");
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] =
    useState("");
  const [filterOpen, setFilterOpen] =
    useState(false);
  const [selectedDoctors, setSelectedDoctors] =
    useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] =
    useState<OperatingFilter[]>([]);
  const [period, setPeriod] =
    useState<Period>("Month");
  const [selectedDate, setSelectedDate] =
    useState(TODAY);

  const PAGE_SIZE = 4;

  const todaySurgeries = useMemo(
    () =>
      surgeries
        .filter(
          (surgery) =>
            surgery.date === TODAY,
        )
        .sort(
          (a, b) =>
            a.time.localeCompare(b.time),
        ),
    [surgeries],
  );

  const counts = useMemo(
    () => ({
      ready: todaySurgeries.filter(
        (surgery) =>
          surgery.status === "Ready",
      ).length,

      inProgress: todaySurgeries.filter(
        (surgery) =>
          surgery.status === "In Progress",
      ).length,

      recovery: todaySurgeries.filter(
        (surgery) =>
          surgery.status === "Recovery",
      ).length,

      paid: todaySurgeries.filter(
        (surgery) =>
          surgery.paymentStatus === "Paid",
      ).length,

      preOpReady: todaySurgeries.filter(
        (surgery) =>
          surgery.preOpCompleted ||
          surgery.preOpStatus === "Ready",
      ).length,

      anesthesiaReady: todaySurgeries.filter(
        (surgery) =>
          surgery.anesthesiaCompleted,
      ).length,
    }),
    [todaySurgeries],
  );

  const postOpEligible = useMemo(
    () =>
      todaySurgeries.filter(
        (surgery) =>
          surgery.status === "Completed" ||
          surgery.status === "Recovery" ||
          surgery.status === "Discharged",
      ),
    [todaySurgeries],
  );

  const postOpBase = Math.max(
    postOpEligible.length,
    1,
  );

  const operativeReportRate =
    Math.round(
      (postOpEligible.filter(
        (surgery) =>
          Boolean(
            surgery.operativeReport?.trim?.(),
          ),
      ).length /
        postOpBase) *
        100,
    );

  const dischargeInstructionsRate =
    Math.round(
      (postOpEligible.filter(
        (surgery) =>
          Boolean(
            surgery.dischargeInstructions?.trim?.(),
          ),
      ).length /
        postOpBase) *
        100,
    );

  const dischargedRate =
    Math.round(
      (postOpEligible.filter(
        (surgery) =>
          surgery.status === "Discharged",
      ).length /
        postOpBase) *
        100,
    );

  const postOpAttentionCount =
    postOpEligible.filter(
      (surgery) =>
        !surgery.operativeReport?.trim?.() ||
        !surgery.dischargeInstructions?.trim?.() ||
        surgery.status !== "Discharged",
    ).length;

  const roomBoard = useMemo<RoomItem[]>(
    () => {
      const roomNames = Array.from(
        new Set(
          todaySurgeries
            .map((surgery) => surgery.room)
            .filter(Boolean),
        ),
      );

      return roomNames
        .map((room) => {
          const roomCases =
            todaySurgeries.filter(
              (surgery) =>
                surgery.room === room,
            );

          const current =
            roomCases.find(
              (surgery) =>
                surgery.status ===
                "In Progress",
            ) ??
            roomCases.find(
              (surgery) =>
                surgery.status === "Ready",
            );

          const next =
            roomCases.find(
              (surgery) =>
                surgery.id !== current?.id &&
                ![
                  "In Progress",
                  "Completed",
                  "Recovery",
                  "Discharged",
                ].includes(
                  surgery.status,
                ),
            );

          return {
            room,
            current,
            next,
          };
        })
        .slice(0, 4);
    },
    [todaySurgeries],
  );

  const doctorOptions = useMemo(
    () =>
      Array.from(
        new Set(
          surgeries
            .map((surgery) => surgery.doctor)
            .filter(Boolean),
        ),
      ).sort((a, b) =>
        a.localeCompare(b),
      ),
    [surgeries],
  );

  const availableStatuses: OperatingFilter[] = [
    "Ready",
    "In Progress",
    "Recovery",
  ];

  const filteredCases = useMemo(() => {
    const query =
      searchQuery.trim().toLowerCase();

    return surgeries.filter((surgery) => {
      const matchesSearch =
        !query ||
        [
          surgery.id,
          surgery.patientName,
          surgery.mrn,
          surgery.notes,
          surgery.surgeonNotes,
          surgery.procedure,
          surgery.doctor,
          surgery.room,
          surgery.status,
          surgery.time,
        ]
          .filter(Boolean)
          .some((value) =>
            String(value)
              .toLowerCase()
              .includes(query),
          );

      const matchesDoctor =
        selectedDoctors.length === 0 ||
        selectedDoctors.includes(
          surgery.doctor,
        );

      const matchesStatus =
        selectedStatuses.length === 0 ||
        selectedStatuses.includes(
          surgery.status as OperatingFilter,
        );

      const matchesDate = isDateInPeriod(
        surgery.date,
        selectedDate,
        period,
      );

      return (
        matchesSearch &&
        matchesDoctor &&
        matchesStatus &&
        matchesDate
      );
    });
  }, [
    surgeries,
    searchQuery,
    selectedDoctors,
    selectedStatuses,
    period,
    selectedDate,
  ]);

  const toggleDoctorFilter = (
    doctor: string,
  ) => {
    setSelectedDoctors((current) =>
      current.includes(doctor)
        ? current.filter(
            (item) => item !== doctor,
          )
        : [...current, doctor],
    );
    setPage(1);
  };

  const toggleStatusFilter = (
    status: OperatingFilter,
  ) => {
    setSelectedStatuses((current) =>
      current.includes(status)
        ? current.filter(
            (item) => item !== status,
          )
        : [...current, status],
    );
    setPage(1);
  };

  const clearTableFilters = () => {
    setSelectedDoctors([]);
    setSelectedStatuses([]);
    setPeriod("Month");
    setSelectedDate(TODAY);
    setPage(1);
  };

  const sortedCases = useMemo(() => {
    const valueFor = (
      surgery: any,
      key: SortKey,
    ) => {
      switch (key) {
        case "patient":
          return surgery.patientName ?? "";
        case "procedure":
          return surgery.procedure ?? "";
        case "notes":
          return surgery.notes || surgery.surgeonNotes || "";
        case "surgeon":
          return surgery.doctor ?? "";
        case "room":
          return surgery.room ?? "";
        case "status":
          return surgery.status ?? "";
        case "time":
        default:
          return surgery.time ?? "";
      }
    };

    return [...filteredCases].sort(
      (a, b) => {
        const first = String(
          valueFor(a, sortKey),
        ).toLowerCase();
        const second = String(
          valueFor(b, sortKey),
        ).toLowerCase();

        const result =
          first.localeCompare(
            second,
            undefined,
            {
              numeric: true,
              sensitivity: "base",
            },
          );

        return sortDirection === "asc"
          ? result
          : -result;
      },
    );
  }, [
    filteredCases,
    sortKey,
    sortDirection,
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(
      sortedCases.length / PAGE_SIZE,
    ),
  );

  const safePage = Math.min(
    page,
    totalPages,
  );

  const visibleCases = sortedCases.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  const handleSort = (
    key: SortKey,
  ) => {
    setPage(1);

    if (sortKey === key) {
      setSortDirection((current) =>
        current === "asc"
          ? "desc"
          : "asc",
      );
      return;
    }

    setSortKey(key);
    setSortDirection("asc");
  };

  const readinessBase =
    Math.max(todaySurgeries.length, 1);

  const financialRate =
    Math.round(
      (counts.paid / readinessBase) *
        100,
    );

  const preOpRate =
    Math.round(
      (counts.preOpReady /
        readinessBase) *
        100,
    );

  const anesthesiaRate =
    Math.round(
      (counts.anesthesiaReady /
        readinessBase) *
        100,
    );

  
  return { todaySurgeries, navigate, counts, postOpAttentionCount, roomBoard, searchQuery, setSearchQuery, setPage, setFilterOpen, selectedDoctors, selectedStatuses, period, selectedDate, filterOpen, clearTableFilters, doctorOptions, toggleDoctorFilter, availableStatuses, toggleStatusFilter, setPeriod, setSelectedDate, handleSort, sortKey, sortDirection, visibleCases, sortedCases, safePage, PAGE_SIZE, totalPages, operativeReportRate, dischargeInstructionsRate, dischargedRate, financialRate, preOpRate, anesthesiaRate };
}
