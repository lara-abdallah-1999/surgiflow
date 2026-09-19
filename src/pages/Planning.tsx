import { Building2,CalendarDays,ChevronLeft,ChevronRight,Clock3,Route,Stethoscope } from "lucide-react";
import { PlanEditor } from "../features/workspaces/Planning/components";
import { changeDay,field,localToday,toDateLabel } from "../features/workspaces/Planning/config";
import { usePlanningWorkspace } from '../features/workspaces/Planning/hooks/usePlanningWorkspace';
import { canPlan,conflictsFor,endTime,isFinished } from "../utils/planning";


export default function Planning() {
  const { setDate, date, setDoctorFilterOpen, doctor, doctorFilterOpen, setDoctor, doctors, notice, itinerary, setEditing, dayCases, rooms, editing, surgeries, updateSurgery, setNotice } = usePlanningWorkspace();

return (
    <div data-workspace-page="Planning" className="flex h-[calc(100vh-58px)] min-h-0 flex-col gap-2.5 overflow-hidden bg-slate-50/65 p-2.5">
      {/* PAGE HEADER */}
      <header className="shrink-0 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-[0_1px_3px_rgba(15,23,42,0.035)]">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
                <Route size={15} />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-[12.5px] font-bold text-slate-800">
                    Planning
                  </h1>

                  <span className="rounded-full bg-violet-50 px-2 py-0.5 text-[8px] font-bold uppercase tracking-wide text-violet-600">
                    Daily OR Plan
                  </span>
                </div>

                <p className="mt-0.5 text-[9px] text-slate-400">
                  Plan room sequence, operation timing and each doctor&apos;s path for the day.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2">
            <div className="flex h-8 items-center rounded-lg border border-slate-200 bg-slate-50 p-0.5">
              <button
                type="button"
                onClick={() =>
                  setDate(
                    changeDay(date, -1),
                  )
                }
                className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition hover:bg-white hover:text-slate-700 hover:shadow-sm"
              >
                <ChevronLeft size={13} />
              </button>

              <button
                type="button"
                onClick={() =>
                  setDate(localToday())
                }
                className="min-w-[128px] px-2 text-[9px] font-semibold text-slate-600"
              >
                {toDateLabel(date)}
              </button>

              <button
                type="button"
                onClick={() =>
                  setDate(
                    changeDay(date, 1),
                  )
                }
                className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition hover:bg-white hover:text-slate-700 hover:shadow-sm"
              >
                <ChevronRight size={13} />
              </button>
            </div>

            <input
              aria-label="Planning date"
              type="date"
              value={date}
              onChange={(event) => {
                if (
                  event.target.value
                ) {
                  setDate(
                    event.target.value,
                  );
                }
              }}
              className={`${field} w-[118px]`}
            />

            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  setDoctorFilterOpen(
                    (value) => !value,
                  )
                }
                className={`flex h-8 min-w-[124px] items-center justify-between gap-2 rounded-lg border px-2.5 text-[9px] font-semibold transition ${
                  doctor
                    ? "border-violet-200 bg-violet-50 text-violet-700"
                    : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                }`}
              >
                <div className="flex min-w-0 items-center gap-1.5">
                  <Stethoscope size={10} />
                  <span className="truncate">
                    {doctor || "Doctor"}
                  </span>
                </div>

                <ChevronRight
                  size={9}
                  className={`text-slate-300 transition ${
                    doctorFilterOpen
                      ? "-rotate-90"
                      : "rotate-90"
                  }`}
                />
              </button>

              {doctorFilterOpen && (
                <div className="absolute right-0 top-[calc(100%+6px)] z-[120] w-[280px] rounded-xl border border-slate-200 bg-white p-3 shadow-[0_16px_36px_rgba(15,23,42,0.16)]">
                  <div className="mb-2.5 flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[9px] font-semibold text-slate-700">
                        Doctor Filter
                      </p>
                      <p className="mt-0.5 text-[7.5px] text-slate-400">
                        Choose a doctor to focus the planning view.
                      </p>
                    </div>

                    {doctor && (
                      <button
                        type="button"
                        onClick={() => setDoctor("")}
                        className="shrink-0 text-[7.5px] font-semibold text-violet-600 transition hover:text-violet-700"
                      >
                        Clear
                      </button>
                    )}
                  </div>

                  <div className="flex max-h-[190px] flex-wrap gap-1.5 overflow-y-auto">
                    <button
                      type="button"
                      onClick={() => setDoctor("")}
                      className={`h-7 rounded-lg border px-2.5 text-[8px] font-semibold transition ${
                        !doctor
                          ? "border-violet-200 bg-violet-50 text-violet-700 shadow-sm"
                          : "border-slate-200 bg-white text-slate-500 hover:border-violet-200 hover:bg-violet-50/40 hover:text-violet-700"
                      }`}
                    >
                      All Doctors
                    </button>

                    {doctors.map((name) => {
                      const selected = doctor === name;

                      return (
                        <button
                          key={name}
                          type="button"
                          onClick={() =>
                            setDoctor(selected ? "" : name)
                          }
                          className={`h-7 rounded-lg border px-2.5 text-[8px] font-semibold transition ${
                            selected
                              ? "border-violet-200 bg-violet-50 text-violet-700 shadow-sm"
                              : "border-slate-200 bg-white text-slate-500 hover:border-violet-200 hover:bg-violet-50/40 hover:text-violet-700"
                          }`}
                        >
                          {name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {notice && (
        <div
          role="status"
          className="shrink-0 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-[9.5px] font-medium text-emerald-700"
        >
          {notice}
        </div>
      )}

      {/* MAIN PLANNING AREA */}
      <div data-responsive-grid="2" className="grid min-h-0 flex-1 grid-cols-[minmax(260px,0.72fr)_minmax(0,1.6fr)] gap-2.5">
        {/* DOCTOR'S DAY PLAN */}
        <section className="flex min-h-0 flex-col overflow-hidden rounded-2xl border border-violet-100 bg-white">
          <div data-page-toolbar="true" className="flex h-[38px] shrink-0 items-center justify-between border-b border-violet-100 bg-violet-50/45 px-3">
            <div className="flex items-center gap-2">
              <Route
                size={12}
                className="text-violet-600"
              />

              <div>
                <h2 className="text-[10.5px] font-bold text-slate-700">
                  {doctor
                    ? `${doctor}'s Day Plan`
                    : "Daily Operation Sequence"}
                </h2>

                <p className="mt-0.5 text-[8.5px] text-slate-400">
                  {doctor
                    ? "Chronological room-to-room path for the selected doctor."
                    : "Select a doctor to view a personal route for the day."}
                </p>
              </div>
            </div>

            <span className="text-[8px] font-semibold text-slate-400">
              {itinerary.length} remaining
            </span>
          </div>

          <div className="min-h-0 flex-1 overflow-auto px-2.5 py-2.5">
            {itinerary.length > 0 ? (
              <div className="space-y-0">
                {itinerary.map(
                  (surgery, index) => {
                    const running =
                      surgery.status ===
                      "In Progress";

                    return (
                      <div
                        key={surgery.id}
                        className="relative flex gap-3"
                      >
                        {/* TIMELINE */}
                        <div className="flex w-7 shrink-0 flex-col items-center">
                          <div
                            className={`flex h-6 w-6 items-center justify-center rounded-full text-[8px] font-bold ${
                              running
                                ? "bg-violet-600 text-white"
                                : "bg-violet-50 text-violet-600 ring-1 ring-violet-100"
                            }`}
                          >
                            {String(
                              index + 1,
                            ).padStart(
                              2,
                              "0",
                            )}
                          </div>

                          {index <
                            itinerary.length -
                              1 && (
                            <div className="my-1 h-full min-h-[30px] w-px bg-violet-100" />
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            setEditing(
                              surgery,
                            )
                          }
                          className={`mb-2 block min-w-0 flex-1 rounded-xl border px-3 py-2.5 text-left transition ${
                            running
                              ? "border-violet-200 bg-violet-50/65"
                              : "border-slate-200 bg-white hover:border-violet-200 hover:bg-violet-50/25"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1.5">
                              <Clock3
                                size={10}
                                className={
                                  running
                                    ? "text-violet-600"
                                    : "text-slate-400"
                                }
                              />

                              <span
                                className={`text-[10px] font-bold tabular-nums ${
                                  running
                                    ? "text-violet-700"
                                    : "text-slate-700"
                                }`}
                              >
                                {
                                  surgery.time
                                }
                              </span>
                            </div>

                            <span
                              className={`rounded-full px-2 py-0.5 text-[7.5px] font-bold ${
                                running
                                  ? "bg-violet-100 text-violet-700"
                                  : "bg-slate-50 text-slate-400"
                              }`}
                            >
                              {running
                                ? "NOW"
                                : surgery.room}
                            </span>
                          </div>

                          <div className="mt-2 flex items-center gap-1.5">
                            <Building2
                              size={10}
                              className="text-violet-500"
                            />

                            <span className="text-[9px] font-semibold text-violet-700">
                              {
                                surgery.room
                              }
                            </span>
                          </div>

                          <p className="mt-1.5 truncate text-[10.5px] font-semibold text-slate-800">
                            {
                              surgery.patientName
                            }
                          </p>

                          <p className="mt-0.5 truncate text-[8.5px] text-slate-400">
                            {
                              surgery.procedure
                            }
                          </p>
                        </button>
                      </div>
                    );
                  },
                )}
              </div>
            ) : (
              <div className="flex h-full min-h-[160px] items-center justify-center">
                <div className="text-center">
                  <Route
                    size={18}
                    className="mx-auto text-slate-300"
                  />

                  <p className="mt-2 text-[9.5px] font-semibold text-slate-500">
                    No remaining operations
                  </p>

                  <p className="mt-1 text-[8px] text-slate-400">
                    {doctor
                      ? "This doctor has no remaining cases for the selected date."
                      : "Choose a doctor filter to see a personal day route."}
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* OPERATING ROOM SEQUENCE */}
        <section className="flex min-h-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div data-page-toolbar="true" className="flex h-[38px] shrink-0 items-center justify-between border-b border-slate-100 px-3">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
                <Building2 size={12} />
              </div>

              <div>
                <h2 className="text-[11px] font-bold text-slate-700">
                  Operating Room Sequence
                </h2>

                <p className="mt-0.5 text-[9px] text-slate-400">
                  Current operation, next case and the complete order for each OR.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-[8px] font-semibold">
              <span className="flex items-center gap-1 text-violet-600">
                <span className="h-2 w-2 rounded-full bg-violet-500" />
                Now
              </span>

              <span className="flex items-center gap-1 text-blue-600">
                <span className="h-2 w-2 rounded-full bg-blue-500" />
                Up Next
              </span>

              <span className="flex items-center gap-1 text-slate-400">
                <span className="h-2 w-2 rounded-full bg-slate-300" />
                Later
              </span>
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-auto">
            {dayCases.length === 0 ? (
              <div className="flex h-full items-center justify-center">
                <div className="text-center">
                  <CalendarDays
                    size={20}
                    className="mx-auto text-slate-300"
                  />

                  <p className="mt-2 text-[10px] font-semibold text-slate-600">
                    No operations scheduled for this date
                  </p>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {rooms.map((room) => {
                  const roomCases =
                    dayCases.filter(
                      (surgery) =>
                        surgery.room ===
                        room,
                    );

                  const running =
                    roomCases.find(
                      (surgery) =>
                        surgery.status ===
                        "In Progress",
                    );

                  const next =
                    roomCases.find(
                      (surgery) =>
                        surgery.id !==
                          running?.id &&
                        canPlan(
                          surgery,
                        ),
                    );

                  const cards =
                    roomCases.filter(
                      (surgery) =>
                        !doctor ||
                        surgery.doctor ===
                          doctor,
                    );

                  return (
                    <div data-responsive-grid="2"
                      key={room}
                      className="grid min-h-[118px] grid-cols-[165px_minmax(0,1fr)] bg-white"
                    >
                      {/* ROOM OVERVIEW */}
                      <div className="border-r border-slate-100 bg-slate-50/55 px-3 py-2.5">
                        <div className="flex items-center gap-2">
                          <span
                            className={`h-2.5 w-2.5 rounded-full ${
                              running
                                ? "bg-violet-500"
                                : next
                                  ? "bg-blue-400"
                                  : "bg-slate-300"
                            }`}
                          />

                          <h3 className="text-[11px] font-bold text-slate-800">
                            {room}
                          </h3>
                        </div>

                        <div className="mt-3 space-y-2.5">
                          <div>
                            <p className="text-[7.5px] font-semibold uppercase tracking-wide text-slate-400">
                              Current
                            </p>

                            {running ? (
                              <>
                                <p className="mt-0.5 truncate text-[9.5px] font-semibold text-violet-700">
                                  {
                                    running.patientName
                                  }
                                </p>

                                <p className="mt-0.5 text-[9.5px] font-medium text-slate-600">
                                  {running.doctor}
                                </p>

                                <p className="mt-0.5 text-[8px] font-medium tabular-nums text-violet-500">
                                  {
                                    running.time
                                  }{" "}
                                  –{" "}
                                  {
                                    endTime(
                                      running,
                                    )
                                  }
                                </p>
                              </>
                            ) : (
                              <p className="mt-0.5 text-[9px] font-medium text-slate-400">
                                No active surgery
                              </p>
                            )}
                          </div>

                          <div>
                            <p className="text-[7.5px] font-semibold uppercase tracking-wide text-slate-400">
                              Next
                            </p>

                            {next ? (
                              <>
                                <p className="mt-0.5 truncate text-[9.5px] font-semibold text-blue-700">
                                  {
                                    next.patientName
                                  }
                                </p>

                                <p className="mt-0.5 text-[9.5px] font-medium text-slate-600">
                                  {next.doctor}
                                </p>

                                <p className="mt-0.5 text-[8px] font-medium tabular-nums text-blue-500">
                                  {
                                    next.time
                                  }{" "}
                                  –{" "}
                                  {
                                    endTime(
                                      next,
                                    )
                                  }
                                </p>
                              </>
                            ) : (
                              <p className="mt-0.5 text-[9px] font-medium text-slate-400">
                                No next operation
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* ROOM CASES */}
                      <div className="min-w-0 px-2.5 py-2.5">
                        {cards.length > 0 ? (
                          <div className="space-y-2">
                            {cards.map(
                              (
                                surgery,
                                index,
                              ) => {
                                const overlap =
                                  conflictsFor(
                                    surgery,
                                    dayCases,
                                  );

                                const isRunning =
                                  surgery.id ===
                                  running?.id;

                                const isNext =
                                  surgery.id ===
                                  next?.id;

                                const finished =
                                  isFinished(
                                    surgery,
                                  );

                                return (
                                  <button
                                    key={
                                      surgery.id
                                    }
                                    type="button"
                                    onClick={() =>
                                      setEditing(
                                        surgery,
                                      )
                                    }
                                    className={`grid w-full grid-cols-[70px_88px_minmax(0,1.3fr)_minmax(0,0.95fr)_minmax(120px,0.95fr)_82px] items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition ${
                                      isRunning
                                        ? "border-violet-200 bg-violet-50/65"
                                        : isNext
                                          ? "border-blue-200 bg-blue-50/50"
                                          : finished
                                            ? "border-slate-100 bg-slate-50/55 opacity-70"
                                            : "border-slate-200 bg-white hover:border-violet-200 hover:bg-violet-50/20"
                                    }`}
                                  >
                                    <div>
                                      <span
                                        className={`inline-flex rounded-full px-2 py-1 text-[7.5px] font-bold uppercase tracking-wide ${
                                          isRunning
                                            ? "bg-violet-100 text-violet-700"
                                            : isNext
                                              ? "bg-blue-100 text-blue-700"
                                              : "bg-slate-100 text-slate-500"
                                        }`}
                                      >
                                        {isRunning
                                          ? "Now"
                                          : isNext
                                            ? "Up Next"
                                            : `#${index + 1}`}
                                      </span>
                                    </div>

                                    <div>
                                      <p className="text-[10px] font-bold tabular-nums text-slate-700">
                                        {
                                          surgery.time
                                        }
                                      </p>

                                      <p className="mt-0.5 text-[8px] text-slate-400">
                                        to{" "}
                                        {
                                          endTime(
                                            surgery,
                                          )
                                        }
                                      </p>
                                    </div>

                                    <div className="min-w-0">
                                      <p className="truncate text-[10.5px] font-semibold text-slate-800">
                                        {
                                          surgery.patientName
                                        }
                                      </p>

                                      <p className="mt-0.5 truncate text-[8.5px] text-slate-400">
                                        {surgery.mrn ||
                                          "MRN not recorded"}
                                      </p>
                                    </div>

                                    <p className="truncate text-[9.5px] font-medium text-slate-600">
                                      {
                                        surgery.procedure
                                      }
                                    </p>

                                    <div className="min-w-0">
                                      <div className="flex items-center gap-1.5">
                                        <Stethoscope
                                          size={9}
                                          className="shrink-0 text-violet-500"
                                        />

                                        <span className="truncate text-[9px] font-semibold text-slate-600">
                                          {surgery.doctor}
                                        </span>
                                      </div>

                                      <p className="mt-0.5 text-[7.5px] font-medium uppercase tracking-wide text-slate-400">
                                        Surgeon
                                      </p>
                                    </div>

                                    <div className="flex justify-end">
                                      {overlap.length >
                                      0 ? (
                                        <span className="rounded-full bg-amber-50 px-2 py-1 text-[7.5px] font-bold text-amber-700">
                                          {
                                            overlap.length
                                          }{" "}
                                          conflict
                                        </span>
                                      ) : (
                                        <span className="rounded-full bg-slate-50 px-2 py-1 text-[7.5px] font-semibold text-slate-400">
                                          {
                                            surgery.status
                                          }
                                        </span>
                                      )}
                                    </div>
                                  </button>
                                );
                              },
                            )}
                          </div>
                        ) : (
                          <div className="flex h-full min-h-[90px] items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/35">
                            <p className="text-[9px] text-slate-400">
                              {doctor
                                ? "No operations for this doctor in this room."
                                : "No operations planned."}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </div>

      {editing && (
        <PlanEditor
          key={editing.id}
          surgery={
            surgeries.find(
              (surgery) =>
                surgery.id ===
                editing.id,
            ) || editing
          }
          surgeries={surgeries}
          rooms={rooms}
          onClose={() =>
            setEditing(null)
          }
          onSave={(updates) => {
            updateSurgery(
              editing.id,
              updates,
            );

            setNotice(
              `Plan updated for ${editing.patientName}. Room sequence and doctor itinerary refreshed.`,
            );

            setEditing(null);
          }}
        />
      )}
    </div>
  );
}
