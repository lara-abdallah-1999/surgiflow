import { type CalendarSurgery } from "../types";
import { useMemo } from "react";
import { EmptyState } from "./EmptyState";
import { AlertTriangle, Stethoscope, MapPin, ChevronRight } from "lucide-react";
import { STATUS_STYLES } from "../config";
import { formatTime, getInitials, surgeryCaseNumber } from "../utils";



/* ==========================================================================
   AGENDA VIEW
   ========================================================================== */

export function AgendaView({
  surgeries,
  onSelectSurgery,
}: {
  surgeries: CalendarSurgery[];
  onSelectSurgery: (
    id: string,
  ) => void;
}) {
  const grouped =
    useMemo(
      () => {
        const sorted = [
          ...surgeries,
        ].sort(
          (
            a,
            b,
          ) =>
            a.start.getTime() -
            b.start.getTime(),
        );

        const groups =
          new Map<
            string,
            CalendarSurgery[]
          >();

        sorted.forEach(
          (
            surgery,
          ) => {
            const key =
              surgery.start.toDateString();

            if (
              !groups.has(
                key,
              )
            ) {
              groups.set(
                key,
                [],
              );
            }

            groups
              .get(
                key,
              )!
              .push(
                surgery,
              );
          },
        );

        return Array.from(
          groups.entries(),
        );
      },
      [
        surgeries,
      ],
    );

  if (
    grouped.length ===
    0
  ) {
    return (
      <EmptyState
        title="No surgeries found"
        message="Try changing the search or schedule filters."
      />
    );
  }

  return (
    <div className="space-y-3">
      {grouped.map(
        ([
          date,
          items,
        ]) => (
          <section
            key={
              date
            }
            className="overflow-hidden rounded-xl border border-slate-200 bg-white"
          >
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/70 px-3 py-2">
              <div>
                <p className="text-[10px] font-bold text-slate-700">
                  {items[0].start.toLocaleDateString(
                    "en-US",
                    {
                      weekday:
                        "long",
                      month:
                        "long",
                      day: "numeric",
                      year: "numeric",
                    },
                  )}
                </p>

                <p className="mt-0.5 text-[8px] text-slate-400">
                  {
                    items.length
                  }{" "}
                  scheduled case
                  {items.length ===
                  1
                    ? ""
                    : "s"}
                </p>
              </div>

              {items.some(
                (
                  surgery,
                ) =>
                  surgery.conflict,
              ) && (
                <span className="flex items-center gap-1 rounded-full border border-red-100 bg-red-50 px-2 py-1 text-[8px] font-semibold text-red-600">
                  <AlertTriangle
                    size={9}
                  />
                  Conflict
                </span>
              )}
            </div>

            <div className="divide-y divide-slate-100">
              {items.map(
                (
                  surgery,
                ) => {
                  const style =
                    STATUS_STYLES[
                      surgery
                        .bucket
                    ];

                  return (
                    <button
                      key={
                        surgery.id
                      }
                      type="button"
                      onClick={() =>
                        onSelectSurgery(
                          surgery.id,
                        )
                      }
                      className="relative grid w-full grid-cols-[82px_minmax(180px,1.2fr)_minmax(170px,1fr)_150px_120px_110px_22px] items-center gap-2 px-3 py-2.5 text-left transition hover:bg-slate-50"
                    >
                      {surgery.conflict && (
                        <span className="absolute bottom-1 left-0 top-1 w-[3px] rounded-r-full bg-red-500" />
                      )}

                      <div>
                        <p className="text-[10px] font-bold text-slate-700">
                          {formatTime(
                            surgery.start,
                          )}
                        </p>

                        <p className="mt-0.5 text-[8px] text-slate-400">
                          {Math.round(
                            (surgery.end.getTime() -
                              surgery.start.getTime()) /
                              60000,
                          )}{" "}
                          min
                        </p>
                      </div>

                      <div className="flex min-w-0 items-center gap-2">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[8px] font-bold text-blue-600">
                          {getInitials(
                            surgery.patientName,
                          )}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-[10px] font-bold text-slate-700">
                            {
                              surgery.patientName
                            }
                          </p>

                          <p className="truncate text-[8px] text-slate-400">
                            {
                              surgeryCaseNumber(
                                surgery,
                              )
                            }
                          </p>
                        </div>
                      </div>

                      <p className="truncate text-[9px] font-medium text-slate-600">
                        {
                          surgery.displayProcedure
                        }
                      </p>

                      <div className="flex min-w-0 items-center gap-1.5">
                        <Stethoscope
                          size={10}
                          className="shrink-0 text-slate-400"
                        />

                        <span className="truncate text-[9px] text-slate-600">
                          {
                            surgery.doctor
                          }
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <MapPin
                          size={10}
                          className="text-slate-400"
                        />

                        <span className="truncate text-[9px] text-slate-600">
                          {
                            surgery.displayRoom
                          }
                        </span>
                      </div>

                      <span
                        className={`inline-flex w-fit items-center gap-1 rounded-full border px-2 py-1 text-[8px] font-semibold ${style.bg} ${style.border} ${style.text}`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${style.dot}`}
                        />

                        {
                          style.label
                        }
                      </span>

                      <ChevronRight
                        size={13}
                        className="text-slate-300"
                      />
                    </button>
                  );
                },
              )}
            </div>
          </section>
        ),
      )}
    </div>
  );
}
