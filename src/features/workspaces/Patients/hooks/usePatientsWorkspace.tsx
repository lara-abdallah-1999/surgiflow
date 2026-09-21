import { useEffect,useMemo,useRef,useState } from "react";
import { useNavigate } from "react-router-dom";
import { patients } from "../../../../data/patients";
import { useTablePageSize } from "../../../../hooks/useTablePageSize";
import { useSurgeryStore } from "../../../../store/surgeryStore";
import { type Period,type SortDirection,type SortKey } from "../types";
import { isPatientDateInPeriod } from "../utils";

export function usePatientsWorkspace() {
  const rowsContainerRef = useRef<HTMLDivElement | null>(null);
  const pageSize = useTablePageSize(rowsContainerRef, 48);

  const navigate = useNavigate();
  const surgeries = useSurgeryStore((state) => state.surgeries);

  const [search, setSearch] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);

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

  const [page, setPage] = useState(1);

  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setFilterOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const enrichedPatients = useMemo(() => {
    return patients.map((patient) => {
      const surgery = surgeries.find(
        (item) =>
          item.id === patient.id ||
          item.patientId === patient.id,
      ) as
        | ((typeof surgeries)[number] & {
            mrn?: string;
            age?: number;
            gender?: string;
            phone?: string;
            patientPhone?: string;
            phoneNumber?: string;
            patientPhoneNumber?: string;
            mobile?: string;
            patientMobile?: string;
          })
        | undefined;

      const rawPatient = patient as typeof patient & {
        mrn?: string;
        age?: number;
        gender?: string;
        phone?: string;
        patientPhone?: string;
        phoneNumber?: string;
        patientPhoneNumber?: string;
        mobile?: string;
        patientMobile?: string;
      };

      return {
        ...patient,
        mrn: surgery?.mrn ?? rawPatient.mrn ?? "—",
        age: surgery?.age ?? rawPatient.age,
        gender: surgery?.gender ?? rawPatient.gender ?? "—",
        phone:
          surgery?.phone ??
          surgery?.patientPhone ??
          surgery?.phoneNumber ??
          surgery?.patientPhoneNumber ??
          surgery?.mobile ??
          surgery?.patientMobile ??
          rawPatient.phone ??
          rawPatient.patientPhone ??
          rawPatient.phoneNumber ??
          rawPatient.patientPhoneNumber ??
          rawPatient.mobile ??
          rawPatient.patientMobile ??
          "—",
      };
    });
  }, [surgeries]);

  const doctors = useMemo(
    () =>
      Array.from(
        new Set(
          enrichedPatients.map(
            (patient) =>
              patient.surgeon,
          ),
        ),
      ).filter(Boolean),
    [enrichedPatients],
  );

  const filteredPatients = useMemo(() => {
    const query = search
      .toLowerCase()
      .trim();

    return enrichedPatients.filter(
      (patient) => {
        const matchesSearch =
          !query ||
          patient.name
            .toLowerCase()
            .includes(query) ||
          patient.id
            .toLowerCase()
            .includes(query) ||
          patient.mrn
            .toLowerCase()
            .includes(query) ||
          patient.phone
            .toLowerCase()
            .includes(query) ||
          patient.procedure
            .toLowerCase()
            .includes(query) ||
          patient.surgeon
            .toLowerCase()
            .includes(query);

        const matchesDoctor =
          selectedDoctors.length === 0 ||
          selectedDoctors.includes(
            patient.surgeon,
          );

        const matchesStatus =
          selectedStatuses.length === 0 ||
          selectedStatuses.includes(
            patient.status,
          );

        const matchesDate =
          !selectedDate ||
          isPatientDateInPeriod(
            patient.surgeryDate,
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
    enrichedPatients,
    search,
    selectedDoctors,
    selectedStatuses,
    selectedDate,
    period,
  ]);

  const sortedPatients = useMemo(() => {
    const copy = [
      ...filteredPatients,
    ];

    copy.sort((a, b) => {
      const getValue = (
        patient: (typeof copy)[number],
      ) => {
        switch (sortKey) {
          case "patient":
            return patient.name;

          case "case":
            return patient.id;

          case "mrn":
            return patient.mrn;

          case "phone":
            return patient.phone;

          case "procedure":
            return patient.procedure;

          case "doctor":
            return patient.surgeon;

          case "date":
            return patient.surgeryDate;

          case "status":
            return patient.status;

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
    filteredPatients,
    sortKey,
    sortDirection,
  ]);

  useEffect(() => {
    setPage(1);
  }, [
    search,
    selectedDoctors,
    selectedStatuses,
    selectedDate,
    period,
  ]);

  const totalPatients = enrichedPatients.length;

  const activePatients = enrichedPatients.filter(
    (patient) =>
      patient.status === "In Surgery" ||
      patient.status === "Confirmed" ||
      patient.status === "Pre-Op",
  ).length;

  const waitingPatients = enrichedPatients.filter(
    (patient) =>
      patient.status === "Today",
  ).length;

  const dischargedPatients = enrichedPatients.filter(
    (patient) =>
      patient.status === "Discharged",
  ).length;

  const totalPages = Math.max(
    1,
    Math.ceil(
      sortedPatients.length /
        pageSize,
    ),
  );

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const visiblePatients = useMemo(() => {
    const start =
      (page - 1) * pageSize;

    return sortedPatients.slice(
      start,
      start + pageSize,
    );
  }, [sortedPatients, page, pageSize]);

  const firstVisible =
    sortedPatients.length === 0
      ? 0
      : (page - 1) * pageSize + 1;

  const lastVisible = Math.min(
    page * pageSize,
    sortedPatients.length,
  );

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
        current.includes(status)
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
    setSelectedDate("");
  }

  
  return { totalPatients, activePatients, waitingPatients, dischargedPatients, search, setSearch, filterRef, setFilterOpen, filterOpen, selectedDoctors, selectedStatuses, selectedDate, period, clearFilters, doctors, toggleDoctor, toggleStatus, setPeriod, setSelectedDate, setPage, sortKey, sortDirection, handleSort, rowsContainerRef, visiblePatients, navigate, firstVisible, lastVisible, sortedPatients, pageSize, page, totalPages };
}
