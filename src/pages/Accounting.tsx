import { CheckCircle2,ChevronDown,ChevronLeft,ChevronRight,CircleDollarSign,CreditCard,Filter,Search,Stethoscope,UserRound,WalletCards } from "lucide-react";
import { WorkspaceNotification } from '../components/layout/WorkspaceNotification';
import { CashierCaseWorkspace } from "../features/accounting/CashierCaseWorkspace";
import { AccountingStatCard,FilterPill,FilterSection,ModernDatePicker,PaymentActionButton,PaymentStatus,ReceiptActionButton,SortableHeader } from "../features/workspaces/Accounting/components";
import { useAccountingWorkspace } from '../features/workspaces/Accounting/hooks/useAccountingWorkspace';
import { type Period } from "../features/workspaces/Accounting/types";
import { formatDateShort,getInitials,getPatientAge,getPatientGender,getPatientMrn,getSurgeryProcedures } from "../features/workspaces/Accounting/utils";


export default function Accounting() {
  const { directCase, amount, setAmount, submitPayment, navigate, toast, setToast, paidCount, pendingCount, partialCount, arrivedCount, search, setSearch, filterRef, setFilterOpen, filterOpen, activeFilterCount, clearFilters, doctors, selectedDoctors, toggleDoctor, paymentStatuses, selectedPaymentStatuses, togglePaymentStatus, setPeriod, period, selectedDate, setSelectedDate, setPage, sortKey, sortDirection, handleSort, rowsContainerRef, visibleRows, selectedId, highlightedRowId, openPayment, openReceipt, sorted, page, pageSize, totalPages } = useAccountingWorkspace();

if (directCase)
  return (
    <>
      <CashierCaseWorkspace
        surgery={directCase}
        amount={amount}
        setAmount={setAmount}
        onPay={submitPayment}
        onBack={() => {
          navigate("/accounting", {
            replace: true,
            state: null,
          });
        }}
      />

      <WorkspaceNotification notice={toast} onClose={() => setToast(null)} />
    </>
  );

  return (
    <div data-workspace-page="Accounting" className="flex h-full min-h-0 flex-col bg-slate-50">
      {/* ================================================================ */}
      {/* SUMMARY CARDS                                                    */}
      {/* ================================================================ */}

      <div className="shrink-0 px-2 pt-2">
        <div data-responsive-grid="4" className="grid grid-cols-4 gap-2">
          <AccountingStatCard
            label="Paid"
            value={paidCount}
            icon={
              <CheckCircle2
                size={15}
              />
            }
            tone="indigo"
          />

          <AccountingStatCard
            label="Pending"
            value={pendingCount}
            icon={
              <WalletCards
                size={15}
              />
            }
            tone="amber"
          />

          <AccountingStatCard
            label="Partial"
            value={partialCount}
            icon={
              <CreditCard
                size={15}
              />
            }
            tone="violet"
          />

          <AccountingStatCard
            label="Arrived Patients"
            value={arrivedCount}
            icon={
              <UserRound
                size={15}
              />
            }
            tone="rose"
          />
        </div>
      </div>

      {/* ================================================================ */}
      {/* TABLE                                                            */}
      {/* ================================================================ */}

      <div className="flex min-h-0 flex-1 p-2">
        <section className="flex min-h-0 flex-1 flex-col overflow-visible rounded-xl border border-slate-200 bg-white">
          {/* TABLE HEADER */}

          <div data-page-toolbar="true" className="flex min-h-[58px] shrink-0 items-center justify-between gap-3 border-b border-slate-100 px-4 py-2.5">
            <div>
              <h2 className="text-[12px] font-semibold text-slate-800">
                Surgery Payments
              </h2>

              <p className="mt-0.5 text-[9px] text-slate-400">
                Review balances and process patient payments
              </p>
            </div>

            <div className="flex items-center gap-2">
              {/* SEARCH */}

              <div className="relative w-[260px]">
                <Search
                  size={13}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target.value,
                    )
                  }
                  placeholder="Search name, MRN or procedure..."
                  className="h-7 w-full rounded-lg border border-slate-200 bg-slate-50 pl-8 pr-3 !text-[11px] text-slate-600 outline-none transition placeholder:text-slate-400 focus:border-indigo-300 focus:bg-white focus:ring-2 focus:ring-indigo-50"
                />
              </div>

              {/* FILTER */}

              <div ref={filterRef} className="relative">
                <button
                  type="button"
                  onClick={() =>
                    setFilterOpen(
                      (current) =>
                        !current,
                    )
                  }
                  className={`inline-flex h-7 items-center gap-1.5 rounded-lg border px-2.5 !text-[11px] font-semibold transition ${
                    filterOpen ||
                    activeFilterCount > 0
                      ? "border-indigo-200 bg-indigo-50 text-indigo-700"
                      : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                  }`}
                >
                  <Filter
                    size={12}
                  />

                  Filters

                  {activeFilterCount >
                    0 && (
                    <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-indigo-600 px-1 text-[7px] font-bold text-white">
                      {
                        activeFilterCount
                      }
                    </span>
                  )}

                  <ChevronDown
                    size={11}
                  />
                </button>

                {filterOpen && (
                  <div className="absolute right-0 top-[calc(100%+6px)] z-30 w-[350px] rounded-xl border border-slate-200 bg-white p-3 shadow-[0_12px_32px_rgba(15,23,42,0.14)]">
                    <div className="mb-3 flex items-center justify-between">
                      <div>
                        <p className="!text-[12px] font-semibold text-slate-700">
                          Table Filters
                        </p>

                        <p className="mt-0.5 !text-[10px] text-slate-400">
                          Refine the cashier queue
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={
                          clearFilters
                        }
                        className="text-[8px] font-semibold text-indigo-600 hover:text-indigo-700"
                      >
                        Clear all
                      </button>
                    </div>

                    <FilterSection
                      label="Doctor"
                    >
                      <div className="flex flex-wrap gap-1.5">
                        {doctors.map(
                          (doctor) => (
                            <FilterPill
                              key={
                                doctor
                              }
                              label={
                                doctor
                              }
                              active={selectedDoctors.includes(
                                doctor,
                              )}
                              onClick={() =>
                                toggleDoctor(
                                  doctor,
                                )
                              }
                            />
                          ),
                        )}
                      </div>
                    </FilterSection>

                    <FilterSection
                      label="Payment Status"
                    >
                      <div className="flex flex-wrap gap-1.5">
                        {paymentStatuses.map(
                          (status) => (
                            <FilterPill
                              key={
                                status
                              }
                              label={
                                status
                              }
                              active={selectedPaymentStatuses.includes(
                                status,
                              )}
                              onClick={() =>
                                togglePaymentStatus(
                                  status,
                                )
                              }
                            />
                          ),
                        )}
                      </div>
                    </FilterSection>

                    <FilterSection
                      label="Surgery Date"
                    >
                      <div data-responsive-grid="2" className="grid grid-cols-[1fr_135px] gap-2">
                        <div className="flex h-7 items-center rounded-lg border border-slate-200 bg-slate-50 p-0.5">
                          {(
                            [
                              "Day",
                              "Week",
                              "Month",
                            ] as Period[]
                          ).map(
                            (item) => (
                              <button
                                key={
                                  item
                                }
                                type="button"
                                onClick={() =>
                                  setPeriod(
                                    item,
                                  )
                                }
                                className={`h-6 flex-1 rounded-md !text-[10px] font-semibold transition ${
                                  period ===
                                  item
                                    ? "bg-white text-indigo-600 shadow-sm"
                                    : "text-slate-400 hover:text-slate-600"
                                }`}
                              >
                                {
                                  item
                                }
                              </button>
                            ),
                          )}
                        </div>

                        <ModernDatePicker
                          value={selectedDate}
                          onChange={(value) => {
                            setSelectedDate(value);
                            setPage(0);
                          }}
                        />
                      </div>
                    </FilterSection>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* COLUMN HEADERS */}

          <div data-responsive-table-header="true" className="grid shrink-0 grid-cols-[minmax(145px,1.15fr)_84px_88px_minmax(140px,1fr)_125px_72px_78px_82px_94px_92px] items-center border-b border-slate-100 bg-slate-50/80 px-3 py-1.5">
            <SortableHeader
              label="Patient"
              sortKey="patient"
              activeKey={sortKey}
              direction={sortDirection}
              onSort={handleSort}
            />

            <SortableHeader
              label="Case #"
              sortKey="case"
              activeKey={sortKey}
              direction={sortDirection}
              onSort={handleSort}
            />

            <SortableHeader
              label="MRN"
              sortKey="mrn"
              activeKey={sortKey}
              direction={sortDirection}
              onSort={handleSort}
            />

            <SortableHeader
              label="Procedure"
              sortKey="procedures"
              activeKey={sortKey}
              direction={sortDirection}
              onSort={handleSort}
            />

            <SortableHeader
              label="Doctor"
              sortKey="doctor"
              activeKey={sortKey}
              direction={sortDirection}
              onSort={handleSort}
            />

            <SortableHeader
              label="Date"
              sortKey="date"
              activeKey={sortKey}
              direction={sortDirection}
              onSort={handleSort}
            />

            <SortableHeader
              label="Total"
              sortKey="total"
              activeKey={sortKey}
              direction={sortDirection}
              onSort={handleSort}
            />

            <SortableHeader
              label="Paid"
              sortKey="paid"
              activeKey={sortKey}
              direction={sortDirection}
              onSort={handleSort}
            />

            <SortableHeader
              label="Status"
              sortKey="payment"
              activeKey={sortKey}
              direction={sortDirection}
              onSort={handleSort}
            />

            <div className="!text-[10px] uppercase tracking-wide text-slate-400">
              Action
            </div>
          </div>

          {/* ROWS - Dashboard / Reception visual style */}

          <div data-table-body="true"
            ref={rowsContainerRef}
            className="min-h-0 flex-1 divide-y divide-slate-100 overflow-visible bg-white"
          >
            {visibleRows.length === 0 ? (
              <div className="flex h-full items-center justify-center">
                <div className="text-center">
                  <CircleDollarSign
                    size={21}
                    className="mx-auto text-slate-300"
                  />

                  <p className="mt-2 text-[10px] font-semibold text-slate-600">
                    No payment records found
                  </p>

                  <p className="mt-1 text-[8px] text-slate-400">
                    Try changing the search or filters.
                  </p>
                </div>
              </div>
            ) : (
              visibleRows.map((surgery, rowIndex) => {
                const remaining = Math.max(
                  0,
                  surgery.cost - surgery.paidAmount,
                );

                const hasArrived = Boolean(
                  surgery.arrivedAt,
                );

                const selectedRow =
                  surgery.id === selectedId;

                const highlightedRow =
                  surgery.id === highlightedRowId;

                const procedures =
                  getSurgeryProcedures(surgery);

                const primaryProcedure =
                  procedures[0] ?? {
                    name: "Procedure",
                    site: undefined,
                  };

                const extraProcedures = Math.max(
                  procedures.length - 1,
                  0,
                );

                return (
                  <div data-responsive-table-row="true"
                    key={surgery.id}
                    className={`group relative grid min-h-[48px] grid-cols-[minmax(145px,1.15fr)_84px_88px_minmax(140px,1fr)_125px_72px_78px_82px_94px_92px] items-center px-3 py-1.5 transition-all duration-500 ${
                      highlightedRow
                        ? "z-10 bg-indigo-100/80 shadow-[inset_0_0_0_1px_rgba(99,102,241,0.35),0_0_20px_rgba(99,102,241,0.24)]"
                        : selectedRow
                          ? "bg-indigo-50/45"
                          : "bg-white hover:bg-slate-50/70"
                    }`}
                  >
                    <span 
                      className={`absolute bottom-1.5 left-0 top-1.5 w-[3px] rounded-r-full ${
                        highlightedRow
                          ? "bg-indigo-600 shadow-[0_0_10px_rgba(79,70,229,0.75)]"
                          : "bg-indigo-500"
                      }`}
                    />

                    {highlightedRow && (
                      <span className="pointer-events-none absolute inset-0 animate-pulse ring-2 ring-inset ring-indigo-300/70" />
                    )}

                    {/* PATIENT */}

                    <div data-cell-label="Patient"  className="flex min-w-0 items-center gap-2">
                      <div
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[9px] font-bold ${
                          selectedRow || highlightedRow
                            ? "bg-indigo-600 text-white"
                            : "bg-indigo-50 text-indigo-600"
                        }`}
                      >
                        {getInitials(
                          surgery.patientName,
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="flex min-w-0 items-center gap-1.5">
                          <span className="truncate text-[10px] font-semibold text-slate-800">
                            {surgery.patientName}
                          </span>

                          {hasArrived && (
                            <span className="shrink-0 rounded-full bg-emerald-50 px-1.5 py-0.5 text-[7px] font-semibold text-emerald-600">
                              Arrived
                            </span>
                          )}
                        </div>

                        <p className="mt-0.5 truncate text-[8.5px] font-medium text-slate-400">
                          {getPatientAge(surgery)} yrs · {getPatientGender(surgery)}
                        </p>
                      </div>
                    </div>

                    {/* CASE # */}

                    <span data-cell-label="Case #"  className="truncate text-[10px] font-semibold text-indigo-700">
                      {surgery.id}
                    </span>

                    {/* MRN */}

                    <span data-cell-label="MRN"  className="truncate pr-2 text-[10px] font-medium text-slate-500">
                      {getPatientMrn(surgery)}
                    </span>

                    {/* PROCEDURE */}

                    <div data-cell-label="Procedure"  className="group/procedures relative flex min-w-0 items-center gap-2 pr-2">
                      <div className="flex min-w-0 items-center gap-1">
                        <span className="truncate text-[10px] font-semibold text-slate-700">
                          {primaryProcedure.name}
                        </span>

                        {primaryProcedure.site && (
                          <>
                            <span className="shrink-0 text-[10px] text-slate-300">
                              •
                            </span>

                            <span className="truncate text-[9px] font-medium text-slate-400">
                              {primaryProcedure.site}
                            </span>
                          </>
                        )}
                      </div>

                      {extraProcedures > 0 && (
                        <>
                          <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[8px] font-bold text-slate-500 ring-1 ring-inset ring-slate-200">
                            +{extraProcedures}
                          </span>

                          <div
                            className={`pointer-events-none invisible absolute left-0 z-50 w-[290px] rounded-xl border border-slate-200 bg-white p-2.5 opacity-0 shadow-[0_12px_32px_rgba(15,23,42,0.16)] transition-all duration-150 group-hover/procedures:visible group-hover/procedures:translate-y-0 group-hover/procedures:opacity-100 ${
                              rowIndex >= visibleRows.length - 2
                                ? "bottom-[calc(100%+7px)] -translate-y-1"
                                : "top-[calc(100%+7px)] translate-y-1"
                            }`}
                          >
                            <div className="mb-2 flex items-center justify-between gap-2">
                              <div>
                                <p className="text-[9px] font-bold text-slate-700">
                                  All Procedures
                                </p>

                                <p className="mt-0.5 text-[8px] text-slate-400">
                                  Case {surgery.id}
                                </p>
                              </div>

                              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[8px] font-bold text-slate-500">
                                {procedures.length}
                              </span>
                            </div>

                            <div className="space-y-1">
                              {procedures.map(
                                (procedure, index) => (
                                  <div
                                    key={`${surgery.id}-${procedure.name}-${procedure.site ?? index}`}
                                    className="flex items-center gap-2 rounded-lg bg-slate-50/80 px-2.5 py-1.5"
                                  >
                                    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[7px] font-bold text-slate-500">
                                      {index + 1}
                                    </span>

                                    <div className="flex min-w-0 flex-1 items-center gap-1">
                                      <span className="truncate text-[9px] font-semibold text-slate-700">
                                        {procedure.name}
                                      </span>

                                      {procedure.site && (
                                        <>
                                          <span className="shrink-0 text-[9px] text-slate-300">
                                            •
                                          </span>

                                          <span className="truncate text-[9px] font-medium text-slate-400">
                                            {procedure.site}
                                          </span>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                ),
                              )}
                            </div>
                          </div>
                        </>
                      )}
                    </div>

                    {/* DOCTOR */}

                    <div data-cell-label="Doctor" className="flex min-w-0 items-center gap-1.5 pr-3">
                      <Stethoscope
                        size={11}
                        className="shrink-0 text-slate-400"
                      />

                      <span className="truncate text-[10px] font-medium text-slate-600">
                        {surgery.doctor}
                      </span>
                    </div>

                    {/* DATE */}

                    <span data-cell-label="Date" className="text-[10px] font-medium text-slate-500">
                      {formatDateShort(
                        surgery.date,
                      )}
                    </span>

                    {/* TOTAL */}

                    <span data-cell-label="Total" className="text-[10px] font-semibold text-slate-700">
                      ${surgery.cost.toLocaleString()}
                    </span>

                    {/* PAID */}

                    <div data-cell-label="Paid">
                      <div className="text-[10px] font-semibold text-slate-700">
                        ${surgery.paidAmount.toLocaleString()}
                      </div>

                      {remaining > 0 && (
                        <div className="mt-0.5 text-[7px] text-slate-400">
                          ${remaining.toLocaleString()} left
                        </div>
                      )}
                    </div>

                    {/* PAYMENT */}

                    <PaymentStatus
                      status={
                        surgery.paymentStatus
                      }
                    />

                    {/* ACTION */}

                    <div data-cell-label="Action" className="relative z-10 flex items-center justify-start">
                      {surgery.paymentStatus !==
                      "Paid" ? (
                        <PaymentActionButton
                          partial={
                            surgery.paymentStatus ===
                            "Partially Paid"
                          }
                          onClick={() =>
                            openPayment(
                              surgery.id,
                            )
                          }
                        />
                      ) : (
                        <ReceiptActionButton
                          onClick={() =>
                            openReceipt(
                              surgery.id,
                            )
                          }
                        />
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* PAGINATION - Dashboard style */}

          {sorted.length > 0 && (
            <div className="flex h-10 shrink-0 items-center justify-between border-t border-slate-100 bg-slate-50/50 px-3">
              <p className="text-[9px] font-medium text-slate-400">
                Showing{" "}
                <span className="font-semibold text-slate-600">
                  {page * pageSize + 1}–{Math.min(
                    (page + 1) * pageSize,
                    sorted.length,
                  )}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-slate-600">
                  {sorted.length}
                </span>
                <span className="ml-2 text-slate-300">•</span>
                <span className="ml-2 font-medium text-slate-400">
                  {pageSize} rows/page
                </span>
              </p>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  aria-label="Previous page"
                  disabled={page === 0}
                  onClick={() =>
                    setPage((current) =>
                      Math.max(0, current - 1),
                    )
                  }
                  className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-400 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 disabled:cursor-not-allowed disabled:opacity-35"
                >
                  <ChevronLeft size={11} />
                </button>

                {Array.from(
                  { length: totalPages },
                  (_, index) => index,
                )
                  .slice(
                    Math.max(
                      0,
                      Math.min(
                        page - 1,
                        totalPages - 4,
                      ),
                    ),
                    Math.max(
                      0,
                      Math.min(
                        page - 1,
                        totalPages - 4,
                      ),
                    ) + 4,
                  )
                  .map((pageIndex) => (
                    <button
                      key={pageIndex}
                      type="button"
                      onClick={() =>
                        setPage(pageIndex)
                      }
                      className={`flex h-7 min-w-7 items-center justify-center rounded-md border px-2 text-[10px] font-semibold transition ${
                        page === pageIndex
                          ? "border-indigo-600 bg-indigo-600 text-white shadow-sm"
                          : "border-slate-200 bg-white text-slate-600 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
                      }`}
                    >
                      {pageIndex + 1}
                    </button>
                  ))}

                <button
                  type="button"
                  aria-label="Next page"
                  disabled={
                    page >= totalPages - 1
                  }
                  onClick={() =>
                    setPage((current) =>
                      Math.min(
                        totalPages - 1,
                        current + 1,
                      ),
                    )
                  }
                  className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-400 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 disabled:cursor-not-allowed disabled:opacity-35"
                >
                  <ChevronRight size={11} />
                </button>
              </div>
            </div>
          )}
        </section>
      </div>

      <WorkspaceNotification notice={toast} onClose={() => setToast(null)} />

    </div>
  );
}
