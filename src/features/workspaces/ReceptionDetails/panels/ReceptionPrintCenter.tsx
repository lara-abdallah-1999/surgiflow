import { Printer,X } from "lucide-react";
import { ReceptionPrintouts } from "../../../../components/surgery/ReceptionPrintouts";
import { type AdmissionFormItem,type Patient } from "../types";
import { formatSurgeryDate } from "../utils";

type Props = {
  selectedPatient: Patient;
  setShowPrintCenter: import("react").Dispatch<import("react").SetStateAction<boolean>>;
  completedAdmissionForms: number;
  requiredAdmissionForms: AdmissionFormItem[];
  selectedSurgery: import("../../../../types/surgery").Surgery;
};

export function ReceptionPrintCenter({ selectedPatient, setShowPrintCenter, completedAdmissionForms, requiredAdmissionForms, selectedSurgery }: Props) {
  return (<div data-workspace-panel="ReceptionPrintCenter" className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/20 p-4 backdrop-blur-[1px]">
          <div className="flex h-[78vh] max-h-[720px] w-[880px] max-w-[94vw] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_22px_60px_rgba(15,23,42,0.18)]">
            <div data-page-toolbar="true" className="flex h-12 shrink-0 items-center justify-between border-b border-blue-100 bg-gradient-to-r from-blue-50/65 to-white px-4">
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                  <Printer size={14} />
                </span>
                <div>
                  <h3 className="text-[11px] font-bold text-slate-800">
                    Reception Print Center
                  </h3>
                  <p className="mt-0.5 text-[7.5px] text-slate-400">
                    {selectedPatient?.name} · {selectedPatient?.id}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowPrintCenter(false)}
                className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-400 transition hover:bg-slate-50 hover:text-slate-600"
                aria-label="Close print center"
              >
                <X size={12} />
              </button>
            </div>

            <div className="grid min-h-0 flex-1 grid-rows-[74px_minmax(0,1fr)] gap-2 p-3">
              {/* AUTO-FILLED PRINT DATA — intentionally visible only in preview */}
              <div data-responsive-grid="4" className="grid grid-cols-[1.1fr_0.9fr_1.35fr_0.9fr] divide-x divide-slate-100 overflow-hidden rounded-xl border border-blue-100 bg-blue-50/20">
                <div className="min-w-0 px-3 py-2">
                  <p className="text-[7px] font-bold uppercase tracking-wide text-slate-400">
                    Patient
                  </p>

                  <p className="mt-1 truncate text-[9px] font-bold text-slate-700">
                    {selectedPatient?.name}
                  </p>

                  <p className="mt-0.5 truncate text-[7.5px] text-slate-400">
                    {selectedPatient?.mrn} · {selectedPatient?.age} yrs · {selectedPatient?.gender}
                  </p>
                </div>

                <div className="min-w-0 px-3 py-2">
                  <p className="text-[7px] font-bold uppercase tracking-wide text-slate-400">
                    Case
                  </p>

                  <p className="mt-1 truncate text-[9px] font-bold text-slate-700">
                    {selectedPatient?.id}
                  </p>

                  <p className="mt-0.5 truncate text-[7.5px] text-slate-400">
                    {selectedPatient
                      ? `${formatSurgeryDate(selectedPatient.date)} · ${selectedPatient.time}`
                      : ""}
                  </p>
                </div>

                <div className="min-w-0 px-3 py-2">
                  <p className="text-[7px] font-bold uppercase tracking-wide text-slate-400">
                    Operation
                  </p>

                  <p className="mt-1 truncate text-[9px] font-bold text-slate-700">
                    {selectedPatient?.procedures
                      .map(
                        (procedure) =>
                          procedure.name,
                      )
                      .join(", ")}
                  </p>

                  <p className="mt-0.5 truncate text-[7.5px] text-slate-400">
                    Surgeon: {selectedPatient?.surgeon}
                  </p>
                </div>

                <div className="min-w-0 px-3 py-2">
                  <p className="text-[7px] font-bold uppercase tracking-wide text-slate-400">
                    Consents
                  </p>

                  <p className="mt-1 text-[9px] font-bold text-blue-700">
                    {completedAdmissionForms}/{requiredAdmissionForms.length} required complete
                  </p>

                  <p className="mt-0.5 text-[7.5px] text-slate-400">
                    Auto-filled preview
                  </p>
                </div>
              </div>

              <div className="min-h-0 overflow-auto rounded-xl border border-slate-100 bg-slate-50/25 p-2">
                <ReceptionPrintouts
                  key={selectedSurgery.id}
                  surgery={selectedSurgery}
                />
              </div>
            </div>
          </div>
        </div>);
}
