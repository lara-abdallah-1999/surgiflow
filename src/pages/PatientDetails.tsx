import { ArrowLeft,ChevronLeft,ChevronRight,FileText,HeartPulse,UserRound } from "lucide-react";
import { useEffect,useMemo,useState } from "react";
import { useNavigate,useParams } from "react-router-dom";
import { patients } from "../data/patients";
import { CompactInfoCell,CompactJourneyMeta,CompactJourneyStep,HistoryPager,PatientStatus } from "../features/workspaces/PatientDetails/components";
import { journeyStages } from "../features/workspaces/PatientDetails/config";
import { type DisplaySurgery } from "../features/workspaces/PatientDetails/types";
import { getCompletedStageCount } from "../features/workspaces/PatientDetails/utils";
import { useSurgeryStore } from "../store/surgeryStore";


export default function PatientDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const surgeries = useSurgeryStore(
    (state) => state.surgeries,
  );

  const patient = patients.find(
    (item) => item.id === id,
  );

  const patientSurgeries = useMemo<DisplaySurgery[]>(
    () => {
      if (!patient) return [];

      const matches = surgeries.filter(
        (surgery) => {
          const candidate = surgery as typeof surgery & {
            patientId?: string;
            patientName?: string;
          };

          return (
            candidate.patientId === patient.id ||
            candidate.id === patient.id ||
            candidate.patientName ===
              patient.name
          );
        },
      );

      const mapped = matches.map(
        (surgery) => {
          const candidate =
            surgery as typeof surgery & {
              admissionDate?: string;
              room?: string;
              procedure?: string;
              doctor?: string;
              date?: string;
              time?: string;
              status?: string;
            };

          return {
            id: candidate.id,
            procedure:
              candidate.procedure ||
              patient.procedure ||
              "Procedure",
            doctor:
              candidate.doctor ||
              patient.surgeon ||
              "—",
            date:
              candidate.date ||
              patient.surgeryDate ||
              "—",
            time:
              candidate.time ||
              patient.surgeryTime ||
              "—",
            room:
              candidate.room ||
              patient.room ||
              "—",
            status:
              candidate.status ||
              patient.status ||
              "—",
            admissionDate:
              candidate.admissionDate ||
              patient.admissionDate ||
              "—",
          };
        },
      );

      if (mapped.length > 0) {
        return mapped.sort((a, b) =>
          String(b.date).localeCompare(
            String(a.date),
            undefined,
            { numeric: true },
          ),
        );
      }

      return [
        {
          id: patient.id,
          procedure: patient.procedure,
          doctor: patient.surgeon,
          date: patient.surgeryDate,
          time: patient.surgeryTime,
          room: patient.room,
          status: patient.status,
          admissionDate: patient.admissionDate,
        },
      ];
    },
    [patient, surgeries],
  );

  const [
    selectedSurgeryId,
    setSelectedSurgeryId,
  ] = useState<string | null>(null);

  const [historyPage, setHistoryPage] =
    useState(0);

  useEffect(() => {
    setSelectedSurgeryId(null);
    setHistoryPage(0);
  }, [id]);

  if (!patient) {
    return (
      <div className="flex h-[calc(100vh-72px)] items-center justify-center bg-slate-50 p-3">
        <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-fuchsia-50 text-fuchsia-600">
            <UserRound size={18} />
          </div>

          <h2 className="mt-3 text-[14px] font-semibold text-slate-800">
            Patient not found
          </h2>

          <p className="mt-1 text-[11px] text-slate-400">
            The requested patient could not be found.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate("/patients")
            }
            className="mt-4 inline-flex h-8 items-center gap-1.5 rounded-lg border border-fuchsia-200 bg-fuchsia-50 px-3 text-[11px] font-semibold text-fuchsia-700 transition hover:bg-fuchsia-100"
          >
            <ArrowLeft size={12} />
            Back to Patients
          </button>
        </div>
      </div>
    );
  }

  const selectedSurgery =
    selectedSurgeryId
      ? patientSurgeries.find(
          (item) =>
            item.id === selectedSurgeryId,
        )
      : undefined;



  const linkedSurgery = surgeries.find(
  (surgery) =>
    surgery.id === patient.id ||
    surgery.patientId === patient.id,
);

const detailsSource = {
  ...(linkedSurgery ?? {}),
  ...patient,
} as Record<string, unknown>;

const readValue = (...keys: string[]) => {
  for (const key of keys) {
    const value = detailsSource[key];

    if (
      value !== undefined &&
      value !== null &&
      value !== "" &&
      value !== "-" &&
      value !== "—"
    ) {
      return Array.isArray(value)
        ? value.join(", ")
        : String(value);
    }
  }

  return "";
};

const personalDetails = [
  {
    label: "Patient ID",
    value: patient.id,
  },
  {
    label: "MRN",
    value: readValue(
      "mrn",
      "medicalRecordNumber",
    ),
  },
  {
    label: "Age",
    value: patient.age
      ? `${patient.age} years`
      : "",
  },
  {
    label: "Gender",
    value: patient.gender,
  },
  {
    label: "Date of Birth",
    value: readValue(
      "dateOfBirth",
      "dob",
      "birthDate",
    ),
  },
  {
    label: "Phone",
    value: readValue("phone"),
  },
  {
    label: "Blood Type",
    value: readValue(
      "bloodType",
      "bloodGroup",
    ),
  },
  {
    label: "Allergies",
    value: readValue("allergies"),
  },
  {
    label: "Address",
    value: readValue("address"),
  },
  {
    label: "Emergency Contact",
    value: readValue(
      "emergencyContact",
      "emergencyPhone",
    ),
  },
  {
    label: "Admission Date",
    value:
      patient.admissionDate !== "-"
        ? patient.admissionDate
        : readValue("admittedAt"),
  },
  {
    label: "Total Surgeries",
    value: String(
      patientSurgeries.length,
    ),
  },
].filter((item) => item.value);

  return (
    <div data-workspace-page="PatientDetails" className="h-[calc(100vh-72px)] min-h-0 overflow-hidden bg-slate-50 p-2">
      <style>{`
        @keyframes patientJourneySlideIn {
          from {
            opacity: 0;
            transform: translateX(16px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>

      <div data-responsive-grid="3"
        className={`grid h-full min-h-0 gap-2 transition-[grid-template-columns] duration-300 ${
          selectedSurgeryId
            ? "grid-cols-[300px_340px_minmax(0,1fr)]"
            : "grid-cols-[300px_minmax(0,1fr)]"
        }`}
      >
        {/* ============================================================ */}
        {/* PATIENT INFORMATION                                          */}
        {/* ============================================================ */}

        <section className="flex min-h-0 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white">
          {/* Header + identity */}
          <div className="relative shrink-0 border-b border-slate-100 px-3 py-2.5">
            <span className="absolute bottom-2 left-0 top-2 w-[3px] rounded-r-full bg-fuchsia-500" />

            <div className="flex items-start gap-2.5">
              <button
                type="button"
                onClick={() => navigate("/patients")}
                title="Back to Patients"
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-500 transition hover:border-fuchsia-200 hover:bg-fuchsia-50 hover:text-fuchsia-700"
              >
                <ArrowLeft size={13} />
              </button>

              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-fuchsia-50 text-[11px] font-bold text-fuchsia-700 ring-1 ring-inset ring-fuchsia-100">
                {patient.initials}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex min-w-0 items-center gap-1.5">
                  <h1 className="truncate text-[14px] font-semibold tracking-[-0.2px] text-slate-800">
                    {patient.name}
                  </h1>

                  <PatientStatus
                    status={patient.status}
                    compact
                  />
                </div>

                <p className="mt-0.5 text-[9px] font-semibold uppercase tracking-wide text-fuchsia-500">
                  Patient Information
                </p>
              </div>
            </div>
          </div>

          {/* Complete patient details */}
          <div className="min-h-0 flex-1 p-2">
            <div data-responsive-grid="2" className="grid grid-cols-2 gap-1.5">
              {personalDetails.map((item) => (
                <CompactInfoCell
                  key={item.label}
                  label={item.label}
                  value={item.value}
                  full={
                    item.label === "Allergies" ||
                    item.label === "Address" ||
                    item.label ===
                      "Emergency Contact"
                  }
                />
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* SURGICAL HISTORY                                             */}
        {/* ============================================================ */}

        <section className="flex min-h-0 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div data-page-toolbar="true" className="flex h-[50px] shrink-0 items-center justify-between gap-3 border-b border-slate-100 px-3">
            <div className="flex min-w-0 items-center gap-2">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-fuchsia-50 text-fuchsia-600">
                <FileText size={13} />
              </div>

              <div className="min-w-0">
                <h2 className="text-[11.5px] font-semibold text-slate-800">
                  Surgical History
                </h2>

                <p className="mt-0.5 truncate text-[9.5px] text-slate-400">
                  {selectedSurgeryId
                    ? "Select another record to switch"
                    : "Select a surgery to view its journey"}
                </p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-1.5">
              <span className="rounded-md bg-fuchsia-50 px-2 py-1 text-[9px] font-semibold text-fuchsia-700">
                {patientSurgeries.length}
              </span>

              {patientSurgeries.length >
                6 && (
                <HistoryPager
                  page={historyPage}
                  totalPages={Math.max(
                    1,
                    Math.ceil(
                      patientSurgeries.length / 6,
                    ),
                  )}
                  onPrevious={() =>
                    setHistoryPage((current) =>
                      Math.max(0, current - 1),
                    )
                  }
                  onNext={() =>
                    setHistoryPage((current) =>
                      Math.min(
                        Math.max(
                          1,
                          Math.ceil(
                            patientSurgeries.length /
                              6,
                          ),
                        ) - 1,
                        current + 1,
                      ),
                    )
                  }
                />
              )}
            </div>
          </div>

          {/* Expanded history header */}
          {!selectedSurgeryId && (
            <div data-responsive-table-header="true" className="grid h-[30px] shrink-0 grid-cols-[86px_minmax(150px,1.2fr)_minmax(125px,1fr)_86px_108px_20px] items-center border-b border-slate-100 bg-slate-50/80 px-2.5 text-[8.5px] font-semibold uppercase tracking-wide text-slate-400">
              <span>Date</span>
              <span>Procedure</span>
              <span>Surgeon</span>
              <span>OR / Time</span>
              <span>Status</span>
              <span />
            </div>
          )}

          {/* Compact history header */}
          {selectedSurgeryId && (
            <div data-responsive-table-header="true" className="grid h-[30px] shrink-0 grid-cols-[72px_minmax(0,1fr)_86px_18px] items-center border-b border-slate-100 bg-slate-50/80 px-2.5 text-[8.5px] font-semibold uppercase tracking-wide text-slate-400">
              <span>Date</span>
              <span>Surgery</span>
              <span>Status</span>
              <span />
            </div>
          )}

          <div className="min-h-0 flex-1">
            {patientSurgeries
              .slice(
                historyPage * 6,
                historyPage * 6 + 6,
              )
              .map((surgery) => {
                const active =
                  surgery.id ===
                  selectedSurgeryId;

                return (
                  <button data-responsive-table-row="true"
                    key={surgery.id}
                    type="button"
                    onClick={() =>
                      setSelectedSurgeryId(
                        surgery.id,
                      )
                    }
                    className={`group relative grid h-[44px] w-full items-center border-b border-slate-100 px-2.5 text-left transition ${
                      selectedSurgeryId
                        ? "grid-cols-[72px_minmax(0,1fr)_86px_18px]"
                        : "grid-cols-[86px_minmax(150px,1.2fr)_minmax(125px,1fr)_86px_108px_20px]"
                    } ${
                      active
                        ? "bg-fuchsia-50/65"
                        : "bg-white hover:bg-slate-50/70"
                    }`}
                  >
                    <span 
                      className={`absolute bottom-1.5 left-0 top-1.5 w-[3px] rounded-r-full ${
                        active
                          ? "bg-fuchsia-600"
                          : "bg-fuchsia-400"
                      }`}
                    />

                    <div data-cell-label="Date"  className="min-w-0 pr-1.5">
                      <p className="truncate text-[10px] font-semibold text-slate-700">
                        {surgery.date}
                      </p>

                      {selectedSurgeryId && (
                        <p className="mt-0.5 truncate text-[8.5px] text-slate-400">
                          {surgery.time}
                        </p>
                      )}
                    </div>

                    <div data-cell-label="Surgery"  className="min-w-0 pr-2">
                      <p
                        className="truncate text-[10.5px] font-semibold text-slate-800"
                        title={surgery.procedure}
                      >
                        {surgery.procedure}
                      </p>

                      {selectedSurgeryId && (
                        <p
                          className="mt-0.5 truncate text-[8.5px] text-slate-400"
                          title={`${surgery.doctor} · ${surgery.room}`}
                        >
                          {surgery.doctor} ·{" "}
                          {surgery.room}
                        </p>
                      )}
                    </div>

                    {!selectedSurgeryId && (
                      <>
                        <p
                          className="min-w-0 truncate pr-2 text-[10px] font-medium text-slate-600"
                          title={surgery.doctor}
                        >
                          {surgery.doctor}
                        </p>

                        <div className="min-w-0">
                          <p className="truncate text-[9.5px] font-medium text-slate-600">
                            {surgery.room}
                          </p>

                          <p className="mt-0.5 truncate text-[8.5px] text-slate-400">
                            {surgery.time}
                          </p>
                        </div>
                      </>
                    )}

                    <PatientStatus
                      status={surgery.status}
                      compact
                    />

                    <ChevronRight
                      size={11}
                      className={`justify-self-end ${
                        active
                          ? "text-fuchsia-600"
                          : "text-slate-300 group-hover:text-fuchsia-500"
                      }`}
                    />
                  </button>
                );
              })}
          </div>

          <div className="flex h-[36px] shrink-0 items-center justify-between border-t border-slate-100 px-3">
            <span className="text-[9px] text-slate-400">
              {patientSurgeries.length === 0
                ? "No records"
                : `Showing ${
                    historyPage * 6 + 1
                  }–${Math.min(
                    historyPage * 6 + 6,
                    patientSurgeries.length,
                  )} of ${
                    patientSurgeries.length
                  }`}
            </span>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() =>
                  setHistoryPage((current) =>
                    Math.max(0, current - 1),
                  )
                }
                disabled={historyPage === 0}
                className="flex h-6 w-6 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-400 transition hover:border-fuchsia-200 hover:bg-fuchsia-50 hover:text-fuchsia-600 disabled:cursor-not-allowed disabled:opacity-35"
                title="Previous page"
              >
                <ChevronLeft size={10} />
              </button>

              {Array.from({
                length: Math.max(
                  1,
                  Math.ceil(
                    patientSurgeries.length / 6,
                  ),
                ),
              }).map((_, pageIndex) => {
                const active =
                  pageIndex === historyPage;

                return (
                  <button
                    key={pageIndex}
                    type="button"
                    onClick={() =>
                      setHistoryPage(pageIndex)
                    }
                    className={`flex h-6 min-w-6 items-center justify-center rounded-md border px-1.5 text-[9px] font-semibold transition ${
                      active
                        ? "border-fuchsia-200 bg-fuchsia-50 text-fuchsia-700"
                        : "border-slate-200 bg-white text-slate-500 hover:border-fuchsia-200 hover:bg-fuchsia-50 hover:text-fuchsia-600"
                    }`}
                  >
                    {pageIndex + 1}
                  </button>
                );
              })}

              <button
                type="button"
                onClick={() =>
                  setHistoryPage((current) =>
                    Math.min(
                      Math.max(
                        1,
                        Math.ceil(
                          patientSurgeries.length / 6,
                        ),
                      ) - 1,
                      current + 1,
                    ),
                  )
                }
                disabled={
                  historyPage >=
                  Math.max(
                    1,
                    Math.ceil(
                      patientSurgeries.length / 6,
                    ),
                  ) -
                    1
                }
                className="flex h-6 w-6 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-400 transition hover:border-fuchsia-200 hover:bg-fuchsia-50 hover:text-fuchsia-600 disabled:cursor-not-allowed disabled:opacity-35"
                title="Next page"
              >
                <ChevronRight size={10} />
              </button>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* SURGERY JOURNEY                                              */}
        {/* ============================================================ */}

        {selectedSurgeryId &&
          selectedSurgery && (
            <section className="flex min-h-0 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white animate-[patientJourneySlideIn_220ms_ease-out]">
              <div data-page-toolbar="true" className="flex h-[50px] shrink-0 items-center justify-between gap-3 border-b border-slate-100 px-3">
                <div className="flex min-w-0 items-center gap-2">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-fuchsia-50 text-fuchsia-600">
                    <HeartPulse size={13} />
                  </div>

                  <div className="min-w-0">
                    <h2 className="text-[11.5px] font-semibold text-slate-800">
                      Surgery Journey
                    </h2>

                    <p className="mt-0.5 truncate text-[9.5px] text-slate-400">
                      {selectedSurgery.procedure}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setSelectedSurgeryId(null)
                  }
                  className="inline-flex h-6.5 items-center rounded-lg border border-slate-200 bg-white px-2.5 text-[9.5px] font-semibold text-slate-500 transition hover:border-fuchsia-200 hover:bg-fuchsia-50 hover:text-fuchsia-700"
                >
                  Close
                </button>
              </div>

              {/* Compact surgery summary */}
              <div data-responsive-grid="2" className="grid shrink-0 grid-cols-2 gap-px border-b border-slate-100 bg-slate-100">
                <CompactJourneyMeta
                  label="Surgeon"
                  value={selectedSurgery.doctor}
                />

                <CompactJourneyMeta
                  label="Scheduled"
                  value={`${selectedSurgery.date} · ${selectedSurgery.time}`}
                />

                <CompactJourneyMeta
                  label="Operating Room"
                  value={selectedSurgery.room}
                />

                <CompactJourneyMeta
                  label="Case"
                  value={selectedSurgery.id}
                />
              </div>

              <div className="flex min-h-0 flex-1 flex-col p-2.5">
                <div className="mb-2 flex shrink-0 items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[10.5px] font-semibold text-slate-700">
                      Workflow Progress
                    </p>

                    <p className="mt-0.5 truncate text-[9px] text-slate-400">
                      Complete path of this surgery
                    </p>
                  </div>

                  <PatientStatus
                    status={selectedSurgery.status}
                    compact
                  />
                </div>

                {/* 10 stages fit in two columns / five rows */}
                <div data-responsive-grid="2" className="grid min-h-0 flex-1 auto-rows-fr grid-cols-2 gap-1.5">
                  {journeyStages.map(
                    (stage, index) => {
                      const completed =
                        getCompletedStageCount(
                          selectedSurgery.status,
                        );

                      return (
                        <CompactJourneyStep
                          key={stage}
                          index={index}
                          stage={stage}
                          completed={
                            index < completed
                          }
                          current={
                            index === completed
                          }
                        />
                      );
                    },
                  )}
                </div>
              </div>
            </section>
          )}
      </div>
    </div>
  );
}
