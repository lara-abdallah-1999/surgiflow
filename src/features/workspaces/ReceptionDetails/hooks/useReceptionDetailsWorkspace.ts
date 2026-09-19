import { useEffect,useMemo,useRef,useState } from "react";
import { useLocation,useNavigate,useParams } from "react-router-dom";
import { getSurgeryProcedures } from "../../../../components/surgery/SurgeryPresentation";
import { useSurgeryStore } from "../../../../store/surgeryStore";
import { admissionFormItems,checklistItems,initialReceptionStatus,PAGE_SIZE,receptionDemographics } from "../config";
import { type AdmissionFormItem,type ConsentFormDetails,type Patient,type PatientStatus,type Period,type ReceptionConsentApproval,type ReceptionProcedure,type ReceptionToastType,type SortDirection,type SortKey } from "../types";
import { createAdmissionFormsState,createConsentApproval,createConsentFormDetails,getSharedReceptionStatus,isConsentFormComplete,isDateInPeriod,showReceptionToast } from "../utils";

export function useReceptionDetailsWorkspace() {
  const navigate = useNavigate();
  const location = useLocation();

  const surgeries = useSurgeryStore((state) => state.surgeries);
  const markArrivedInStore = useSurgeryStore((state) => state.markArrived);
  const sendToCashierInStore = useSurgeryStore(
    (state) => state.sendToCashier
  );

  // Reception-only workflow state (Expected / Arrived / Reception In
  // Progress / Reception Checked / On Hold) and arrival time/issues -
  // these don't live on the shared Surgery record, only the final
  // "sent to cashier" hand-off does (via sendToCashierInStore below).
  const [receptionStatus, setReceptionStatus] = useState<
    Record<string, PatientStatus>
  >(() => ({ ...initialReceptionStatus }));

  const [arrivalTimes, setArrivalTimes] = useState<Record<string, string>>(
    {}
  );

  const [issuesById, setIssuesById] = useState<Record<string, string[]>>({});

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
            receptionStatus[surgery.id] ??
            initialReceptionStatus[surgery.id] ??
            "Expected",
          arrivalTime:
            arrivalTimes[surgery.id],
          issues: issuesById[surgery.id],
        };
      }),
    [surgeries, receptionStatus, arrivalTimes, issuesById]
  );

  const { id } = useParams<{ id: string }>();
  const [selectedIdState, setSelectedId] = useState(id ?? "");
  const selectedId = id ?? selectedIdState;

  useEffect(() => {
    // Remove Reception progress saved by older versions of this page.
    // The current prototype intentionally resets ReceptionDetails on refresh.
    try {
      localStorage.removeItem("surgery-reception-status");

      if (selectedId) {
        localStorage.removeItem(
          `reception-details-${selectedId}`,
        );
      }
    } catch {
      // Ignore storage access errors.
    }
  }, [selectedId]);

  useEffect(() => {
    if (id) setSelectedId(id);
  }, [id]);
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
  const [showHoldModal, setShowHoldModal] = useState(false);
  const [holdReason, setHoldReason] = useState("");

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


  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({
    identity: true,
    procedure: true,
    consent: false,
    fasting: true,
    belongings: false,
    contact: true,
    wristband: false,
  });

  const [admissionFormsById, setAdmissionFormsById] = useState<
    Record<string, Record<string, boolean>>
  >({});

  const [consentDetailsById, setConsentDetailsById] = useState<
    Record<
      string,
      Record<string, ConsentFormDetails>
    >
  >({});

  const [consentApprovalById, setConsentApprovalById] = useState<
    Record<string, ReceptionConsentApproval>
  >({});

  const [showPrintCenter, setShowPrintCenter] = useState(false);
  const [highlightedMissing, setHighlightedMissing] = useState<string[]>([]);
  const missingHighlightTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (missingHighlightTimerRef.current !== null) {
        window.clearTimeout(missingHighlightTimerRef.current);
      }
    };
  }, []);

  const selectedSurgery = surgeries.find((surgery) => surgery.id === selectedId);

  const selectedPatient = patients.find(
    (patient) => patient.id === selectedId,
  );

  useEffect(() => {
    if (!selectedPatient) return;

    const originalStatus =
      initialReceptionStatus[
        selectedPatient.id
      ] ?? "Expected";

    // Always rebuild the ReceptionDetails workspace from the original
    // Reception state when this page mounts / the selected patient changes.
    if (
      originalStatus ===
        "Ready for Admission" ||
      originalStatus ===
        "Sent to Cashier"
    ) {
      setCheckedItems({
        identity: true,
        procedure: true,
        consent: true,
        fasting: true,
        belongings: true,
        contact: true,
        wristband: true,
      });

      setAdmissionFormsById((current) => ({
        ...current,
        [selectedPatient.id]:
          createAdmissionFormsState(true),
      }));
    } else {
      setCheckedItems({
        identity: false,
        procedure: false,
        consent: false,
        fasting: false,
        belongings: false,
        contact: false,
        wristband: false,
      });

      setAdmissionFormsById((current) => ({
        ...current,
        [selectedPatient.id]:
          createAdmissionFormsState(false),
      }));

      setConsentDetailsById((current) => ({
        ...current,
        [selectedPatient.id]: {},
      }));

      setConsentApprovalById((current) => ({
        ...current,
        [selectedPatient.id]:
          createConsentApproval(),
      }));
    }

    setArrivalTimes((current) => {
      const next = { ...current };
      delete next[selectedPatient.id];
      return next;
    });

    setIssuesById((current) => {
      const next = { ...current };
      delete next[selectedPatient.id];
      return next;
    });

    setShowPrintCenter(false);
    setShowHoldModal(false);
    setHoldReason("");
  }, [selectedPatient?.id]);


  const admissionForms = selectedPatient
    ? admissionFormsById[selectedPatient.id] ??
      createAdmissionFormsState(
        selectedPatient.status === "Ready for Admission" ||
          selectedPatient.status === "Sent to Cashier",
      )
    : createAdmissionFormsState(false);

  const requiredAdmissionForms = admissionFormItems.filter(
    (item) =>
      item.fields.some(
        (field) => field.required,
      ),
  );

  const completedAdmissionForms = requiredAdmissionForms.filter(
    (item) => admissionForms[item.id],
  ).length;

  const consentDetails = selectedPatient
    ? consentDetailsById[selectedPatient.id] ?? {}
    : {};

  const consentApproval = selectedPatient
    ? consentApprovalById[selectedPatient.id] ??
      createConsentApproval()
    : createConsentApproval();

  const approvalReady = Boolean(
    consentApproval.signerName.trim(),
  );


  const allAdmissionFormsComplete =
    completedAdmissionForms ===
    requiredAdmissionForms.length;

  const setConsentApprovalField = <
    Key extends keyof ReceptionConsentApproval,
  >(
    key: Key,
    value: ReceptionConsentApproval[Key],
  ) => {
    if (!selectedPatient) return;

    setConsentApprovalById((current) => ({
      ...current,
      [selectedPatient.id]: {
        ...(current[selectedPatient.id] ??
          createConsentApproval()),
        [key]: value,
      },
    }));
  };

  const getConsentDetails = (
    item: AdmissionFormItem,
  ) => {
    const base =
      createConsentFormDetails(item);

    const saved =
      consentDetails[item.id];

    if (!saved) return base;

    return {
      ...base,
      ...saved,
      values: {
        ...base.values,
        ...(saved.values ?? {}),
      },
      answers: {
        ...base.answers,
        ...(saved.answers ?? {}),
      },
    };
  };

  const updateConsentField = (
    item: AdmissionFormItem,
    fieldId: string,
    value: string,
  ) => {
    if (!selectedPatient) return;

    const currentDetails =
      getConsentDetails(item);

    const nextDetails: ConsentFormDetails = {
      ...currentDetails,
      values: {
        ...currentDetails.values,
        [fieldId]: value,
      },
    };

    const formComplete =
      isConsentFormComplete(
        item,
        nextDetails,
      );

    setConsentDetailsById((current) => ({
      ...current,
      [selectedPatient.id]: {
        ...(current[selectedPatient.id] ?? {}),
        [item.id]: {
          ...nextDetails,
          completedAt: formComplete
            ? new Date().toISOString()
            : undefined,
        },
      },
    }));

    setAdmissionFormsById((current) => ({
      ...current,
      [selectedPatient.id]: {
        ...(current[selectedPatient.id] ??
          createAdmissionFormsState(false)),
        [item.id]: formComplete,
      },
    }));
  };


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
    Math.ceil(filteredPatients.length / PAGE_SIZE),
  );

  const paginatedPatients = useMemo(
    () =>
      filteredPatients.slice(
        page * PAGE_SIZE,
        page * PAGE_SIZE + PAGE_SIZE,
      ),
    [filteredPatients, page],
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


  const completedCount = checklistItems.filter(
    (item) => checkedItems[item.id],
  ).length;

  const allChecked = completedCount === checklistItems.length;

  const receptionReady =
    allChecked &&
    allAdmissionFormsComplete &&
    approvalReady;

  const isMissingHighlighted = (key: string) =>
    highlightedMissing.includes(key);

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

  const selectPatient = (patient: Patient) => {
    setSelectedId(patient.id);
    setShowPrintCenter(false);

    setAdmissionFormsById((current) => {
      if (current[patient.id]) return current;

      const complete =
        patient.status === "Ready for Admission" ||
        patient.status === "Sent to Cashier";

      return {
        ...current,
        [patient.id]: createAdmissionFormsState(complete),
      };
    });

    if (
      patient.status === "Reception In Progress"
    ) {
      setCheckedItems({
        identity: true,
        procedure: true,
        consent: false,
        fasting: true,
        belongings: false,
        contact: true,
        wristband: false,
      });
    } else if (
      patient.status === "Ready for Admission" ||
      patient.status === "Sent to Cashier"
    ) {
      setCheckedItems({
        identity: true,
        procedure: true,
        consent: true,
        fasting: true,
        belongings: true,
        contact: true,
        wristband: true,
      });
    } else {
      setCheckedItems({
        identity: false,
        procedure: false,
        consent: false,
        fasting: false,
        belongings: false,
        contact: false,
        wristband: false,
      });
    }
  };

  const markPatientArrived = () => {
    if (!selectedPatient) return;

    const time = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    setReceptionStatus((current) => ({
      ...current,
      [selectedPatient.id]: "Reception In Progress",
    }));

    setArrivalTimes((current) => ({
      ...current,
      [selectedPatient.id]: time,
    }));

    // Timestamp the real surgery record so other pages (Cashier, etc.)
    // can show that the patient has physically arrived.
    markArrivedInStore(selectedPatient.id);

    setCheckedItems({
      identity: true,
      procedure: true,
      consent: false,
      fasting: true,
      belongings: false,
      contact: true,
      wristband: false,
    });
  };

  const completeReception = () => {
    if (!selectedPatient) return;

    const missingChecklistItems = checklistItems.filter(
      (item) => !checkedItems[item.id],
    );

    const missingChecklist = missingChecklistItems.map(
      (item) => item.label,
    );

    const missingConsentFields: string[] = [];
    const missingHighlightKeys: string[] = missingChecklistItems.map(
      (item) => `checklist:${item.id}`,
    );

    requiredAdmissionForms.forEach((item) => {
      const details = getConsentDetails(item);

      item.fields
        .filter((field) => field.required)
        .forEach((field) => {
          const value = details.values[field.id];

          if (!value?.trim()) {
            missingConsentFields.push(
              `${item.shortLabel}: ${field.label}`,
            );
            missingHighlightKeys.push(`field:${field.id}`);
          }
        });
    });

    const missingApproval: string[] = [];

    if (!consentApproval.signerName.trim()) {
      missingApproval.push("Signer name");
      missingHighlightKeys.push("approval:signerName");
    }

    const missingSections: string[] = [];

    if (missingChecklist.length > 0) {
      missingSections.push(
        `Eligibility: ${missingChecklist.join(", ")}`,
      );
    }

    if (missingConsentFields.length > 0) {
      missingSections.push(
        `Consent fields: ${missingConsentFields.join(", ")}`,
      );
    }

    if (missingApproval.length > 0) {
      missingSections.push(
        `Approval: ${missingApproval.join(", ")}`,
      );
    }

    if (missingSections.length > 0) {
      setHighlightedMissing(missingHighlightKeys);

      if (missingHighlightTimerRef.current !== null) {
        window.clearTimeout(missingHighlightTimerRef.current);
      }

      missingHighlightTimerRef.current = window.setTimeout(() => {
        setHighlightedMissing([]);
        missingHighlightTimerRef.current = null;
      }, 2400);

      showReceptionToast(
        "warning",
        "Reception is not complete",
        `Please complete the following before continuing:

${missingSections.join(
          "\n",
        )}`,
      );

      return;
    }

    setHighlightedMissing([]);

    setReceptionStatus((current) => ({
      ...current,
      [selectedPatient.id]: "Ready for Admission",
    }));
  };

  const sendToCashier = () => {
    if (!selectedPatient) {
      showReceptionToast(
        "error",
        "Patient not sent",
        "Unable to send the patient to Cashier.",
      );
      return;
    }

    const patientId = selectedPatient.id;
    const patientName = selectedPatient.name;

    try {
      // Update the shared surgery record first.
      sendToCashierInStore(patientId);

      // Verify that the hand-off really happened before changing
      // the Reception-only visual state.
      const updatedSurgery = useSurgeryStore
        .getState()
        .surgeries.find((item) => item.id === patientId);

      if (
        !updatedSurgery ||
        updatedSurgery.status !== "Payment Pending"
      ) {
        throw new Error(
          "The patient could not be moved to the Cashier queue.",
        );
      }

      setReceptionStatus((current) => ({
        ...current,
        [patientId]: "Sent to Cashier",
      }));

      showReceptionToast(
        "success",
        "Admitted & sent to Cashier",
        `${patientName} was admitted and sent to Cashier successfully.`,
      );

      // Stay in Reception after the shared Cashier hand-off.
    } catch (error) {
      console.error("Send to Cashier failed:", error);

      showReceptionToast(
        "error",
        "Patient not sent",
        error instanceof Error
          ? error.message
          : "Something went wrong while sending the patient to Cashier.",
      );
    }
  };

  const holdPatient = () => {
  if (!selectedPatient || !holdReason.trim()) return;

  setReceptionStatus((current) => ({
    ...current,
    [selectedPatient.id]: "On Hold",
  }));

  setIssuesById((current) => ({
    ...current,
    [selectedPatient.id]: [holdReason.trim()],
  }));

  setHoldReason("");
  setShowHoldModal(false);
};

  const workflowActiveStep =
    selectedPatient?.status === "Expected"
      ? 1
      : selectedPatient?.status === "Ready for Admission"
        ? 3
        : selectedPatient?.status === "Sent to Cashier"
          ? 0
          : selectedPatient
            ? 2
            : 0;

  const arrivalCompleted =
    selectedPatient !== undefined &&
    selectedPatient.status !== "Expected";

  const eligibilityCompleted =
    selectedPatient?.status === "Ready for Admission" ||
    selectedPatient?.status === "Sent to Cashier";

  const cashierCompleted =
    selectedPatient?.status === "Sent to Cashier";

  
  return { selectedPatient, navigate, workflowActiveStep, arrivalCompleted, eligibilityCompleted, cashierCompleted, expectedCount, arrivedCount, readyCount, holdCount, search, setSearch, setPage, setFilterOpen, selectedDoctors, selectedStatuses, filterOpen, clearTableFilters, availableDoctors, toggleDoctorFilter, availableStatuses, toggleStatusFilter, setPeriod, period, selectedDate, setSelectedDate, sortKey, sortDirection, handleSort, paginatedPatients, selectedId, selectPatient, highlightSurgeryId, filteredPatients, page, totalPages, markPatientArrived, allChecked, completedCount, checkedItems, setCheckedItems, isMissingHighlighted, allAdmissionFormsComplete, completedAdmissionForms, requiredAdmissionForms, getConsentDetails, updateConsentField, consentApproval, setConsentApprovalField, setShowPrintCenter, selectedSurgery, sendToCashier, setReceptionStatus, setShowHoldModal, approvalReady, completeReception, receptionReady, showPrintCenter, showHoldModal, holdReason, setHoldReason, holdPatient };
}
