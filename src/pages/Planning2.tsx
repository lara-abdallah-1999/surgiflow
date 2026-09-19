import { AlertTriangle,Building2,CalendarDays,ChevronDown,ChevronLeft,ChevronRight,Clock3,Filter,Maximize2,Minimize2,Route,Search } from "lucide-react";
import { MoveConfirmation,PlanEditor,StatusCell,SummaryCard } from "../features/workspaces/Planning2/components";
import { calendarDays,changeDay,formatDateValue,localToday,monthTitle,STATUS_COLUMNS } from "../features/workspaces/Planning2/config";
import { usePlanning2Workspace } from '../features/workspaces/Planning2/hooks/usePlanning2Workspace';
import { getToneClasses } from "../features/workspaces/Planning2/utils";
import { isFinished } from "../utils/planning";


export default function Planning2() {
  const { scheduledCases, upcomingReady, inProgress, conflictCases, setDate, date, calendarRef, setCalendarOpen, calendarOpen, rangeLabel, calendarMonth, setCalendarMonth, surgeries, search, setSearch, doctorFilterRef, setDoctorFilterOpen, doctor, doctorFilterOpen, setDoctor, doctors, notice, boardExpanded, setBoardExpanded, scopedCases, roomRows, draggedSurgery, dragOverCell, setDraggedSurgeryId, setDragOverCell, setPendingMove, setEditing, pendingMove, updateSurgery, setNotice, editing, rooms } = usePlanning2Workspace();

return (
    <div data-workspace-page="Planning2" className="flex h-[calc(100vh-58px)] min-h-0 flex-col gap-2.5 overflow-hidden bg-slate-50/65 p-2.5">
      {/* SUMMARY CARDS */}
      <section data-responsive-grid="4" className="grid shrink-0 grid-cols-4 gap-2">
        <SummaryCard
          label="Scheduled Cases"
          value={scheduledCases}
          helper="selected day"
          tone="blue"
          icon={
            <CalendarDays
              size={15}
            />
          }
        />

        <SummaryCard
          label="Upcoming / Ready"
          value={upcomingReady}
          helper="waiting to start"
          tone="violet"
          icon={
            <Clock3
              size={15}
            />
          }
        />

        <SummaryCard
          label="In Progress"
          value={inProgress}
          helper="currently active"
          tone="amber"
          icon={
            <Route
              size={15}
            />
          }
        />

        <SummaryCard
          label="Conflicts"
          value={
            conflictCases.length
          }
          helper="needs attention"
          tone="red"
          icon={
            <AlertTriangle
              size={15}
            />
          }
        />
      </section>

      {/* PAGE CONTROLS */}
      <header className="shrink-0 rounded-xl border border-slate-200 bg-white shadow-[0_1px_3px_rgba(15,23,42,0.035)]">
        <div data-page-toolbar="true" className="flex items-center justify-between gap-3 border-b border-slate-100 px-3 py-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() =>
                setDate(
                  localToday(),
                )
              }
              className="h-8 rounded-lg border border-slate-200 bg-white px-3 text-[9px] font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              Today
            </button>

            <button
              type="button"
              onClick={() =>
                setDate(
                  changeDay(
                    date,
                    -1,
                  ),
                )
              }
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 transition hover:bg-slate-50 hover:text-slate-700"
              aria-label="Previous day"
              title="Previous day"
            >
              <ChevronLeft
                size={13}
              />
            </button>

            <button
              type="button"
              onClick={() =>
                setDate(
                  changeDay(
                    date,
                    1,
                  ),
                )
              }
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 transition hover:bg-slate-50 hover:text-slate-700"
              aria-label="Next day"
              title="Next day"
            >
              <ChevronRight
                size={13}
              />
            </button>

            <div ref={calendarRef} className="relative">
              <button
                type="button"
                onClick={() => setCalendarOpen((current) => !current)}
                className={`group flex h-8 items-center gap-2 rounded-lg border bg-white px-2.5 transition ${
                  calendarOpen
                    ? "border-violet-200 bg-violet-50/40 ring-2 ring-violet-100"
                    : "border-slate-200 hover:border-violet-200 hover:bg-violet-50/20"
                }`}
              >
                <CalendarDays
                  size={12}
                  className="shrink-0 text-violet-500"
                />

                <span className="min-w-[126px] text-left text-[9px] font-semibold text-slate-700">
                  {rangeLabel}
                </span>

                <ChevronDown
                  size={10}
                  className={`shrink-0 text-slate-300 transition ${
                    calendarOpen ? "rotate-180 text-violet-500" : "group-hover:text-violet-400"
                  }`}
                />
              </button>

              {calendarOpen && (
                <div className="absolute left-0 top-[calc(100%+7px)] z-[180] w-[292px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_20px_55px_rgba(15,23,42,0.18)]">
                  <div data-page-toolbar="true" className="flex items-center justify-between border-b border-slate-100 bg-slate-50/65 px-3 py-2.5">
                    <div>
                      <p className="text-[10px] font-bold text-slate-800">
                        {monthTitle(calendarMonth)}
                      </p>
                      <p className="mt-0.5 text-[7.5px] text-slate-400">
                        Choose a day for the planning board
                      </p>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() =>
                          setCalendarMonth(
                            (current) =>
                              new Date(
                                current.getFullYear(),
                                current.getMonth() - 1,
                                1,
                              ),
                          )
                        }
                        className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
                        aria-label="Previous month"
                      >
                        <ChevronLeft size={12} />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setCalendarMonth(
                            (current) =>
                              new Date(
                                current.getFullYear(),
                                current.getMonth() + 1,
                                1,
                              ),
                          )
                        }
                        className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
                        aria-label="Next month"
                      >
                        <ChevronRight size={12} />
                      </button>
                    </div>
                  </div>

                  <div className="p-3">
                    <div className="grid grid-cols-7 gap-1">
                      {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                        (day) => (
                          <div
                            key={day}
                            className="flex h-6 items-center justify-center text-[6.5px] font-bold uppercase tracking-wide text-slate-400"
                          >
                            {day}
                          </div>
                        ),
                      )}

                      {calendarDays(calendarMonth).map((dayValue) => {
                        const value = formatDateValue(dayValue);
                        const selected = value === date;
                        const today = value === localToday();
                        const inMonth =
                          dayValue.getMonth() === calendarMonth.getMonth();

                        const hasCases = surgeries.some(
                          (surgery) => surgery.date === value,
                        );

                        return (
                          <button
                            key={value}
                            type="button"
                            onClick={() => {
                              setDate(value);
                              setCalendarOpen(false);
                            }}
                            className={`relative flex h-8 items-center justify-center rounded-lg text-[8px] font-semibold transition ${
                              selected
                                ? "bg-violet-600 text-white shadow-sm"
                                : today
                                  ? "bg-violet-50 text-violet-700 ring-1 ring-violet-200"
                                  : inMonth
                                    ? "text-slate-600 hover:bg-violet-50 hover:text-violet-700"
                                    : "text-slate-300 hover:bg-slate-50"
                            }`}
                          >
                            {dayValue.getDate()}

                            {hasCases && !selected && (
                              <span className="absolute bottom-1 h-1 w-1 rounded-full bg-violet-400" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2.5">
                      <button
                        type="button"
                        onClick={() => {
                          const today = localToday();
                          setDate(today);
                          const parsed = new Date(`${today}T00:00:00`);
                          setCalendarMonth(
                            new Date(parsed.getFullYear(), parsed.getMonth(), 1),
                          );
                          setCalendarOpen(false);
                        }}
                        className="h-7 rounded-lg bg-violet-50 px-2.5 text-[8px] font-bold text-violet-700 transition hover:bg-violet-100"
                      >
                        Today
                      </button>

                      <span className="text-[7px] font-medium text-slate-400">
                        • = scheduled surgeries
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="ml-1 hidden 2xl:block">
              <p className="text-[8px] font-semibold text-slate-400">
                Planning2 · Daily OR
                room and status schedule
              </p>
            </div>
          </div>

          <div className="flex min-w-0 items-center justify-end gap-2">
            <div className="relative w-[230px]">
              <Search
                size={12}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                value={search}
                onChange={(
                  event,
                ) =>
                  setSearch(
                    event.target
                      .value,
                  )
                }
                placeholder="Search patient, case, procedure..."
                className="h-8 w-full rounded-lg border border-slate-200 bg-slate-50/60 pl-8 pr-2.5 text-[8.5px] font-medium text-slate-700 outline-none transition placeholder:text-slate-300 focus:border-violet-300 focus:bg-white focus:ring-2 focus:ring-violet-100"
              />
            </div>

            <div
              ref={
                doctorFilterRef
              }
              className="relative"
            >
              <button
                type="button"
                onClick={() =>
                  setDoctorFilterOpen(
                    (
                      current,
                    ) =>
                      !current,
                  )
                }
                className={`flex h-8 min-w-[132px] items-center justify-between gap-2 rounded-lg border px-2.5 text-[8.5px] font-semibold transition ${
                  doctor
                    ? "border-violet-200 bg-violet-50 text-violet-700"
                    : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                }`}
              >
                <div className="flex min-w-0 items-center gap-1.5">
                  <Filter
                    size={10}
                  />

                  <span className="truncate">
                    {doctor ||
                      "All Doctors"}
                  </span>
                </div>

                <ChevronDown
                  size={10}
                  className={`transition ${
                    doctorFilterOpen
                      ? "rotate-180"
                      : ""
                  }`}
                />
              </button>

              {doctorFilterOpen && (
                <div className="absolute right-0 top-[calc(100%+6px)] z-[120] w-[280px] rounded-xl border border-slate-200 bg-white p-3 shadow-[0_16px_36px_rgba(15,23,42,0.16)]">
                  <div className="mb-2 flex items-center justify-between">
                    <div>
                      <p className="text-[9px] font-semibold text-slate-700">
                        Doctor Filter
                      </p>

                      <p className="mt-0.5 text-[7.5px] text-slate-400">
                        Focus the
                        planning board.
                      </p>
                    </div>

                    {doctor && (
                      <button
                        type="button"
                        onClick={() => {
                          setDoctor("");
                          setDoctorFilterOpen(
                            false,
                          );
                        }}
                        className="text-[7.5px] font-semibold text-violet-600"
                      >
                        Clear
                      </button>
                    )}
                  </div>

                  <div className="flex max-h-[180px] flex-wrap gap-1.5 overflow-y-auto">
                    <button
                      type="button"
                      onClick={() => {
                        setDoctor("");
                        setDoctorFilterOpen(
                          false,
                        );
                      }}
                      className={`h-7 rounded-lg border px-2.5 text-[8px] font-semibold ${
                        !doctor
                          ? "border-violet-200 bg-violet-50 text-violet-700"
                          : "border-slate-200 bg-white text-slate-500"
                      }`}
                    >
                      All Doctors
                    </button>

                    {doctors.map(
                      (name) => (
                        <button
                          key={
                            name
                          }
                          type="button"
                          onClick={() => {
                            setDoctor(
                              name,
                            );

                            setDoctorFilterOpen(
                              false,
                            );
                          }}
                          className={`h-7 rounded-lg border px-2.5 text-[8px] font-semibold ${
                            doctor ===
                            name
                              ? "border-violet-200 bg-violet-50 text-violet-700"
                              : "border-slate-200 bg-white text-slate-500 hover:border-violet-200 hover:bg-violet-50/30"
                          }`}
                        >
                          {name}
                        </button>
                      ),
                    )}
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

        <div className="flex items-center justify-between px-3 py-1.5">
          <div className="flex items-center gap-3">
            <span className="text-[7px] font-bold uppercase tracking-wide text-slate-400">
              Legend
            </span>

            {STATUS_COLUMNS.map(
              (column) => {
                const tone =
                  getToneClasses(
                    column.tone,
                  );

                return (
                  <span
                    key={
                      column.key
                    }
                    className="flex items-center gap-1 text-[7.5px] font-semibold text-slate-500"
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${tone.dot}`}
                    />

                    {
                      column.label
                    }
                  </span>
                );
              },
            )}
          </div>

          <div className="flex items-center gap-2 text-[8px] text-slate-400">
            <span>
              Drag editable cards to another room in the same state. Drop in the same room to change time.
            </span>
          </div>
        </div>
      </header>

      {notice && (
        <div
          role="status"
          className="shrink-0 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-[9px] font-medium text-emerald-700"
        >
          {notice}
        </div>
      )}

      {/* PLANNING BOARD */}
      <section
        className={`flex min-h-0 flex-col overflow-hidden border border-slate-200 bg-white ${
          boardExpanded
            ? "fixed inset-2 z-[150] rounded-2xl shadow-[0_28px_80px_rgba(15,23,42,0.24)]"
            : "flex-1 rounded-2xl shadow-[0_1px_3px_rgba(15,23,42,0.025)]"
        }`}
      >
        {/* BOARD TOOLBAR */}
        <div data-page-toolbar="true"
          className={`flex shrink-0 items-center justify-between border-b border-slate-100 bg-white px-2.5 ${
            boardExpanded
              ? "h-8"
              : "h-9"
          }`}
        >
          <div className="flex min-w-0 items-center gap-2">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
              <Building2 size={11} />
            </div>

            <div className="min-w-0">
              <p className="truncate text-[9px] font-bold text-slate-700">
                OR Planning Board
              </p>

              <p className="truncate text-[7px] text-slate-400">
                Drag editable cards between rooms · click a card for detailed editing
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              setBoardExpanded(
                (current) => !current,
              )
            }
            className={`flex h-7 items-center gap-1.5 rounded-lg border px-2.5 text-[8px] font-semibold transition ${
              boardExpanded
                ? "border-violet-200 bg-violet-50 text-violet-700 hover:bg-violet-100"
                : "border-slate-200 bg-white text-slate-500 hover:border-violet-200 hover:bg-violet-50/50 hover:text-violet-700"
            }`}
            title={
              boardExpanded
                ? "Exit full table view"
                : "Expand table"
            }
          >
            {boardExpanded ? (
              <Minimize2 size={11} />
            ) : (
              <Maximize2 size={11} />
            )}

            {boardExpanded
              ? "Exit full view"
              : "Expand"}
          </button>
        </div>

        <div
          className={`min-h-0 flex-1 overflow-x-hidden ${
            boardExpanded
              ? "overflow-hidden"
              : "overflow-y-auto"
          }`}
        >
          <div
            className={`w-full min-w-0 ${
              boardExpanded
                ? "flex h-full min-h-0 flex-col"
                : ""
            }`}
          >
            {/* COLUMN HEADER */}
            <div data-responsive-grid="2"
              className={`sticky top-0 z-30 grid border-b border-slate-100 bg-slate-50/95 shadow-[0_4px_10px_rgba(15,23,42,0.025)] backdrop-blur ${
                boardExpanded
                  ? "grid-cols-[170px_repeat(4,minmax(0,1fr))]"
                  : "grid-cols-[136px_repeat(4,minmax(0,1fr))]"
              }`}
            >
              <div
                className={`sticky left-0 z-40 flex items-center border-r border-slate-100 bg-slate-50/95 backdrop-blur ${
                  boardExpanded
                    ? "h-[40px]"
                    : "h-[46px]"
                } ${
                  boardExpanded
                    ? "px-3"
                    : "px-2"
                }`}
              >
                <div>
                  <p className="text-[10px] font-bold text-slate-700">
                    Rooms
                  </p>

                  <p className="mt-0.5 text-[7.5px] text-slate-400">
                    OR sequence
                  </p>
                </div>
              </div>

              {STATUS_COLUMNS.map(
                (column) => {
                  const tone =
                    getToneClasses(
                      column.tone,
                    );

                  const count =
                    scopedCases.filter(
                      (surgery) =>
                        surgery.status ===
                        column.key,
                    ).length;

                  return (
                    <div
                      key={
                        column.key
                      }
                      className={`flex items-center border-r border-slate-100 last:border-r-0 ${
                        boardExpanded
                          ? "h-[40px]"
                          : "h-[46px]"
                      } ${
                        boardExpanded
                          ? "px-2"
                          : "px-1"
                      }`}
                    >
                      <div
                        className={`flex h-8 w-full items-center justify-between rounded-lg border ${
                          boardExpanded
                            ? "px-2.5"
                            : "px-2"
                        } ${tone.header}`}
                      >
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`h-2 w-2 rounded-full ${tone.dot}`}
                          />

                          <span className="text-[8px] font-bold uppercase tracking-wide">
                            {
                              column.label
                            }
                          </span>
                        </div>

                        <span className="rounded-full bg-white/80 px-1.5 py-0.5 text-[7px] font-bold">
                          {count}
                        </span>
                      </div>
                    </div>
                  );
                },
              )}
            </div>

            {/* ROOM ROWS */}
            {roomRows.length >
            0 ? (
              <div
                className={
                  boardExpanded
                    ? "grid min-h-0 flex-1 divide-y divide-slate-100"
                    : "divide-y divide-slate-100"
                }
                style={
                  boardExpanded
                    ? {
                        gridTemplateRows: `repeat(${roomRows.length}, minmax(0, 1fr))`,
                      }
                    : undefined
                }
              >
                {roomRows.map(
                  (room) => {
                    const roomCases =
                      scopedCases.filter(
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
                          !isFinished(
                            surgery,
                          ) &&
                          surgery.id !==
                            running?.id,
                      );

                    return (
                      <div data-responsive-grid="2"
                        key={
                          room
                        }
                        className={`grid ${
                          boardExpanded
                            ? "h-full min-h-0 grid-cols-[170px_repeat(4,minmax(0,1fr))]"
                            : "min-h-[132px] grid-cols-[136px_repeat(4,minmax(0,1fr))]"
                        }`}
                      >
                        {/* ROOM */}
                        <div
                          className={`sticky left-0 z-20 border-r border-slate-200 bg-slate-50/95 shadow-[5px_0_12px_rgba(15,23,42,0.035)] backdrop-blur ${
                            boardExpanded
                              ? "h-full min-h-0 px-2.5 py-1.5"
                              : "min-h-[132px] px-2 py-2"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className={`flex items-center justify-center rounded-lg border border-violet-100 bg-white text-violet-600 shadow-sm ${
                                boardExpanded
                                  ? "h-6 w-6"
                                  : "h-7 w-7"
                              }`}
                            >
                              <Building2
                                size={
                                  boardExpanded
                                    ? 11
                                    : 13
                                }
                              />
                            </div>

                            <div className="min-w-0">
                              <p className="truncate text-[10.5px] font-bold text-slate-800">
                                {room}
                              </p>

                              <div className="mt-0.5 flex items-center gap-1">
                                <span
                                  className={`h-1.5 w-1.5 rounded-full ${
                                    running
                                      ? "bg-violet-500"
                                      : next
                                        ? "bg-emerald-500"
                                        : "bg-slate-300"
                                  }`}
                                />

                                <span className="text-[7.5px] font-semibold text-slate-400">
                                  {running
                                    ? "In use"
                                    : next
                                      ? "Scheduled"
                                      : "Available"}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div
                            className={`${
                              boardExpanded
                                ? "mt-1 space-y-1"
                                : "mt-1.5 space-y-1.5"
                            }`}
                          >
                            <div
                              className={`rounded-lg border border-slate-100 bg-white px-2 ${
                                boardExpanded
                                  ? "py-1"
                                  : "py-1.5"
                              }`}
                            >
                              <p className="text-[6.5px] font-bold uppercase tracking-wide text-slate-400">
                                Current
                              </p>

                              <p className="mt-0.5 truncate text-[7.5px] font-semibold text-slate-600">
                                {running
                                  ? `${running.time} · ${running.patientName}`
                                  : "No active case"}
                              </p>
                            </div>

                            <div
                              className={`rounded-lg border border-slate-100 bg-white px-2 ${
                                boardExpanded
                                  ? "py-1"
                                  : "py-1.5"
                              }`}
                            >
                              <p className="text-[6.5px] font-bold uppercase tracking-wide text-slate-400">
                                Next
                              </p>

                              <p className="mt-0.5 truncate text-[7.5px] font-semibold text-slate-600">
                                {next
                                  ? `${next.time} · ${next.patientName}`
                                  : "No next case"}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* STATUS CELLS */}
                        {STATUS_COLUMNS.map(
                          (
                            column,
                          ) => {
                            const items =
                              roomCases.filter(
                                (
                                  surgery,
                                ) =>
                                  surgery.status ===
                                  column.key,
                              );

                            return (
                              <StatusCell
                                key={`${room}-${column.key}`}
                                items={
                                  items
                                }
                                tone={
                                  column.tone
                                }
                                room={
                                  room
                                }
                                status={
                                  column.key
                                }
                                scopedCases={
                                  scopedCases
                                }
                                draggedSurgery={
                                  draggedSurgery
                                }
                                isDragOver={
                                  dragOverCell ===
                                  `${room}:${column.key}`
                                }
                                onDragStart={(
                                  surgery,
                                ) => {
                                  setDraggedSurgeryId(
                                    surgery.id,
                                  );
                                }}
                                onDragEnd={() => {
                                  setDraggedSurgeryId(
                                    null,
                                  );
                                  setDragOverCell(
                                    null,
                                  );
                                }}
                                onDragOver={() =>
                                  setDragOverCell(
                                    `${room}:${column.key}`,
                                  )
                                }
                                onDragLeave={() =>
                                  setDragOverCell(
                                    null,
                                  )
                                }
                                onDrop={(
                                  surgery,
                                ) => {
                                  setDraggedSurgeryId(
                                    null,
                                  );
                                  setDragOverCell(
                                    null,
                                  );
                                  setPendingMove(
                                    {
                                      surgery,
                                      targetRoom:
                                        room,
                                    },
                                  );
                                }}
                                onEdit={
                                  setEditing
                                }
                                expanded={
                                  boardExpanded
                                }
                              />
                            );
                          },
                        )}
                      </div>
                    );
                  },
                )}
              </div>
            ) : (
              <div className="flex h-[280px] items-center justify-center">
                <div className="text-center">
                  <CalendarDays
                    size={20}
                    className="mx-auto text-slate-300"
                  />

                  <p className="mt-2 text-[10px] font-semibold text-slate-600">
                    No surgeries
                    found
                  </p>

                  <p className="mt-1 text-[8px] text-slate-400">
                    Change the
                    date, search or
                    doctor filter.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {pendingMove && (
        <MoveConfirmation
          key={`${pendingMove.surgery.id}-${pendingMove.targetRoom}`}
          surgery={
            surgeries.find(
              (surgery) =>
                surgery.id ===
                pendingMove.surgery.id,
            ) ??
            pendingMove.surgery
          }
          targetRoom={
            pendingMove.targetRoom
          }
          surgeries={
            surgeries
          }
          onCancel={() =>
            setPendingMove(
              null,
            )
          }
          onConfirm={(
            updates,
          ) => {
            const current =
              surgeries.find(
                (surgery) =>
                  surgery.id ===
                  pendingMove.surgery
                    .id,
              ) ??
              pendingMove.surgery;

            const roomChanged =
              current.room !==
              updates.room;

            const timeChanged =
              current.time !==
              updates.time;

            updateSurgery(
              current.id,
              updates,
            );

            setNotice(
              roomChanged &&
                timeChanged
                ? `${current.patientName} moved from ${current.room} to ${updates.room} and rescheduled from ${current.time} to ${updates.time}.`
                : roomChanged
                  ? `${current.patientName} moved from ${current.room} to ${updates.room}.`
                  : `${current.patientName} rescheduled from ${current.time} to ${updates.time}.`,
            );

            setPendingMove(
              null,
            );
          }}
        />
      )}

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
          surgeries={
            surgeries
          }
          rooms={rooms}
          onClose={() =>
            setEditing(null)
          }
          onSave={(
            updates,
          ) => {
            updateSurgery(
              editing.id,
              updates,
            );

            setNotice(
              `Plan updated for ${editing.patientName}. Planning2 refreshed.`,
            );

            setEditing(null);
          }}
        />
      )}
    </div>
  );
}
