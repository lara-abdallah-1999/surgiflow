import { Check,CheckCircle2,FileText,PackageCheck,Plus } from "lucide-react";
import { type IntraNote,type IntraSection,type SupplyItem,type SupplySection } from "../types";

type Props = {
  setIntraSection: import("react").Dispatch<import("react").SetStateAction<IntraSection>>;
  intraSection: IntraSection;
  requiredSuppliesProgress: { completed: number; total: number; };
  notes: IntraNote[];
  setSupplySection: import("react").Dispatch<import("react").SetStateAction<SupplySection>>;
  setSupplyCategory: import("react").Dispatch<import("react").SetStateAction<string>>;
  supplySection: SupplySection;
  additionalSupplies: SupplyItem[];
  filteredSupplies: SupplyItem[];
  updateSupply: (id: string, additional: boolean) => void;
  noteText: string;
  setNoteText: import("react").Dispatch<import("react").SetStateAction<string>>;
  addClinicalNote: (reviewedText?: string) => void;
};

export function IntraOpPanel({ setIntraSection, intraSection, requiredSuppliesProgress, notes, setSupplySection, setSupplyCategory, supplySection, additionalSupplies, filteredSupplies, updateSupply, noteText, setNoteText, addClinicalNote }: Props) {
  return (<div data-workspace-panel="IntraOpPanel" className="h-full min-h-0">

          <section className="h-full min-h-0 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_1px_3px_rgba(15,23,42,0.03)]">

            {/* INNER NAV */}

            <div data-responsive-grid="2" className="grid h-full min-h-0 grid-cols-[160px_minmax(0,1fr)]">
              {/* WORKFLOW RAIL — selected tab points to the related panel */}
              <aside className="relative z-10 flex min-h-0 flex-col border-r border-slate-200 bg-slate-50/60 px-2 py-2.5">
                <div className="px-3 pb-2">
                  <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-slate-400">
                    OR Preparation
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIntraSection("supplies")}
                  className={`relative flex h-[48px] w-full items-center px-3 text-left transition ${
                    intraSection === "supplies"
                      ? "z-20 rounded-l-lg text-teal-800 shadow-sm border border-teal-200 bg-teal-50/60"
                      : "rounded-lg text-slate-600 hover:bg-white"
                  }`}
                >
                  {intraSection === "supplies" && (
                    <span className="absolute -right-[14px] top-0 h-0 w-0 border-y-[24px] border-l-[14px] border-y-transparent border-l-teal-500/60" />
                  )}

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <PackageCheck
                        size={14}
                        className={
                          intraSection === "supplies"
                            ? "text-teal-800"
                            : "text-slate-400"
                        }
                      />
                      <span className="text-[11px] font-bold">
                        Supplies
                      </span>
                    </div>

                    <p
                      className={`mt-1 text-[9px] font-semibold ${
                        intraSection === "supplies"
                          ? "text-slate-500"
                          : "text-slate-400"
                      }`}
                    >
                      {requiredSuppliesProgress.completed}/{requiredSuppliesProgress.total} required ready
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setIntraSection("notes")}
                  className={`relative mt-1.5 flex h-[48px] w-full items-center px-3 text-left transition ${
                    intraSection === "notes"
                      ? "z-20 rounded-l-lg text-teal-800 shadow-sm border border-teal-200 bg-teal-50/60"
                      : "rounded-lg text-slate-600 hover:bg-white"
                  }`}
                >
                  {intraSection === "notes" && (
                    <span className="absolute -right-[14px] top-0 h-0 w-0 border-y-[24px] border-l-[14px] border-y-transparent border-l-teal-500/60" />
                  )}

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <FileText
                        size={14}
                        className={
                          intraSection === "notes"
                            ? "text-teal-800"
                            : "text-slate-400"
                        }
                      />
                      <span className="text-[11px] font-bold">
                        Notes
                      </span>
                    </div>

                    <p
                      className={`mt-1 text-[9px] font-semibold ${
                        intraSection === "notes"
                          ? "text-slate-500"
                          : "text-slate-400"
                      }`}
                    >
                      {notes.length} {notes.length === 1 ? "entry" : "entries"}
                    </p>
                  </div>
                </button>

                <div className="mt-auto px-3 pt-3">
                  <p className="text-[9px] leading-4 text-slate-500">
                    {intraSection === "supplies"
                      ? "Required and Additional belong to Supplies."
                      : "The panel on the right contains this patient's notes."}
                  </p>
                </div>
              </aside>

              {/* ACTIVE WORKSPACE */}
              <div className="min-h-0 min-w-0 overflow-hidden bg-white ">


            {/* SUPPLIES */}

            {intraSection ===
              "supplies" && (

              <div className="m-2 rounded-xl border border-teal-200">

                <div data-responsive-grid="2" className="grid h-[42px] shrink-0 grid-cols-2 border-b border-slate-100 bg-white rounded-xl">
                  <button
                    type="button"
                    onClick={() => {
                      setSupplySection("required");
                      setSupplyCategory("All");
                    }}
                    className={`relative flex h-full w-full items-center justify-center gap-2 border-r border-slate-100 text-[11px] font-semibold transition ${
                      supplySection === "required"
                        ? "bg-teal-50/35 text-teal-700"
                        : "bg-white text-slate-400 hover:bg-slate-50 hover:text-slate-600"
                    }`}
                  >
                    <span>
                      Required
                    </span>

                    <span
                      className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${
                        supplySection === "required"
                          ? "bg-white text-teal-600 ring-1 ring-teal-100"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {requiredSuppliesProgress.completed}/{requiredSuppliesProgress.total}
                    </span>

                    {supplySection === "required" && (
                      <span className="absolute bottom-0 left-5 right-5 h-[2px] rounded-full bg-teal-500" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSupplySection("additional");
                      setSupplyCategory("All");
                    }}
                    className={`relative flex h-full w-full items-center justify-center gap-2 text-[11px] font-semibold transition ${
                      supplySection === "additional"
                        ? "bg-teal-50/35 text-teal-700"
                        : "bg-white text-slate-400 hover:bg-slate-50 hover:text-slate-600"
                    }`}
                  >
                    <span>
                      Additional
                    </span>

                    <span
                      className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${
                        supplySection === "additional"
                          ? "bg-white text-teal-600 ring-1 ring-teal-100"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {additionalSupplies.filter(
                        (item) => item.checked,
                      ).length}/{additionalSupplies.length}
                    </span>

                    {supplySection === "additional" && (
                      <span className="absolute bottom-0 left-5 right-5 h-[2px] rounded-full bg-teal-500" />
                    )}
                  </button>
                </div>


                <div data-responsive-grid="2" className="grid gap-1.5 p-2.5 sm:grid-cols-2 xl:grid-cols-3">

                  {filteredSupplies.map(
                    (supply) => (

                      <button
                        key={
                          supply.id
                        }
                        type="button"
                        onClick={() =>
                          updateSupply(
                            supply.id,
                            Boolean(
                              supply.additional,
                            ),
                          )
                        }
                        className={`group relative flex items-center gap-2 overflow-hidden rounded-lg border p-2 text-left transition-all ${
                          supply.checked
                            ? "border-teal-200 bg-teal-50/60"
                            : "border-slate-200 bg-white hover:border-teal-200 hover:bg-slate-50"
                        }`}
                      >

                        {supply.checked && (
                          <div className="absolute bottom-0 left-0 top-0 w-0.5 bg-teal-500" />
                        )}

                        <div
                          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition ${
                            supply.checked
                              ? "bg-teal-500 text-white"
                              : "bg-slate-100 text-slate-400 group-hover:bg-violet-50 group-hover:text-teal-500"
                          }`}
                        >

                          {supply.checked ? (
                            <Check
                              size={13}
                              strokeWidth={3}
                            />
                          ) : (
                            <PackageCheck
                              size={13}
                            />
                          )}

                        </div>


                        <div className="min-w-0 flex-1">

                          <p
                            className={`truncate text-[10px] font-bold ${
                              supply.checked
                                ? "text-teal-800"
                                : "text-slate-700"
                            }`}
                          >
                            {
                              supply.name
                            }
                          </p>

                          <p className="mt-0.5 text-[8px] text-slate-400">

                            Qty{" "}
                            {
                              supply.quantity
                            }

                            <span className="mx-1">
                              •
                            </span>

                            {
                              supply.category
                            }

                          </p>

                        </div>


                        {supply.checked && (
                          <CheckCircle2
                            size={13}
                            className="shrink-0 text-teal-500"
                          />
                        )}

                      </button>

                    ),
                  )}

                </div>

              </div>

            )}


            {/* NOTES */}

            {intraSection === "notes" && (
              <div className="grid min-h-0 grid-rows-[40px_150px] gap-1.5 rounded-xl border border-dashed border-teal-300 bg-teal-50/35 p-2 m-1.5 my-2">
                {/* COMPOSER */}
                <div className="flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-2 shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-violet-50 text-teal-600">
                    <FileText size={11} />
                  </div>

                  <input
                    value={noteText}
                    onChange={(event) =>
                      setNoteText(event.target.value)
                    }
                    onKeyDown={(event) => {
                      if (
                        event.key === "Enter" &&
                        noteText.trim()
                      ) {
                        event.preventDefault();
                        addClinicalNote();
                      }
                    }}
                    placeholder="Add clinical observation..."
                    className="h-7 min-w-0 flex-1 border-0 bg-transparent px-1 text-[10px] text-slate-700 outline-none placeholder:text-slate-400"
                  />

                  <button
                    type="button"
                    disabled={!noteText.trim()}
                    onClick={() => addClinicalNote()}
                    className="inline-flex h-6 shrink-0 items-center gap-1 rounded-md bg-teal-600 px-2 !text-[10px] font-bold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
                  >
                    <Plus size={10} />
                    Add
                  </button>
                </div>

                {/* NOTE CARDS */}
                <div className="min-h-0 overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5">
                  <div className="mb-1 flex h-6 items-center justify-between px-1">
                    <div>
                      <p className="!text-[11px] font-bold text-slate-700">
                        Clinical Notes
                      </p>

                      <p className="!text-[9px] text-slate-400">
                        Latest observations
                      </p>
                    </div>

                    <span className="rounded-full bg-violet-50 px-1.5 py-0.5 text-[8px] font-bold text-teal-600">
                      {notes.length}
                    </span>
                  </div>

                  {notes.length === 0 ? (
                    <div className="flex h-[calc(100%-28px)] items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50/40 text-center">
                      <div>
                        <div className="mx-auto flex h-7 w-7 items-center justify-center rounded-full bg-white text-slate-400 shadow-sm ring-1 ring-slate-100">
                          <FileText size={12} />
                        </div>

                        <p className="mt-2 text-[9px] font-semibold text-slate-600">
                          No clinical notes yet
                        </p>

                        <p className="mt-0.5 text-[9px] text-slate-500">
                          Add the first observation above.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div data-responsive-grid="2" className="grid h-[calc(100%-30px)] grid-cols-2 grid-rows-2 gap-1.5">
                      {notes.slice(0, 4).map((note) => (
                        <div
                          key={note.id}
                          className="min-h-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-50/35 px-2 py-1.5"
                        >
                          <div className="flex items-center justify-end">
                            <span className="text-[8px] font-medium text-slate-400">
                              {new Date(note.createdAt).toLocaleTimeString(
                                "en-US",
                                {
                                  hour: "numeric",
                                  minute: "2-digit",
                                },
                              )}
                            </span>
                          </div>

                          <p className="mt-0.5 line-clamp-2 !text-[12px] leading-3.5 text-slate-600">
                            {note.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

              </div>
            </div>
          </section>

        </div>);
}
