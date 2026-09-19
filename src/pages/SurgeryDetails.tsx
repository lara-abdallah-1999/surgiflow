import { ArrowLeft,Barcode,Check,CheckCircle2,ChevronDown,FileText,Filter,Flag,HeartPulse,PackageCheck,Play,Receipt,RotateCcw,Scissors,Search,ShieldCheck,Syringe } from "lucide-react";
import { useEffect,useMemo,useRef,useState } from "react";
import { useLocation,useNavigate,useParams } from "react-router-dom";
import { SurgeryCopilotDrawer } from "../features/copilot/components/SurgeryCopilotDrawer";
import { useCopilotFocus } from "../features/copilot/hooks/useCopilotFocus";
import { appendReviewedReport,appendReviewedText,createSurgeryActions } from "../features/copilot/surgeryBridge";
import { type CopilotDocumentKind,type CopilotDocuments } from "../features/copilot/types";
import { PatientContextTools } from "../features/patient-context/PatientContextTools";
import { PatientAwakening } from "../features/recovery/PatientAwakening";
import { EquipmentBadge,MiniReadinessPill,StatusCounter,SurgicalMilestone,VerticalTab } from "../features/workspaces/SurgeryDetails/components";
import { DEFAULT_EQUIPMENT } from "../features/workspaces/SurgeryDetails/config";
import { type EquipmentStatusFilter,type RecoveryAssessment,type SurgeryEquipment,type WorkspaceTab } from "../features/workspaces/SurgeryDetails/types";
import { formatClinicalTime,formatCompletedDuration,formatDuration,getCurrentPhase,getSurgeryProcedures,getSurgeryTimestamp } from "../features/workspaces/SurgeryDetails/utils";
import { useSurgeryStore } from "../store/surgeryStore";


export default function SurgeryDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const focusCopilotTarget = useCopilotFocus(location.state?.copilotFocus, location.key);
  const { id } = useParams<{ id: string }>();

  const surgery = useSurgeryStore((state) =>
    state.surgeries.find((item) => item.id === id),
  );

  const startSurgery = useSurgeryStore((state) => state.startSurgery);
  const completeSurgery = useSurgeryStore((state) => state.completeSurgery);
  const updateSurgery = useSurgeryStore((state) => state.updateSurgery);

  const [elapsed, setElapsed] = useState(0);
  const [activeTab, setActiveTab] = useState<WorkspaceTab>(location.state?.copilotSection === "recovery" ? "recovery" : "surgery");

  const [scanValue, setScanValue] = useState("");
  const [scanMessage, setScanMessage] = useState("");
  const [equipmentSearch, setEquipmentSearch] =
    useState("");
  const [
    equipmentStatusFilter,
    setEquipmentStatusFilter,
  ] = useState<EquipmentStatusFilter>(["All", "In Use", "Returned", "Available"].includes(location.state?.copilotEquipmentFilter) ? location.state.copilotEquipmentFilter : "All");
  const [
    equipmentFilterOpen,
    setEquipmentFilterOpen,
  ] = useState(false);
  const [equipment, setEquipment] =
    useState<SurgeryEquipment[]>(DEFAULT_EQUIPMENT);

  const [awakeningConfirmed, setAwakeningConfirmed] = useState(false);
  const [awakeningAt, setAwakeningAt] = useState<string | null>(null);

  const [recoveryAssessment, setRecoveryAssessment] =
    useState<RecoveryAssessment>({
      airway: false,
      breathing: false,
      circulation: false,
      consciousness: false,
      painControlled: false,
      nauseaControlled: false,
    });

  const [recoveryNotes, setRecoveryNotes] = useState("");
  const [readyForTransferAt, setReadyForTransferAt] =
    useState<string | null>(null);
  const [transferredAt, setTransferredAt] = useState<string | null>(null);
  const [copilotHydratedCaseId, setCopilotHydratedCaseId] = useState<string | null>(null);

  const scanInputRef = useRef<HTMLInputElement | null>(null);

  /* -------------------------------------------------------------------------- */
  /* Timer                                                                      */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    if (!surgery?.surgeryStartedAt || surgery.status !== "In Progress") {
      setElapsed(0);
      return;
    }

    const startedAt = surgery.surgeryStartedAt;
    const updateTimer = () => {
      const seconds = Math.max(
        0,
        Math.floor(
          (Date.now() - new Date(startedAt).getTime()) / 1000,
        ),
      );

      setElapsed(seconds);
    };

    updateTimer();

    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [surgery?.surgeryStartedAt, surgery?.status]);

  /* -------------------------------------------------------------------------- */
  /* Equipment persistence                                                      */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    if (!surgery?.id) return;

    const key = `surgery-equipment-${surgery.id}`;
    const raw = localStorage.getItem(key);

    if (!raw) {
      setEquipment(DEFAULT_EQUIPMENT);
      return;
    }

    try {
      const parsed = JSON.parse(raw) as SurgeryEquipment[];
      setEquipment(Array.isArray(parsed) ? parsed : DEFAULT_EQUIPMENT);
    } catch {
      setEquipment(DEFAULT_EQUIPMENT);
    }
  }, [surgery?.id]);

  useEffect(() => {
    if (!surgery?.id) return;
    localStorage.setItem(
      `surgery-equipment-${surgery.id}`,
      JSON.stringify(equipment),
    );
  }, [equipment, surgery?.id]);

  /* -------------------------------------------------------------------------- */
  /* Recovery persistence                                                       */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    if (!surgery?.id) return;

    const record = surgery as unknown as Record<string, unknown>;

    setAwakeningConfirmed(Boolean(record.recoveryAwakeningConfirmed));
    setAwakeningAt(
      typeof record.recoveryAwakeningAt === "string"
        ? record.recoveryAwakeningAt
        : null,
    );

    setRecoveryAssessment({
      airway: Boolean(record.recoveryAirway),
      breathing: Boolean(record.recoveryBreathing),
      circulation: Boolean(record.recoveryCirculation),
      consciousness: Boolean(record.recoveryConsciousness),
      painControlled: Boolean(record.recoveryPainControlled),
      nauseaControlled: Boolean(record.recoveryNauseaControlled),
    });

    setRecoveryNotes(
      typeof record.recoveryNotes === "string" ? record.recoveryNotes : "",
    );

    setReadyForTransferAt(
      typeof record.readyForTransferAt === "string"
        ? record.readyForTransferAt
        : null,
    );

    setTransferredAt(
      typeof record.transferredAt === "string" ? record.transferredAt : null,
    );
    setCopilotHydratedCaseId(surgery.id);
  }, [surgery?.id]);

  const filteredEquipment = useMemo(() => {
    const query = equipmentSearch
      .trim()
      .toLowerCase();

    return equipment.filter((item) => {
      const matchesSearch =
        !query ||
        item.name.toLowerCase().includes(query) ||
        item.barcode.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query);

      const matchesStatus =
        equipmentStatusFilter === "All" ||
        item.state === equipmentStatusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [
    equipment,
    equipmentSearch,
    equipmentStatusFilter,
  ]);

  if (!surgery) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
            <FileText className="h-6 w-6 text-slate-500" />
          </div>

          <h2 className="text-lg font-semibold text-slate-900">
            Surgery not found
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            The requested surgery could not be found.
          </p>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mt-5 inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Surgery
          </button>
        </div>
      </div>
    );
  }

  const isPreOp = surgery.status === "Pre-Op";
  const isReady = surgery.status === "Ready";
  const isInProgress = surgery.status === "In Progress";
  const isCompleted =
    surgery.status === "Completed" ||
    surgery.status === "Recovery" ||
    surgery.status === "Discharged";

  const readiness = [
    {
      label: "Payment",
      complete: surgery.paymentStatus === "Paid",
      icon: Receipt,
    },
    {
      label: "Pre-Op",
      complete:
        surgery.preOpCompleted === true ||
        ["Ready", "In Progress", "Completed", "Recovery", "Discharged"].includes(
          surgery.status,
        ),
      icon: CheckCircle2,
    },
    {
      label: "Anesthesia",
      complete:
        surgery.anesthesiaCompleted === true ||
        Boolean(surgery.inductionAt) ||
        Boolean(
          (surgery as unknown as Record<string, unknown>)
            .anesthesiaAdmissionAt,
        ),
      icon: Syringe,
    },
    {
      label: "Equipment",
      complete: surgery.equipmentReady === true,
      icon: ShieldCheck,
    },
  ];

  const completedReadiness = readiness.filter((item) => item.complete).length;
  const everythingReady = completedReadiness === readiness.length;

  const surgeryRecord = surgery as unknown as Record<string, unknown>;

  const startAt = getSurgeryTimestamp(surgeryRecord, [
    "surgeryStartedAt",
    "startAt",
    "startTime",
  ]);

  const anesthesiaAdmissionAt = getSurgeryTimestamp(surgeryRecord, [
    "anesthesiaAdmissionAt",
    "anesthesiaAdmittedAt",
    "inductionAt",
  ]);

  const cutAt = getSurgeryTimestamp(surgeryRecord, ["cutAt", "cutTime"]);

  const endAt = getSurgeryTimestamp(surgeryRecord, [
    "endAt",
    "endTime",
    "surgeryCompletedAt",
  ]);

  const completedDuration = formatCompletedDuration(surgery);

  const equipmentInUse = equipment.filter((item) => item.state === "In Use");
  const equipmentReturned = equipment.filter(
    (item) => item.state === "Returned",
  );
  const equipmentUsed = equipment.filter(
    (item) => item.state === "In Use" || item.state === "Returned",
  );

  const equipmentReconciled =
    equipmentUsed.length === 0 || equipmentInUse.length === 0;

  const surgeryProcedures =
    getSurgeryProcedures(surgery);

  const everyProcedureHasSite =
    surgeryProcedures.every(
      (procedure) =>
        Boolean(procedure.site?.trim()),
    );

  const surgicalSiteSummary =
    surgeryProcedures
      .map((procedure) =>
        procedure.site
          ? `${procedure.name} — ${procedure.site}`
          : `${procedure.name} — Site not recorded`,
      )
      .join(" • ");

  const canConfirmAnesthesia = Boolean(startAt) && !anesthesiaAdmissionAt;
  const canConfirmCut =
    Boolean(anesthesiaAdmissionAt) &&
    !cutAt &&
    everyProcedureHasSite;
  const canEndSurgery =
    Boolean(cutAt) && !endAt && equipmentReconciled && isInProgress;

  const recoveryChecksComplete = Object.values(recoveryAssessment).every(
    Boolean,
  );

  const canMarkReadyForTransfer =
    awakeningConfirmed && recoveryChecksComplete && !readyForTransferAt;

  const canTransfer = Boolean(readyForTransferAt) && !transferredAt;

  const handleStartSurgery = () => {
    if (!everythingReady && isPreOp) return;
    startSurgery(surgery.id);
  };

  const confirmAnesthesiaAdmission = () => {
    if (!canConfirmAnesthesia) return;

    const now = new Date().toISOString();

    updateSurgery(
      surgery.id,
      {
        anesthesiaAdmissionAt: now,
        anesthesiaCompleted: true,
        anesthesiaCompletedAt: now,
      } as any,
    );
  };

  const confirmCutTime = () => {
    if (!canConfirmCut) return;

    updateSurgery(
      surgery.id,
      {
        cutAt: new Date().toISOString(),
      } as any,
    );
  };

  const handleCompleteSurgery = () => {
    if (!canEndSurgery) return;
    completeSurgery(surgery.id);
  };

  const handleEquipmentScan = () => {
    const code = scanValue.trim();

    if (!code) return;

    const found = equipment.find(
      (item) => item.barcode.toLowerCase() === code.toLowerCase(),
    );

    if (!found) {
      setScanMessage(`No equipment found for barcode ${code}.`);
      setScanValue("");
      scanInputRef.current?.focus();
      return;
    }

    const now = new Date().toISOString();

    setEquipment((current) =>
      current.map((item) => {
        if (item.id !== found.id) return item;

        if (item.state === "Available") {
          return {
            ...item,
            state: "In Use",
            usedAt: now,
            returnedAt: undefined,
          };
        }

        if (item.state === "In Use") {
          return {
            ...item,
            state: "Returned",
            returnedAt: now,
          };
        }

        return {
          ...item,
          state: "In Use",
          usedAt: now,
          returnedAt: undefined,
        };
      }),
    );

    setScanMessage(
      found.state === "Available"
        ? `${found.name} checked into this surgery.`
        : found.state === "In Use"
          ? `${found.name} returned and reconciled.`
          : `${found.name} checked into use again.`,
    );

    setScanValue("");
    scanInputRef.current?.focus();
  };

  const confirmAwakening = () => {
    const now = new Date().toISOString();
    setAwakeningConfirmed(true);
    setAwakeningAt(now);

    updateSurgery(
      surgery.id,
      {
        recoveryAwakeningConfirmed: true,
        recoveryAwakeningAt: now,
      } as any,
    );
  };

  const toggleRecoveryAssessment = (key: keyof RecoveryAssessment) => {
    setRecoveryAssessment((current) => {
      const next = {
        ...current,
        [key]: !current[key],
      };

      updateSurgery(
        surgery.id,
        {
          recoveryAirway: next.airway,
          recoveryBreathing: next.breathing,
          recoveryCirculation: next.circulation,
          recoveryConsciousness: next.consciousness,
          recoveryPainControlled: next.painControlled,
          recoveryNauseaControlled: next.nauseaControlled,
        } as any,
      );

      return next;
    });
  };

  const saveRecoveryNotes = (reviewedNotes = recoveryNotes) => {
    updateSurgery(
      surgery.id,
      {
        recoveryNotes: reviewedNotes,
      } as any,
    );
  };

  const markReadyForTransfer = () => {
    if (!canMarkReadyForTransfer) return;

    const now = new Date().toISOString();
    setReadyForTransferAt(now);

    updateSurgery(
      surgery.id,
      {
        readyForTransferAt: now,
      } as any,
    );
  };

  const confirmTransferred = () => {
    if (!canTransfer) return;

    const now = new Date().toISOString();
    setTransferredAt(now);

    updateSurgery(
      surgery.id,
      {
        transferredAt: now,
        status: "Recovery",
      } as any,
    );
  };

  // Copilot receives the exact existing control gates and handlers. It owns no workflow state.
  const isCurrentCopilotCase = () => copilotHydratedCaseId === surgery.id && useSurgeryStore.getState().surgeries.find((item) => item.id === surgery.id) === surgery;
  const copilotActions = createSurgeryActions({
    start: { available: !startAt && (isReady || isPreOp) && !(isPreOp && !everythingReady), reason: "Start Surgery must be visible and enabled in the current workspace. Pre-Op cases require all four readiness indicators.", run: handleStartSurgery },
    anesthesia: { available: canConfirmAnesthesia, reason: "A surgery start must be recorded and anesthesia administration must not already be recorded.", run: confirmAnesthesiaAdmission },
    cut: { available: canConfirmCut, reason: "Record anesthesia administration and a site for every procedure; Site & Cut must not already be recorded.", run: confirmCutTime },
    end: { available: canEndSurgery && Boolean(surgery.surgeryStartedAt), reason: "End Surgery requires In Progress status, Site & Cut, reconciled equipment, a primary start timestamp, and no end time.", run: handleCompleteSurgery },
    awakening: { available: !awakeningConfirmed, reason: "Awakening has already been confirmed.", run: confirmAwakening },
    ready: { available: canMarkReadyForTransfer, reason: "Awakening and all six recovery checks must be recorded, and Ready for Transfer must not already be confirmed.", run: markReadyForTransfer },
    transfer: { available: canTransfer, reason: "Ready for Transfer must be confirmed, and transfer must not already be recorded.", run: confirmTransferred },
  }, isCurrentCopilotCase);
  const copilotWorkflowVersion = JSON.stringify([surgery.id, surgery.patientId, surgery.patientName, surgery.status, surgery.paymentStatus, surgery.preOpCompleted, surgery.equipmentReady, surgery.anesthesiaCompleted, startAt, anesthesiaAdmissionAt, cutAt, endAt, surgeryProcedures, equipment, awakeningConfirmed, recoveryAssessment, readyForTransferAt, transferredAt]);
  const saveCopilotDocumentation = (kind: CopilotDocumentKind, text: string) => {
    if (!isCurrentCopilotCase()) return { ok: false, message: "The case record changed. Review a fresh draft before saving." };
    if (!text.trim()) return { ok: false, message: "The draft is empty." };
    if (kind === "recovery-note") {
      const value = appendReviewedText(recoveryNotes, text);
      saveRecoveryNotes(value);
      setRecoveryNotes(value);
    } else if (kind === "operative-report") {
      updateSurgery(surgery.id, { operativeReport: appendReviewedReport(surgery.operativeReport ?? "", text) });
    } else {
      updateSurgery(surgery.id, { surgeonNotes: appendReviewedText(surgery.surgeonNotes ?? "", text) });
    }
    return { ok: true, message: "Reviewed documentation appended to this case. Existing text was preserved." };
  };
  const copilotDocuments: CopilotDocuments = Object.fromEntries((["recovery-note", "intraop-note", "handoff", "summary", "operative-report"] as const).map((kind) => [kind, {
    label: kind === "recovery-note" ? "Recovery Notes" : kind === "operative-report" ? "Operative Report" : "Surgeon Notes",
    currentValue: kind === "recovery-note" ? recoveryNotes : kind === "operative-report" ? surgery.operativeReport ?? "" : surgery.surgeonNotes ?? "",
    save: (text: string) => saveCopilotDocumentation(kind, text),
  }]));

  return (
    <div data-workspace-page="SurgeryDetails" className="h-[calc(100vh-72px)] min-h-0 overflow-hidden bg-slate-50">
      <SurgeryCopilotDrawer key={surgery.id} surgery={surgery} actions={copilotHydratedCaseId === surgery.id ? copilotActions : undefined} documents={copilotHydratedCaseId === surgery.id ? copilotDocuments : undefined} workflowVersion={copilotWorkflowVersion} context={copilotHydratedCaseId === surgery.id ? { operatingRoom: {
        started: Boolean(startAt), anesthesiaRecorded: Boolean(anesthesiaAdmissionAt),
        cutRecorded: Boolean(cutAt), ended: Boolean(endAt), everyProcedureHasSite,
        equipmentInUse: equipmentInUse.length, equipmentNames: equipmentInUse.map((item) => item.name), awakeningConfirmed, recoveryAssessment,
        readyForTransfer: Boolean(readyForTransferAt), transferred: Boolean(transferredAt),
      } } : undefined} onDestination={(destination) => {
        if (destination.path !== `/surgery/${encodeURIComponent(surgery.id)}`) return false;
        setActiveTab(destination.section === "recovery" ? "recovery" : "surgery");
        if (destination.equipmentFilter) { setEquipmentStatusFilter(destination.equipmentFilter); setEquipmentSearch(""); }
        focusCopilotTarget(destination.focus);
        return true;
      }} />
      <div className="mx-auto flex h-full min-h-0 max-w-[1500px] flex-col p-1.5">
        {/* ------------------------------------------------------------------ */}
        {/* Patient / Surgery Header — same design language as Pre-Op           */}
        {/* ------------------------------------------------------------------ */}

        <PatientContextTools>
          <button type="button" onClick={() => navigate(-1)} aria-label="Back to surgeries" className="flex h-7 items-center gap-1 rounded-lg border border-violet-100 bg-white px-2 text-violet-600 hover:bg-violet-50"><ArrowLeft size={13} /> Back</button>
          <span>Duration: <strong className="font-mono tabular-nums">{isCompleted ? completedDuration : isInProgress ? formatDuration(elapsed) : "Not started"}</strong></span>
          <span className={everyProcedureHasSite ? "text-emerald-700" : "text-amber-700"}>{everyProcedureHasSite ? "All sites recorded" : "Site missing"}</span>
        </PatientContextTools>

        {/* ------------------------------------------------------------------ */}
        {/* Vertical workspace tabs                                            */}
        {/* ------------------------------------------------------------------ */}

        <div data-responsive-grid="2" className="grid min-h-0 flex-1 grid-cols-[112px_minmax(0,1fr)] overflow-hidden rounded-xl border border-violet-100 bg-white shadow-sm">
          <aside className="flex min-h-0 flex-col border-r border-slate-100 bg-slate-50/70 p-1.5">
            <p className="px-2 pb-2 pt-1 text-[8px] font-bold uppercase tracking-[0.14em] text-slate-400">
              Workspace
            </p>

            <VerticalTab
              active={activeTab === "surgery"}
              icon={Scissors}
              label="Surgery"
              hint="Procedure"
              onClick={() => setActiveTab("surgery")}
            />

            <VerticalTab
              active={activeTab === "recovery"}
              icon={HeartPulse}
              label="Recovery"
              hint="Post-op"
              onClick={() => setActiveTab("recovery")}
            />

            <div className="mt-auto rounded-lg border border-slate-200 bg-white p-2">
              <p className="text-[7px] font-bold uppercase tracking-wide text-slate-400">
                Current phase
              </p>
              <p className="mt-1 text-[9px] font-semibold text-slate-700">
                {getCurrentPhase(surgery.status)}
              </p>
            </div>
          </aside>

          <main className="min-h-0 overflow-hidden p-1.5">
            {activeTab === "surgery" ? (
              <div className="flex h-full min-h-0 flex-col gap-1.5">
                {/* Readiness compact row */}
                {isPreOp && (
                  <section className="shrink-0 rounded-lg border border-violet-100 bg-violet-50/20 px-2.5 py-1.5">
                    <div className="flex items-center gap-2">
                      <div className="flex shrink-0 items-center gap-1.5">
                        <ShieldCheck className="h-3.5 w-3.5 text-violet-600" />
                        <span className="text-[9px] font-bold text-slate-800">
                          Surgery Readiness
                        </span>
                        <span className="text-[8px] font-semibold text-slate-400">
                          {completedReadiness}/4
                        </span>
                      </div>

                      <div className="flex min-w-0 flex-1 items-center gap-1.5">
                        {readiness.map((item) => (
                          <MiniReadinessPill
                            key={item.label}
                            label={item.label}
                            complete={item.complete}
                            icon={item.icon}
                          />
                        ))}
                      </div>

                      <span
                        className={`shrink-0 text-[8px] font-semibold ${
                          everythingReady
                            ? "text-emerald-600"
                            : "text-amber-600"
                        }`}
                      >
                        {everythingReady
                          ? "Ready to start"
                          : "Complete requirements"}
                      </span>
                    </div>
                  </section>
                )}

                {/* Compact surgical stepper */}
                <section id="copilot-milestones" tabIndex={-1} aria-label="Surgery milestones" className="shrink-0 rounded-xl border border-violet-100 bg-white px-2.5 py-2 shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
                  <div data-responsive-grid="4" className="grid min-w-0 grid-cols-4">
                    <SurgicalMilestone
                      number="01"
                      label="1. Start Surgery"
                      time={startAt ? formatClinicalTime(startAt) : everythingReady ? "Ready to start" : `${completedReadiness}/4 ready`}
                      statusLabel={startAt ? "Started" : everythingReady ? "Begin here" : "Readiness required"}
                      complete={Boolean(startAt)}
                      active={!startAt}
                      icon={Play}
                      action={!startAt && (isReady || isPreOp) ? (
                        <button
                          type="button"
                          disabled={isPreOp && !everythingReady}
                          onClick={handleStartSurgery}
                          className="inline-flex h-5 items-center justify-center rounded-md bg-violet-600 px-2.5 !text-[13px] font-extrabold text-white shadow-sm transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
                        >
                          Start Surgery
                        </button>
                      ) : undefined}
                    />

                    <SurgicalMilestone
                      number="02"
                      label="2. Anesthesia"
                      time={anesthesiaAdmissionAt ? formatClinicalTime(anesthesiaAdmissionAt) : "Not started"}
                      statusLabel={anesthesiaAdmissionAt ? (surgery.anesthesiaType ?? "Confirmed") : Boolean(startAt) ? "Confirm next" : "Waiting"}
                      complete={Boolean(anesthesiaAdmissionAt)}
                      active={Boolean(startAt) && !anesthesiaAdmissionAt}
                      icon={Syringe}
                      action={canConfirmAnesthesia ? (
                        <button
                          type="button"
                          onClick={confirmAnesthesiaAdmission}
                          className="inline-flex h-5 items-center justify-center rounded-md bg-violet-600 px-2.5 !text-[12px] font-extrabold text-white shadow-sm transition hover:bg-violet-700"
                        >
                          Confirm
                        </button>
                      ) : undefined}
                    />

                    <SurgicalMilestone
                      number="03"
                      label="3. Site & Cut"
                      time={cutAt ? formatClinicalTime(cutAt) : everyProcedureHasSite ? "Site ready" : "Site required"}
                      statusLabel={cutAt ? "Operation started" : everyProcedureHasSite ? "Confirm next" : "Record site first"}
                      complete={Boolean(cutAt)}
                      active={Boolean(anesthesiaAdmissionAt) && !cutAt}
                      icon={Scissors}
                      action={canConfirmCut ? (
                        <button
                          type="button"
                          onClick={confirmCutTime}
                          title={surgicalSiteSummary}
                          className="inline-flex h-5 items-center justify-center rounded-md bg-violet-600 px-2.5 !text-[12px] font-extrabold text-white shadow-sm transition hover:bg-violet-700"
                        >
                          Confirm Site & Cut
                        </button>
                      ) : Boolean(anesthesiaAdmissionAt) && !cutAt ? (
                        <span className="inline-flex h-6 items-center justify-center rounded-md bg-amber-50 px-2 text-[6.5px] font-bold text-amber-700">
                          Record site first
                        </span>
                      ) : undefined}
                    />

                    <SurgicalMilestone
                      number="04"
                      label="4. End Surgery"
                      time={endAt ? formatClinicalTime(endAt) : isInProgress ? "Not completed" : "Waiting"}
                      statusLabel={endAt ? "Completed" : !cutAt ? "Waiting" : equipmentReconciled ? "Finish when done" : "Equipment pending"}
                      complete={Boolean(endAt)}
                      active={Boolean(cutAt) && !endAt}
                      icon={Flag}
                      action={!endAt && isInProgress ? (
                        <button
                          type="button"
                          disabled={!canEndSurgery}
                          onClick={handleCompleteSurgery}
                          title={!equipmentReconciled ? "Return all checked-out equipment before ending surgery." : undefined}
                          className="inline-flex h-5 items-center justify-center rounded-md border border-rose-200 bg-rose-50 px-2.5 !text-[11px] font-extrabold text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:border-slate-100 disabled:bg-slate-50 disabled:text-slate-400"
                        >
                          End Surgery
                        </button>
                      ) : undefined}
                    />
                  </div>
                </section>

                {/* Equipment workflow */}
                <section id="copilot-equipment" tabIndex={-1} aria-label="Equipment Scan and Reconciliation" className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border border-slate-200 bg-white">
                  <div className="shrink-0 border-b border-slate-100 px-3 py-2">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-2">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
                          <Barcode className="h-4 w-4" />
                        </div>

                        <div className="min-w-0">
                          <h3 className="text-[10px] font-bold text-slate-900">
                            Equipment Scan & Reconciliation
                          </h3>
                          <p className="truncate text-[8px] text-slate-400">
                            Scan once when equipment enters use, scan again when it
                            is returned to its place.
                          </p>
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center gap-1.5">
                        <StatusCounter
                          label="Used"
                          value={equipmentUsed.length}
                          tone="violet"
                        />
                        <StatusCounter
                          label="In use"
                          value={equipmentInUse.length}
                          tone={equipmentInUse.length > 0 ? "amber" : "slate"}
                        />
                        <StatusCounter
                          label="Returned"
                          value={equipmentReturned.length}
                          tone="emerald"
                        />

                        <div className="relative ml-1">
                          <Search className="absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 text-slate-400" />
                          <input
                            value={equipmentSearch}
                            onChange={(event) =>
                              setEquipmentSearch(event.target.value)
                            }
                            placeholder="Search..."
                            className="h-6 w-[150px] rounded-md border border-slate-200 bg-white pl-6 pr-2 text-[7.5px] font-semibold text-slate-700 outline-none transition placeholder:text-slate-300 focus:border-violet-300 focus:ring-2 focus:ring-violet-100"
                          />
                        </div>

                        <div className="relative">
                          <button
                            type="button"
                            onClick={() =>
                              setEquipmentFilterOpen(
                                (current) => !current,
                              )
                            }
                            className={`flex h-6 items-center gap-1 rounded-md border px-2 text-[7.5px] font-bold transition ${
                              equipmentFilterOpen ||
                              equipmentStatusFilter !== "All"
                                ? "border-violet-200 bg-violet-50 text-violet-700"
                                : "border-slate-200 bg-white text-slate-500 hover:border-violet-200 hover:bg-violet-50/40"
                            }`}
                          >
                            <Filter size={9} />
                            <span>
                              {equipmentStatusFilter === "All"
                                ? "Filter"
                                : equipmentStatusFilter}
                            </span>
                            <ChevronDown
                              size={9}
                              className={`transition-transform ${
                                equipmentFilterOpen
                                  ? "rotate-180"
                                  : ""
                              }`}
                            />
                          </button>

                          {equipmentFilterOpen && (
                            <div className="absolute right-0 top-[calc(100%+5px)] z-30 w-[210px] rounded-xl border border-slate-200 bg-white p-2 shadow-[0_12px_30px_rgba(15,23,42,0.14)]">
                              <div className="mb-1.5 flex items-center justify-between px-0.5">
                                <p className="text-[7px] font-bold uppercase tracking-wide text-slate-400">
                                  Equipment status
                                </p>

                                {equipmentStatusFilter !== "All" && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setEquipmentStatusFilter("All");
                                      setEquipmentFilterOpen(false);
                                    }}
                                    className="text-[7px] font-bold text-violet-600 hover:text-violet-700"
                                  >
                                    Clear
                                  </button>
                                )}
                              </div>

                              <div data-responsive-grid="2" className="grid grid-cols-2 gap-1.5">
                                {(
                                  [
                                    "All",
                                    "Available",
                                    "In Use",
                                    "Returned",
                                  ] as EquipmentStatusFilter[]
                                ).map((status) => {
                                  const count =
                                    status === "All"
                                      ? equipment.length
                                      : equipment.filter(
                                          (item) =>
                                            item.state === status,
                                        ).length;

                                  const active =
                                    equipmentStatusFilter === status;

                                  return (
                                    <button
                                      key={status}
                                      type="button"
                                      onClick={() => {
                                        setEquipmentStatusFilter(status);
                                        setEquipmentFilterOpen(false);
                                      }}
                                      className={`flex h-7 items-center justify-between rounded-lg border px-2 text-[7.5px] font-bold transition ${
                                        active
                                          ? "border-violet-200 bg-violet-50 text-violet-700"
                                          : "border-slate-200 bg-white text-slate-500 hover:border-violet-200 hover:bg-violet-50/30"
                                      }`}
                                    >
                                      <span>{status}</span>

                                      <span
                                        className={`rounded-full px-1.5 py-0.5 text-[6.5px] ${
                                          active
                                            ? "bg-white text-violet-700"
                                            : "bg-slate-100 text-slate-400"
                                        }`}
                                      >
                                        {count}
                                      </span>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div data-responsive-grid="2" className="grid min-h-0 flex-1 grid-cols-[236px_minmax(0,1fr)]">
                    <div className="border-r border-slate-100 p-3">
                      <label className="text-[8px] font-bold uppercase tracking-wide text-slate-400">
                        Barcode scanner
                      </label>

                      <div className="mt-1.5 flex items-center gap-1.5">
                        <div className="relative min-w-0 flex-1">
                          <Barcode className="absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-violet-400" />

                          <input
                            ref={scanInputRef}
                            value={scanValue}
                            onChange={(event) => setScanValue(event.target.value)}
                            onKeyDown={(event) => {
                              if (event.key === "Enter") {
                                event.preventDefault();
                                handleEquipmentScan();
                              }
                            }}
                            placeholder="Scan barcode..."
                            className="h-7 w-full rounded-lg border border-slate-200 bg-white pl-7 pr-2 !text-[12px] font-semibold text-slate-700 outline-none transition focus:border-violet-300 focus:ring-2 focus:ring-violet-100"
                          />
                        </div>

                        <button
                          type="button"
                          onClick={handleEquipmentScan}
                          className="h-7 rounded-lg bg-violet-600 px-3 !text-[11px] font-bold text-white hover:bg-violet-700"
                        >
                          Scan
                        </button>
                      </div>

                      <div
                        className={`mt-2 rounded-lg border px-2.5 py-2 text-[8px] leading-4 ${
                          equipmentInUse.length === 0
                            ? "border-emerald-100 bg-emerald-50/60 text-emerald-700"
                            : "border-amber-100 bg-amber-50/70 text-amber-700"
                        }`}
                      >
                        <div className="flex items-start gap-1.5">
                          {equipmentInUse.length === 0 ? (
                            <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                          ) : (
                            <RotateCcw className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                          )}

                          <div>
                            <p className="font-bold">
                              {equipmentInUse.length === 0
                                ? "Equipment reconciled"
                                : `${equipmentInUse.length} item${
                                    equipmentInUse.length === 1 ? "" : "s"
                                  } still in use`}
                            </p>
                            <p className="mt-0.5 opacity-80">
                              Surgery cannot be ended until every used reusable
                              item has been scanned back.
                            </p>
                          </div>
                        </div>
                      </div>

                      {scanMessage && (
                        <p className="mt-2 rounded-md bg-slate-50 px-2 py-1.5 text-[7.5px] font-medium text-slate-500">
                          {scanMessage}
                        </p>
                      )}
                    </div>

                    <div className="min-h-0 overflow-hidden">
                      <div data-responsive-table-header="true" className="sticky top-0 z-10 grid grid-cols-[1.4fr_0.8fr_0.8fr_0.8fr] border-b border-slate-100 bg-slate-50 px-3 py-1.5 text-[7px] font-bold uppercase tracking-wide text-slate-400">
                        <span>Equipment</span>
                        <span>Barcode</span>
                        <span>Status</span>
                        <span>Last action</span>
                      </div>

                      {filteredEquipment.length > 0 ? (
                        filteredEquipment.map((item) => (
                          <div data-responsive-table-row="true"
                            key={item.id}
                            className="grid min-h-[36px] grid-cols-[1.4fr_0.8fr_0.8fr_0.8fr] items-center border-b border-slate-100 px-3 py-1"
                          >
                            <div data-cell-label="Equipment"  className="min-w-0">
                              <p className="truncate text-[9px] font-semibold text-slate-700">
                                {item.name}
                              </p>
                              <p className="mt-0.5 text-[7px] text-slate-400">
                                {item.category}
                              </p>
                            </div>

                            <span data-cell-label="Barcode"  className="font-mono text-[8px] font-semibold text-slate-500">
                              {item.barcode}
                            </span>

                            <EquipmentBadge state={item.state} />

                            <span data-cell-label="Last action"  className="text-[7.5px] font-medium text-slate-500">
                              {item.returnedAt
                                ? `Returned ${formatClinicalTime(item.returnedAt)}`
                                : item.usedAt
                                  ? `Used ${formatClinicalTime(item.usedAt)}`
                                  : "Not scanned"}
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="flex h-[96px] items-center justify-center px-3 text-center">
                          <div>
                            <Search className="mx-auto h-4 w-4 text-slate-300" />
                            <p className="mt-1.5 text-[8.5px] font-semibold text-slate-500">
                              No equipment found
                            </p>
                            <p className="mt-0.5 text-[7px] text-slate-400">
                              Try another search or status filter.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </section>
              </div>
            ) : (
              <div className="grid h-full min-h-0 grid-rows-[auto_1fr_auto] gap-2">
                {/* Required checkpoint — Patient Awakening */}
                <PatientAwakening key={surgery.id} surgery={surgery} confirmed={awakeningConfirmed} confirmedAt={awakeningAt} onConfirm={confirmAwakening} />

                <div data-responsive-grid="2" className="grid min-h-0 grid-cols-[1fr_0.9fr] gap-2">
                  {/* Recovery Assessment */}
                  <section id="copilot-assessment" tabIndex={-1} aria-label="Recovery Assessment" className="min-h-0 overflow-hidden rounded-lg border border-teal-100 bg-white">
                    <div className="border-b border-teal-100 bg-teal-50/30 px-3 py-2">
                      <h3 className="text-[10px] font-bold text-slate-900">
                        Recovery Assessment
                      </h3>
                      <p className="text-[8px] text-slate-400">
                        Complete all recovery checks before transfer.
                      </p>
                    </div>

                    <div data-responsive-grid="2" className="grid grid-cols-2 gap-2 p-3">
                      {[
                        ["airway", "Airway"],
                        ["breathing", "Breathing"],
                        ["circulation", "Circulation"],
                        ["consciousness", "Consciousness"],
                        ["painControlled", "Pain controlled"],
                        ["nauseaControlled", "Nausea controlled"],
                      ].map(([key, label]) => {
                        const typedKey = key as keyof RecoveryAssessment;
                        const checked = recoveryAssessment[typedKey];

                        return (
                          <button
                            key={key}
                            type="button"
                            onClick={() =>
                              toggleRecoveryAssessment(typedKey)
                            }
                            className={`flex h-10 items-center gap-2 rounded-lg border px-2.5 text-left transition ${
                              checked
                                ? "border-teal-200 bg-teal-50"
                                : "border-slate-200 bg-white hover:border-teal-200 hover:bg-teal-50/30"
                            }`}
                          >
                            <span
                              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${
                                checked
                                  ? "border-teal-500 bg-teal-500 text-white"
                                  : "border-slate-300 bg-white text-transparent"
                              }`}
                            >
                              <Check className="h-3 w-3" />
                            </span>

                            <span className="text-[9px] font-semibold text-slate-700">
                              {label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </section>

                  {/* Recovery Notes */}
                  <section id="copilot-notes" tabIndex={-1} aria-label="Recovery Notes" className="flex min-h-0 flex-col rounded-lg border border-teal-100 bg-white">
                    <div className="border-b border-teal-100 bg-teal-50/30 px-3 py-2">
                      <h3 className="text-[10px] font-bold text-slate-900">
                        Recovery Notes
                      </h3>
                      <p className="text-[8px] text-slate-400">
                        Document relevant observations or events.
                      </p>
                    </div>

                    <div className="flex min-h-0 flex-1 flex-col p-3">
                      <textarea
                        value={recoveryNotes}
                        onChange={(event) =>
                          setRecoveryNotes(event.target.value)
                        }
                        placeholder="Add recovery notes..."
                        className="min-h-0 flex-1 resize-none rounded-lg border border-slate-200 p-2.5 text-[9px] leading-4 text-slate-700 outline-none focus:border-teal-300 focus:ring-2 focus:ring-teal-100"
                      />

                      <div className="mt-2 flex justify-end">
                        <button
                          type="button"
                          onClick={() => saveRecoveryNotes()}
                          className="h-7 rounded-lg border border-slate-200 bg-slate-100 px-3 !text-[11px] font-bold text-slate-600 hover:border-teal-200 hover:bg-teal-50"
                        >
                          Save Notes
                        </button>
                      </div>
                    </div>
                  </section>
                </div>

                {/* Required checkpoint — Ready for Transfer */}
                <section
                  id="copilot-transfer" tabIndex={-1} aria-label="Ready for Transfer"
                  className={`relative overflow-hidden rounded-xl border transition-all duration-300 ${
                    readyForTransferAt
                      ? "border-emerald-200 bg-emerald-50/45"
                      : canMarkReadyForTransfer
                        ? "border-teal-200 bg-gradient-to-r from-teal-50/80 via-white to-white shadow-[0_4px_18px_rgba(13,148,136,0.08)]"
                        : "border-slate-200 bg-slate-50/70"
                  }`}
                >
                  {!readyForTransferAt && canMarkReadyForTransfer && (
                    <span className="absolute bottom-0 left-0 top-0 w-[3px] bg-teal-500" />
                  )}

                  <div className="flex min-h-[58px] items-center justify-between gap-3 px-3 py-2">
                    <div className="flex min-w-0 items-center gap-2.5">
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${
                          readyForTransferAt
                            ? "bg-emerald-100 text-emerald-700"
                            : canMarkReadyForTransfer
                              ? "bg-teal-100 text-teal-700"
                              : "bg-slate-100 text-slate-400"
                        }`}
                      >
                        {readyForTransferAt ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : (
                          <PackageCheck className="h-4 w-4" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-[11px] font-bold text-slate-900">
                            Ready for Transfer
                          </p>

                          <span
                            className={`rounded-full border px-1.5 py-0.5 text-[6px] font-extrabold uppercase tracking-[0.12em] ${
                              readyForTransferAt
                                ? "border-emerald-200 bg-white text-emerald-700"
                                : canMarkReadyForTransfer
                                  ? "border-teal-200 bg-teal-50 text-teal-700"
                                  : "border-slate-200 bg-white text-slate-400"
                            }`}
                          >
                            {readyForTransferAt
                              ? "Completed"
                              : canMarkReadyForTransfer
                                ? "Required check"
                                : "Locked"}
                          </span>
                        </div>

                        <div className="mt-1 flex items-center gap-1.5">
                          <span
                            className={`rounded-md px-1.5 py-0.5 text-[8.5px] font-bold ${
                              awakeningConfirmed
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-slate-100 text-slate-400"
                            }`}
                          >
                            {awakeningConfirmed ? "✓ Awakening" : "○ Awakening"}
                          </span>

                          <span
                            className={`rounded-md px-1.5 py-0.5 text-[8.5px] font-bold ${
                              recoveryChecksComplete
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-slate-100 text-slate-400"
                            }`}
                          >
                            {recoveryChecksComplete
                              ? "✓ Recovery checks"
                              : `${Object.values(recoveryAssessment).filter(Boolean).length}/6 recovery checks`}
                          </span>

                          {readyForTransferAt && (
                            <span className="text-[10px] px-2 font-semibold text-emerald-700">
                              Ready at {formatClinicalTime(readyForTransferAt)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      <button
                        type="button"
                        disabled={!canMarkReadyForTransfer}
                        onClick={markReadyForTransfer}
                        className={`group flex h-9 items-center gap-2 rounded-lg border px-2.5 text-left transition-all ${
                          readyForTransferAt
                            ? "cursor-default border-emerald-200 bg-white text-emerald-700"
                            : canMarkReadyForTransfer
                              ? "border-teal-300 bg-white text-teal-800 shadow-[0_2px_8px_rgba(13,148,136,0.08)] hover:border-teal-400 hover:bg-teal-50"
                              : "cursor-not-allowed border-slate-200 bg-white text-slate-400"
                        }`}
                      >
                        <span
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-all ${
                            readyForTransferAt
                              ? "border-emerald-500 bg-emerald-500 text-white"
                              : canMarkReadyForTransfer
                                ? "border-teal-400 bg-white text-transparent group-hover:border-teal-500"
                                : "border-slate-300 bg-slate-50 text-transparent"
                          }`}
                        >
                          <Check className="h-3 w-3" strokeWidth={3} />
                        </span>

                        <div>
                          <p className="whitespace-nowrap text-[10px] font-bold">
                            {readyForTransferAt
                              ? "Transfer readiness confirmed"
                              : "Check Ready for Transfer"}
                          </p>
                          <p className="mt-0.5 whitespace-nowrap text-[8px] font-semibold opacity-70">
                            {readyForTransferAt
                              ? "Required checkpoint complete"
                              : canMarkReadyForTransfer
                                ? "All prerequisites complete"
                                : "Complete awakening + recovery checks"}
                          </p>
                        </div>
                      </button>

                      <button
                        type="button"
                        disabled={!canTransfer}
                        onClick={confirmTransferred}
                        className="h-8 rounded-lg bg-teal-600 px-3 !text-[11px] font-extrabold text-white shadow-sm transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 disabled:shadow-none"
                      >
                        {transferredAt ? "Transferred" : "Confirm Transferred"}
                      </button>
                    </div>
                  </div>
                </section>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
