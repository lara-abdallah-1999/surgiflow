import { useEffect,useMemo,useRef,useState } from "react";
import { useLocation,useNavigate } from "react-router-dom";
import { getSurgeryProcedures } from "../../../../components/surgery/SurgeryPresentation";
import { useTablePageSize } from "../../../../hooks/useTablePageSize";
import { useSurgeryStore } from "../../../../store/surgeryStore";
import { initialReceptionStatus,receptionDemographics } from "../config";
import { type Patient,type PatientStatus,type Period,type ReceptionProcedure,type ReceptionToastType,type SortDirection,type SortKey } from "../types";
import { getSharedReceptionStatus,isDateInPeriod,loadReceptionStatuses,persistReceptionStatuses,showReceptionToast } from "../utils";

export function useSurgeryReceptionWorkspace() {
  const rowsContainerRef = useRef<HTMLDivElement | null>(null);
  const pageSize = useTablePageSize(rowsContainerRef, 52);

  const navigate = useNavigate();
  const location = useLocation();

  const surgeries = useSurgeryStore((state) => state.surgeries);

  // Reception-only workflow state (Expected / Arrived / Reception In
  // Progress / Reception Checked / On Hold) and arrival time/issues -
  // these don't live on the shared Surgery record, only the final
  // "sent to cashier" hand-off does (via sendToCashierInStore below).
  const [receptionStatus] = useState<
    Record<string, PatientStatus>
  >(() => ({
    ...initialReceptionStatus,
    ...loadReceptionStatuses(),
  }));

  useEffect(() => {
    persistReceptionStatuses(receptionStatus);
  }, [receptionStatus]);

  const [arrivalTimes] = useState<Record<string, string>>(
    {}
  );

  const [issuesById] = useState<Record<string, string[]>>({});

  const patients: Patient[] = useMemo(
    () =>
      surgeries.map((surgery) => {
        const demo = receptionDemographics[surgery.id] ?? {
          mrn: `MRN-${surgery.id}`,
          age: 0,
          gender: "Female" as const,
        };

        const surgeryMeta = surgery as any;
        const fallbackSitesRaw =
          surgeryMeta.procedureSites ??
          surgeryMeta.sites ??
          surgeryMeta.procedureSide;

        const fallbackSites: string[] = Array.isArray(fallbackSitesRaw)
          ? fallbackSitesRaw
              .map((value: unknown) =>
                typeof value === "string" ? value : "",
              )
              .filter(Boolean)
          : typeof fallbackSitesRaw === "string"
            ? fallbackSitesRaw
                .split(",")
                .map((value: string) => value.trim())
                .filter(Boolean)
            : [];

        const receptionProcedures: ReceptionProcedure[] =
          getSurgeryProcedures(surgery).map((item: any, index: number) => ({
            name: String(item?.name ?? "Procedure"),
            site:
              typeof item?.site === "string"
                ? item.site
                : typeof item?.side === "string"
                  ? item.side
                  : typeof item?.location === "string"
                    ? item.location
                    : typeof item?.bodySite === "string"
                      ? item.bodySite
                      : fallbackSites[index] ?? fallbackSites[0],
          }));

        return {
          id: surgery.id,
          mrn: surgery.mrn || demo.mrn,
          name: surgery.patientName,
          age: demo.age,
          gender: demo.gender,
          procedure: surgery.procedure,
          procedures: receptionProcedures,
          surgeon: surgery.doctor,
          date: surgery.date,
          time: surgery.time,
          status:
            getSharedReceptionStatus(surgery) ??
            (
              receptionStatus[surgery.id] &&
              receptionStatus[surgery.id] !== "Expected"
                ? receptionStatus[surgery.id]
                : surgery.arrivedAt
                  ? "Reception In Progress"
                  : receptionStatus[surgery.id] ?? "Expected"
            ),
          arrivalTime:
            arrivalTimes[surgery.id] ??
            (surgery.arrivedAt
              ? new Date(surgery.arrivedAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : undefined),
          issues: issuesById[surgery.id],
        };
      }),
    [surgeries, receptionStatus, arrivalTimes, issuesById]
  );

  const [selectedId] = useState("");
  const [search, setSearch] = useState("");
  const [highlightSurgeryId, setHighlightSurgeryId] =
    useState<string | null>(null);

  const handledIncomingSurgeryRef = useRef<string | null>(null);

  const [showOnlyArrived, setShowOnlyArrived] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedDoctors, setSelectedDoctors] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<PatientStatus[]>([]);
  const [period, setPeriod] = useState<Period>("Month");
  const [selectedDate, setSelectedDate] = useState("2026-09-03");
  const [sortKey, setSortKey] = useState<SortKey>("time");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [page, setPage] = useState(0);
  
  

  useEffect(() => {
    const routeState = location.state as
      | {
          highlightSurgeryId?: string;
          receptionToast?: {
            type?: ReceptionToastType;
            title?: string;
            message?: string;
          };
        }
      | null;

    const incomingId = routeState?.highlightSurgeryId;

    if (!incomingId) return;

    // React StrictMode / patient-store updates can cause this effect to run
    // more than once. Handle each incoming case only once so the toast is
    // never duplicated.
    if (handledIncomingSurgeryRef.current === incomingId) {
      return;
    }

    const patient = patients.find(
      (item) => item.id === incomingId,
    );

    if (!patient) return;

    handledIncomingSurgeryRef.current = incomingId;

    // Reset table controls so the transferred patient is guaranteed to be
    // visible, then pin it to the first row for the short hand-off highlight.
    setSearch("");
    setShowOnlyArrived(false);
    setSelectedDoctors([]);
    setSelectedStatuses([]);
    setPeriod("Month");
    setSelectedDate(patient.date);
    setSortKey("time");
    setSortDirection("asc");
    setPage(0);
    setHighlightSurgeryId(incomingId);

    if (routeState?.receptionToast) {
      showReceptionToast(
        routeState.receptionToast.type ?? "success",
        routeState.receptionToast.title ??
          "Surgery booked successfully",
        routeState.receptionToast.message ??
          "The patient was moved to Reception.",
      );
    } else {
      showReceptionToast(
        "success",
        "Surgery booked successfully",
        "The patient was moved to Reception.",
      );
    }

    const glowTimer = window.setTimeout(() => {
      setHighlightSurgeryId((current) =>
        current === incomingId ? null : current,
      );
    }, 2000);

    // Clear React Router navigation state immediately so refresh or later
    // renders cannot replay the transfer toast.
    navigate(
      location.pathname + location.search,
      {
        replace: true,
        state: null,
      },
    );

    return () => {
      window.clearTimeout(glowTimer);
    };
  }, [
    location.pathname,
    location.search,
    location.state,
    navigate,
    patients,
  ]);


  

  

  






  const availableDoctors = useMemo(
    () => Array.from(new Set(patients.map((patient) => patient.surgeon))),
    [patients],
  );

  const availableStatuses: PatientStatus[] = [
    "Expected",
    "Arrived",
    "Reception In Progress",
    "Ready for Admission",
    "Sent to Cashier",
    "On Hold",
  ];

  const filteredPatients = useMemo(() => {
    const query = search.trim().toLowerCase();

    const filtered = patients.filter((patient) => {
      const matchesSearch =
        !query ||
        patient.name.toLowerCase().includes(query) ||
        patient.mrn.toLowerCase().includes(query) ||
        patient.procedures.some(
          (procedure) =>
            procedure.name.toLowerCase().includes(query) ||
            (procedure.site ?? "").toLowerCase().includes(query),
        );

      const matchesArrived = showOnlyArrived
        ? patient.status !== "Expected"
        : true;

      const matchesDoctor =
        selectedDoctors.length === 0 ||
        selectedDoctors.includes(patient.surgeon);

      const matchesStatus =
        selectedStatuses.length === 0 ||
        selectedStatuses.includes(patient.status);

      const matchesDate = isDateInPeriod(
        patient.date,
        selectedDate,
        period,
      );

      return (
        matchesSearch &&
        matchesArrived &&
        matchesDoctor &&
        matchesStatus &&
        matchesDate
      );
    });

    const sorted = [...filtered].sort((a, b) => {
      const getValue = (patient: Patient) => {
        switch (sortKey) {
          case "name":
            return patient.name;
          case "case":
            return patient.id;
          case "mrn":
            return patient.mrn;
          case "procedures":
            return patient.procedures
              .map((procedure) =>
                `${procedure.name} ${procedure.site ?? ""}`.trim(),
              )
              .join(" ");
          case "surgeon":
            return patient.surgeon;
          case "date":
            return patient.date;
          case "time":
            return patient.time;
          case "status":
            return patient.status;
        }
      };

      const first = String(getValue(a)).toLowerCase();
      const second = String(getValue(b)).toLowerCase();
      const comparison = first.localeCompare(second, undefined, {
        numeric: true,
      });

      return sortDirection === "asc" ? comparison : -comparison;
    });

    if (!highlightSurgeryId) {
      return sorted;
    }

    return [
      ...sorted.filter(
        (patient) => patient.id === highlightSurgeryId,
      ),
      ...sorted.filter(
        (patient) => patient.id !== highlightSurgeryId,
      ),
    ];
  }, [
    patients,
    search,
    showOnlyArrived,
    selectedDoctors,
    selectedStatuses,
    period,
    selectedDate,
    sortKey,
    sortDirection,
    highlightSurgeryId,
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredPatients.length / pageSize),
  );

  useEffect(() => {
    setPage(current => Math.min(current, totalPages - 1));
  }, [totalPages]);

  const paginatedPatients = useMemo(
    () =>
      filteredPatients.slice(
        page * pageSize,
        page * pageSize + pageSize,
      ),
    [filteredPatients, page, pageSize],
  );

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection((current) => (current === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
    setPage(0);
  };

  const toggleDoctorFilter = (doctor: string) => {
    setSelectedDoctors((current) =>
      current.includes(doctor)
        ? current.filter((item) => item !== doctor)
        : [...current, doctor],
    );
    setPage(0);
  };

  const toggleStatusFilter = (status: PatientStatus) => {
    setSelectedStatuses((current) =>
      current.includes(status)
        ? current.filter((item) => item !== status)
        : [...current, status],
    );
    setPage(0);
  };

  const clearTableFilters = () => {
    setSelectedDoctors([]);
    setSelectedStatuses([]);
    setPeriod("Month");
    setSelectedDate("2026-09-03");
    setPage(0);
  };




  const expectedCount = patients.filter(
    (patient) => patient.status === "Expected",
  ).length;

  const arrivedCount = patients.filter(
    (patient) =>
      patient.status === "Arrived" ||
      patient.status === "Reception In Progress",
  ).length;

  const readyCount = patients.filter(
    (patient) => patient.status === "Ready for Admission",
  ).length;

  const holdCount = patients.filter(
    (patient) => patient.status === "On Hold",
  ).length;










  
  return { expectedCount, arrivedCount, readyCount, holdCount, search, setSearch, setPage, setFilterOpen, selectedDoctors, selectedStatuses, filterOpen, clearTableFilters, availableDoctors, toggleDoctorFilter, availableStatuses, toggleStatusFilter, setPeriod, period, selectedDate, setSelectedDate, sortKey, sortDirection, handleSort, rowsContainerRef, paginatedPatients, selectedId, navigate, highlightSurgeryId, filteredPatients, page, pageSize, totalPages };
}
