import { Activity,AlertTriangle,ArrowDown,ArrowRight,ArrowUp,ArrowUpDown,Building2,CheckCircle2,ChevronDown,ChevronRight,CreditCard,FileText,Filter,HeartPulse,Search,ShieldCheck,Stethoscope,UserCheck } from "lucide-react";
import { PatientStartGuide } from "../components/surgery/PatientStartGuide";
import { DashboardDatePicker,MetricCard,Pagination,PostOpStat,ProcedureCell,ReadinessRow,RoomBoardTile,StatusBadge } from "../features/workspaces/Dashboard/components";
import { STATUS_STYLES,TODAY } from "../features/workspaces/Dashboard/config";
import { useDashboardWorkspace } from '../features/workspaces/Dashboard/hooks/useDashboardWorkspace';
import { type Period,type SortKey } from "../features/workspaces/Dashboard/types";


/* ==========================================================================
   PAGE
   ========================================================================== */

export default function Dashboard() {
  const { todaySurgeries, navigate, counts, postOpAttentionCount, roomBoard, searchQuery, setSearchQuery, setPage, setFilterOpen, selectedDoctors, selectedStatuses, period, selectedDate, filterOpen, clearTableFilters, doctorOptions, toggleDoctorFilter, availableStatuses, toggleStatusFilter, setPeriod, setSelectedDate, handleSort, sortKey, sortDirection, visibleCases, sortedCases, safePage, PAGE_SIZE, totalPages, operativeReportRate, dischargeInstructionsRate, dischargedRate, financialRate, preOpRate, anesthesiaRate } = useDashboardWorkspace();

return (
    <div data-workspace-page="Dashboard" className="flex h-[calc(100vh-58px)] min-h-0 flex-col gap-2 overflow-hidden bg-slate-50/60 p-2">
      <PatientStartGuide />
      {/* ============================================================ */}
      {/* KEY SURGICAL METRICS                                         */}
      {/* ============================================================ */}

      <section data-responsive-grid="4" className="grid shrink-0 grid-cols-4 gap-2">
        <MetricCard
          label="Today's Schedule"
          value={todaySurgeries.length}
          hint="Scheduled procedures"
          icon={<Activity size={14} />}
          tone="slate"
          onClick={() =>
            navigate("/schedule")
          }
        />

        <MetricCard
          label="Operating Now"
          value={counts.inProgress}
          hint="Live OR cases"
          icon={<Activity size={14} />}
          tone="violet"
          onClick={() =>
            navigate("/surgery")
          }
        />

        <MetricCard
          label="Ready for OR"
          value={counts.ready}
          hint="Cleared to proceed"
          icon={<CheckCircle2 size={14} />}
          tone="blue"
          onClick={() =>
            navigate("/surgery")
          }
        />

        <MetricCard
          label="Needs Attention"
          value={postOpAttentionCount}
          hint="Post-Op follow-through"
          icon={<AlertTriangle size={14} />}
          tone={
            postOpAttentionCount > 0
              ? "cyan"
              : "teal"
          }
          onClick={() =>
            navigate("/post-op")
          }
        />
      </section>

      {/* ============================================================ */}
      {/* OPERATING ROOM BOARD                                         */}
      {/* ============================================================ */}

      <section className="relative z-[140] shrink-0 overflow-visible rounded-2xl border border-slate-200/90 bg-white shadow-[0_2px_10px_rgba(15,23,42,0.04)]">
        <div data-page-toolbar="true" className="flex h-[38px] items-center justify-between border-b border-slate-200 px-3.5">
          <div className="flex items-center gap-2">
            <Building2
              size={12}
              className="text-violet-500"
            />

            <div>
              <h2 className="text-[10.5px] font-bold text-slate-700">
                Operating Room Board
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              navigate("/schedule")
            }
            className="inline-flex items-center gap-1 text-[8px] font-semibold text-violet-600 transition hover:text-violet-700"
          >
            Open schedule
            <ArrowRight size={9} />
          </button>
        </div>

        <div data-responsive-grid="4" className="grid grid-cols-4 divide-x divide-slate-200">
          {roomBoard.map((room, index) => (
            <RoomBoardTile key={room.room} room={room} alignRight={index >= 2} onOpen={(id) => navigate(`/surgery/${id}`)} />
          ))}
          {roomBoard.length === 0 && <p className="col-span-4 py-6 text-center text-xs text-slate-400">No operating rooms assigned today</p>}
        </div>
      </section>

      {/* ============================================================ */}
      {/* MAIN DASHBOARD                                               */}
      {/* ============================================================ */}

      <div data-responsive-grid="2" className="grid min-h-0 flex-1 grid-cols-[minmax(0,1.9fr)_minmax(280px,0.72fr)] gap-2">
        {/* ---------------------------------------------------------- */}
        {/* TODAY'S OPERATING LIST                                     */}
        {/* ---------------------------------------------------------- */}

        <div className="flex min-h-0 min-w-0 flex-col gap-2">
          <section className="relative flex shrink-0 flex-col overflow-visible rounded-xl border border-slate-200 bg-white">
          <div className="relative z-[80] shrink-0 overflow-visible border-b border-slate-100 bg-white px-3 py-2.5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-[11px] font-semibold text-slate-700">
                  Today's Operation List
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search
                    size={12}
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    value={searchQuery}
                    onChange={(event) => {
                      setSearchQuery(
                        event.target.value,
                      );
                      setPage(1);
                    }}
                    placeholder="Search patient, case or procedure..."
                    className="h-7 w-[clamp(130px,17vw,270px)] rounded-lg border border-slate-200 bg-slate-50 pl-8 pr-3 text-[10px] text-slate-600 outline-none transition placeholder:text-[10px] placeholder:text-slate-400 focus:border-violet-300 focus:bg-white"
                  />
                </div>

                <div className="relative z-[90]">
                  <button
                    type="button"
                    onClick={() =>
                      setFilterOpen(
                        (value) => !value,
                      )
                    }
                    className={`flex h-7 items-center gap-1.5 rounded-md border px-2.5 text-[10px] font-semibold transition ${
                      selectedDoctors.length > 0 ||
                      selectedStatuses.length > 0 ||
                      period !== "Month" ||
                      selectedDate !== TODAY
                        ? "border-violet-200 bg-violet-50 text-violet-600"
                        : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                    }`}
                  >
                    <Filter size={11} />
                    Filters
                    <ChevronDown size={10} />
                  </button>

                  {filterOpen && (
                    <div className="absolute right-0 top-[calc(100%+6px)] z-[120] w-[360px] overflow-visible rounded-xl border border-slate-200 bg-white p-3 shadow-[0_16px_40px_rgba(15,23,42,0.18)]">
                      <div className="mb-2.5 flex items-center justify-between">
                        <div>
                          <p className="text-[9px] font-semibold text-slate-700">
                            Operation List Filters
                          </p>

                          <p className="mt-0.5 text-[8px] text-slate-400">
                            Filter by doctor, status and date range
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={clearTableFilters}
                          className="text-[8px] font-semibold text-violet-600 hover:underline"
                        >
                          Clear all
                        </button>
                      </div>

                      <div>
                        <p className="mb-1.5 text-[8px] font-semibold uppercase tracking-wide text-slate-400">
                          Doctor
                        </p>

                        <div className="flex flex-wrap gap-1.5">
                          {doctorOptions.map(
                            (doctor) => {
                              const active =
                                selectedDoctors.includes(
                                  doctor,
                                );

                              return (
                                <button
                                  key={doctor}
                                  type="button"
                                  onClick={() =>
                                    toggleDoctorFilter(
                                      doctor,
                                    )
                                  }
                                  className={`rounded-md border px-2 py-1 !text-[10px] font-semibold transition ${
                                    active
                                      ? "border-violet-200 bg-violet-50 text-violet-700"
                                      : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                                  }`}
                                >
                                  {doctor}
                                </button>
                              );
                            },
                          )}
                        </div>
                      </div>

                      <div className="mt-2.5">
                        <p className="mb-1.5 text-[8px] font-semibold uppercase tracking-wide text-slate-400">
                          Status
                        </p>

                        <div className="flex flex-wrap gap-1.5">
                          {availableStatuses.map(
                            (status) => {
                              const active =
                                selectedStatuses.includes(
                                  status,
                                );

                              return (
                                <button
                                  key={status}
                                  type="button"
                                  onClick={() =>
                                    toggleStatusFilter(
                                      status,
                                    )
                                  }
                                  className={`rounded-md border px-2 py-1 !text-[10px] font-semibold transition ${
                                    active
                                      ? "border-violet-200 bg-violet-50 text-violet-700"
                                      : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                                  }`}
                                >
                                  {status ===
                                  "In Progress"
                                    ? "In Surgery"
                                    : status}
                                </button>
                              );
                            },
                          )}
                        </div>
                      </div>

                      <div className="mt-2.5">
                        <p className="mb-1.5 text-[8px] font-semibold uppercase tracking-wide text-slate-400">
                          Date
                        </p>

                        <div data-responsive-grid="2" className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-2">
                          <div className="flex h-8 items-center rounded-lg border border-slate-200 bg-slate-50 p-0.5">
                            {(
                              [
                                "Day",
                                "Week",
                                "Month",
                              ] as Period[]
                            ).map((item) => (
                              <button
                                key={item}
                                type="button"
                                onClick={() => {
                                  setPeriod(item);
                                  setPage(1);
                                }}
                                className={`h-7 rounded-[5px] px-2 !text-[10px] font-semibold transition ${
                                  period === item
                                    ? "bg-white text-violet-600 shadow-sm"
                                    : "text-slate-500"
                                }`}
                              >
                                {item}
                              </button>
                            ))}
                          </div>

                          <DashboardDatePicker
                            value={selectedDate}
                            onChange={(value) => {
                              setSelectedDate(value);
                              setPage(1);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div data-responsive-table-header="true" className="relative z-0 grid shrink-0 grid-cols-[52px_minmax(0,1.5fr)_minmax(0,1.2fr)_minmax(0,0.9fr)_minmax(0,1.05fr)_62px_92px] gap-x-3 items-center border-b border-slate-100 bg-slate-50/80 px-3.5 py-2.5">
            {(
              [
                ["time", "Time"],
                ["patient", "Patient"],
                ["procedure", "Procedure"],
                ["notes", "Notes"],
                ["surgeon", "Surgeon"],
                ["room", "Room"],
                ["status", "Status"],
              ] as Array<
                [SortKey, string]
              >
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() =>
                  handleSort(key)
                }
                className="group flex w-fit items-center gap-1 !text-[11px] font-semibold text-slate-500 transition hover:text-slate-800"
              >
                <span>{label}</span>

                {sortKey === key ? (
                  sortDirection ===
                  "asc" ? (
                    <ArrowUp
                      size={10}
                      className="text-violet-600"
                    />
                  ) : (
                    <ArrowDown
                      size={10}
                      className="text-violet-600"
                    />
                  )
                ) : (
                  <ArrowUpDown
                    size={9}
                    className="text-slate-300 transition group-hover:text-slate-400"
                  />
                )}
              </button>
            ))}
          </div>

          <div className="relative z-0 divide-y divide-slate-100/90">
            {visibleCases.length > 0 ? (
              visibleCases.map(
                (surgery) => {
                  const style =
                    STATUS_STYLES[
                      surgery.status
                    ] ??
                    STATUS_STYLES.Booked;

                  return (
                    <button data-responsive-table-row="true"
                      key={surgery.id}
                      type="button"
                      onClick={() =>
                        navigate(
                          `/surgery/${surgery.id}`,
                        )
                      }
                      className="group relative grid min-h-[64px] w-full grid-cols-[52px_minmax(0,1.5fr)_minmax(0,1.2fr)_minmax(0,0.9fr)_minmax(0,1.05fr)_62px_92px] gap-x-3 items-center px-3.5 py-2.5 text-left transition hover:bg-slate-50/80"
                    >
                      <span
                        className={`absolute bottom-2 left-0 top-2 w-[3px] rounded-r-full ${style.dot}`}
                      />

                      <div data-cell-label="Time">
                        <p className="text-[11px] font-bold text-slate-700">
                          {surgery.time}
                        </p>

                        <p className="mt-0.5 text-[9px] font-medium text-slate-400">
                          {surgery.priority}
                        </p>
                      </div>

                      <div data-cell-label="Patient" className="flex min-w-0 items-center gap-2">

                        <div className="min-w-0">
                          <p className="whitespace-normal break-words pr-2 text-[11px] font-semibold text-slate-700">
                            {surgery.patientName}
                          </p>

                          <p className="mt-0.5 truncate text-[9px] text-slate-400">
                            MRN: {surgery.mrn || "Not recorded"}
                          </p>
                        </div>
                      </div>

                      <ProcedureCell
                        surgery={surgery}
                      />

                      <p data-cell-label="Notes" className="line-clamp-2 break-words pr-2 text-[10.5px] leading-4 text-slate-500">
                        {surgery.notes || surgery.surgeonNotes || "No notes"}
                      </p>
                      <div data-cell-label="Surgeon" className="flex min-w-0 items-center gap-1.5">
                        <Stethoscope
                          size={9.5}
                          className="shrink-0 text-slate-400"
                        />

                        <span className="truncate text-[10.5px] font-medium text-slate-600">
                          {surgery.doctor}
                        </span>
                      </div>

                      <div data-cell-label="Room" className="flex items-center gap-1">
                        <Building2
                          size={9}
                          className="shrink-0 text-slate-400"
                        />

                        <span className="truncate text-[10px] font-medium text-slate-600">
                          {surgery.room}
                        </span>
                      </div>

                      <StatusBadge
                        status={surgery.status}
                      />
                    </button>
                  );
                },
              )
            ) : (
              <div className="flex min-h-[180px] items-center justify-center">
                <div className="text-center">
                  <CheckCircle2
                    size={18}
                    className="mx-auto text-slate-300"
                  />

                  <p className="mt-2 text-[10px] font-semibold text-slate-500">
                    {searchQuery ||
                    selectedDoctors.length > 0 ||
                    selectedStatuses.length > 0
                      ? "No matching cases"
                      : "No cases scheduled"}
                  </p>

                  {(searchQuery ||
                    selectedDoctors.length > 0 ||
                    selectedStatuses.length > 0) && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery("");
                        clearTableFilters();
                      }}
                      className="mt-1.5 text-[9px] font-semibold text-violet-600 hover:text-violet-700"
                    >
                      Clear search & filters
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>

          {sortedCases.length > 0 && (
            <div className="flex h-10 shrink-0 items-center justify-between px-1">
              <p className="text-[10.5px] font-medium text-slate-400">
                Showing{" "}
                <span className="font-semibold text-slate-600">
                  {(safePage - 1) * PAGE_SIZE + 1}–{Math.min(
                    safePage * PAGE_SIZE,
                    sortedCases.length,
                  )}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-slate-600">
                  {sortedCases.length}
                </span>
              </p>

              <Pagination
                page={safePage}
                totalPages={totalPages}
                onChange={setPage}
              />
            </div>
          )}
        </div>

        {/* ---------------------------------------------------------- */}
        {/* RIGHT SIDE                                                 */}
        {/* ---------------------------------------------------------- */}

        <div className="grid min-h-0 grid-rows-[minmax(0,1fr)_auto] gap-2">
          {/* POST-OP STATUS */}

          <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <div data-page-toolbar="true" className="flex h-[34px] items-center justify-between border-b border-slate-100 px-3">
              <div className="flex items-center gap-2">
                <Stethoscope
                  size={11}
                  className="text-cyan-500"
                />

                <h2 className="text-[10.5px] font-bold text-slate-700">
                  Post-Op Status
                </h2>
              </div>

            </div>

            <div data-responsive-grid="3" className="grid grid-cols-3 divide-x divide-slate-100">
              <PostOpStat
                label="Reports"
                value={`${operativeReportRate}%`}
                hint="Completed"
                icon={<FileText size={11} />}
                tone="cyan"
                onClick={() =>
                  navigate("/post-op")
                }
              />

              <PostOpStat
                label="Instructions"
                value={`${dischargeInstructionsRate}%`}
                hint="Prepared"
                icon={<ShieldCheck size={11} />}
                tone="teal"
                onClick={() =>
                  navigate("/post-op")
                }
              />

              <PostOpStat
                label="Discharged"
                value={`${dischargedRate}%`}
                hint="Completed"
                icon={<CheckCircle2 size={11} />}
                tone="slate"
                onClick={() =>
                  navigate("/post-op")
                }
              />
            </div>

            <button
              type="button"
              onClick={() =>
                navigate("/post-op")
              }
              className="flex h-7 w-full items-center justify-between border-t border-slate-100 bg-slate-50/50 px-3 text-left transition hover:bg-cyan-50/40"
            >
              <div className="flex items-center gap-2">
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    postOpAttentionCount > 0
                      ? "bg-amber-500"
                      : "bg-teal-500"
                  }`}
                />

                <span className="text-[8.5px] font-semibold text-slate-600">
                  {postOpAttentionCount > 0
                    ? `${postOpAttentionCount} case${
                        postOpAttentionCount === 1
                          ? ""
                          : "s"
                      } still need follow-up`
                    : "All Post-Op cases complete"}
                </span>
              </div>

              <ChevronRight
                size={9}
                className="text-slate-300"
              />
            </button>
          </section>

          {/* TODAY'S READINESS */}

          <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <div data-page-toolbar="true" className="flex h-[38px] items-center justify-between border-b border-slate-100 px-3">
              <div className="flex items-center gap-2">
                <ShieldCheck
                  size={11}
                  className="text-blue-500"
                />

                <h2 className="text-[10px] font-bold text-slate-700">
                  Today's Readiness
                </h2>
              </div>

              <span className="text-[7.5px] font-medium text-slate-400">
                Required before OR
              </span>
            </div>

            <div className="space-y-2.5 px-3 py-2.5">
              <ReadinessRow
                label="Financial clearance"
                value={financialRate}
                icon={<CreditCard size={10} />}
                tone="indigo"
                onClick={() =>
                  navigate("/cashier")
                }
              />

              <ReadinessRow
                label="Pre-Op completed"
                value={preOpRate}
                icon={<UserCheck size={10} />}
                tone="blue"
                onClick={() =>
                  navigate("/pre-op")
                }
              />

              <ReadinessRow
                label="Anesthesia confirmed"
                value={anesthesiaRate}
                icon={<HeartPulse size={10} />}
                tone="violet"
                onClick={() =>
                  navigate("/pre-op")
                }
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
