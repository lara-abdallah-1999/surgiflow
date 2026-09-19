import { FileCheck2,Printer } from "lucide-react";
import { admissionFormItems } from "../config";
import { type AdmissionFormItem,type ConsentFormDetails,type ReceptionConsentApproval,type SignerRole } from "../types";

type Props = {
  allAdmissionFormsComplete: boolean;
  completedAdmissionForms: number;
  requiredAdmissionForms: AdmissionFormItem[];
  getConsentDetails: (item: AdmissionFormItem) => ConsentFormDetails;
  updateConsentField: (item: AdmissionFormItem, fieldId: string, value: string) => void;
  isMissingHighlighted: (key: string) => boolean;
  consentApproval: ReceptionConsentApproval;
  setConsentApprovalField: <Key extends keyof ReceptionConsentApproval>(key: Key, value: ReceptionConsentApproval[Key]) => void;
  setShowPrintCenter: import("react").Dispatch<import("react").SetStateAction<boolean>>;
  selectedSurgery: import("../../../../types/surgery").Surgery | undefined;
};

export function ReceptionAdmissionForm({ allAdmissionFormsComplete, completedAdmissionForms, requiredAdmissionForms, getConsentDetails, updateConsentField, isMissingHighlighted, consentApproval, setConsentApprovalField, setShowPrintCenter, selectedSurgery }: Props) {
  return (<section data-workspace-panel="admission" className="flex min-h-0 flex-col overflow-hidden rounded-xl border border-amber-100 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
                      <div data-page-toolbar="true" className="flex h-9 shrink-0 items-center justify-between border-b border-amber-100 bg-amber-50/45 px-2.5">
                        <div className="flex min-w-0 items-center gap-2">
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-amber-100 text-amber-700">
                            <FileCheck2 size={12} />
                          </span>

                          <div className="min-w-0">
                            <h3 className="text-[9px] font-bold text-slate-700">
                              Consents & Printouts
                            </h3>
                          </div>
                        </div>

                        <span
                          className={`shrink-0 rounded-full px-2 py-0.5 text-[7px] font-bold ${
                            allAdmissionFormsComplete
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-white text-amber-700 ring-1 ring-amber-200"
                          }`}
                        >
                          {completedAdmissionForms}/{requiredAdmissionForms.length} required
                        </span>
                      </div>

                      <div className="flex min-h-0 flex-1 flex-col gap-2 px-2.5 py-2">
                        {/* ORGANIZED FLAT FORM */}
                        <div className="grid grid-cols-6 gap-x-2.5 gap-y-2 rounded-lg border border-amber-100/80 bg-amber-50/20 p-2.5">
                          <label className="col-span-3 min-w-0">
                            <span className="block text-[9px] font-bold text-slate-600">
                              Emergency contact *
                            </span>
                            <input
                              value={
                                getConsentDetails(
                                  admissionFormItems[0],
                                ).values.emergencyContactName ?? ""
                              }
                              onChange={(event) =>
                                updateConsentField(
                                  admissionFormItems[0],
                                  "emergencyContactName",
                                  event.target.value,
                                )
                              }
                              placeholder="Full name"
                              className={`mt-1 h-7 w-full rounded-lg border bg-white px-2.5 !text-[11px] font-medium text-slate-700 outline-none placeholder:!text-[10px] placeholder:text-slate-300 transition-all duration-300 focus:border-amber-300 ${
                                isMissingHighlighted("field:emergencyContactName")
                                  ? "animate-pulse border-amber-300 bg-amber-50/40 shadow-[0_0_0_3px_rgba(251,191,36,0.10),0_0_16px_rgba(251,191,36,0.16)]"
                                  : "border-amber-200"
                              }`}
                            />
                          </label>

                          <label className="col-span-3 min-w-0">
                            <span className="block text-[9px] font-bold text-slate-600">
                              Emergency phone *
                            </span>
                            <input
                              value={
                                getConsentDetails(
                                  admissionFormItems[0],
                                ).values.emergencyPhone ?? ""
                              }
                              onChange={(event) =>
                                updateConsentField(
                                  admissionFormItems[0],
                                  "emergencyPhone",
                                  event.target.value,
                                )
                              }
                              placeholder="+961 ..."
                              inputMode="tel"
                              className={`mt-1 h-7 w-full rounded-lg border bg-white px-2.5 !text-[11px] font-medium text-slate-700 outline-none placeholder:!text-[10px] placeholder:text-slate-300 transition-all duration-300 focus:border-amber-300 ${
                                isMissingHighlighted("field:emergencyPhone")
                                  ? "animate-pulse border-amber-300 bg-amber-50/40 shadow-[0_0_0_3px_rgba(251,191,36,0.10),0_0_16px_rgba(251,191,36,0.16)]"
                                  : "border-slate-200"
                              }`}
                            />
                          </label>

                          <label className="col-span-3 min-w-0">
                            <span className="block text-[9px] font-bold text-slate-600">
                              Authorized person
                            </span>
                            <input
                              value={
                                getConsentDetails(
                                  admissionFormItems[1],
                                ).values.authorizedContactName ?? ""
                              }
                              onChange={(event) =>
                                updateConsentField(
                                  admissionFormItems[1],
                                  "authorizedContactName",
                                  event.target.value,
                                )
                              }
                              placeholder="Optional"
                              className="mt-1 h-7 w-full rounded-lg border border-slate-200 bg-white px-2.5 !text-[11px] font-medium text-slate-700 outline-none placeholder:!text-[10px] placeholder:text-slate-300 focus:border-amber-300"
                            />
                          </label>

                          <label className="col-span-3 min-w-0">
                            <span className="block text-[9px] font-bold text-slate-600">
                              Authorized phone
                            </span>
                            <input
                              value={
                                getConsentDetails(
                                  admissionFormItems[1],
                                ).values.authorizedPhone ?? ""
                              }
                              onChange={(event) =>
                                updateConsentField(
                                  admissionFormItems[1],
                                  "authorizedPhone",
                                  event.target.value,
                                )
                              }
                              placeholder="+961 ..."
                              inputMode="tel"
                              className="mt-1 h-7 w-full rounded-lg border border-slate-200 bg-white px-2.5 !text-[11px] font-medium text-slate-700 outline-none placeholder:!text-[10px] placeholder:text-slate-300 focus:border-amber-300"
                            />
                          </label>

                          <div className="col-span-3 min-w-0">
                            <p className="block text-[9px] font-bold text-slate-600">
                              Payment responsibility *
                            </p>
                            <div
                              className={`mt-1 flex h-7 overflow-hidden rounded-lg border bg-white transition-all duration-300 ${
                                isMissingHighlighted("field:paymentResponsibility")
                                  ? "animate-pulse border-amber-300 bg-amber-50/40 shadow-[0_0_0_3px_rgba(251,191,36,0.10),0_0_16px_rgba(251,191,36,0.16)]"
                                  : "border-slate-200"
                              }`}
                            >
                              {["Patient", "Insurance", "Guarantor"].map(
                                (option) => {
                                  const current =
                                    getConsentDetails(
                                      admissionFormItems[2],
                                    ).values.paymentResponsibility ?? "";

                                  return (
                                    <button
                                      key={option}
                                      type="button"
                                      onClick={() =>
                                        updateConsentField(
                                          admissionFormItems[2],
                                          "paymentResponsibility",
                                          option,
                                        )
                                      }
                                      className={`min-w-0 flex-1 border-r border-slate-200 px-2 !text-[10px] font-bold last:border-r-0 ${
                                        current === option
                                          ? "bg-amber-500 text-white"
                                          : "text-slate-500 hover:bg-amber-50"
                                      }`}
                                    >
                                      {option}
                                    </button>
                                  );
                                },
                              )}
                            </div>
                          </div>

                          <label className="col-span-3 min-w-0">
                            <span className="block text-[9px] font-bold text-slate-600">
                              Guarantor
                            </span>
                            <input
                              value={
                                getConsentDetails(
                                  admissionFormItems[2],
                                ).values.guarantorName ?? ""
                              }
                              onChange={(event) =>
                                updateConsentField(
                                  admissionFormItems[2],
                                  "guarantorName",
                                  event.target.value,
                                )
                              }
                              placeholder="Optional"
                              className="mt-1 h-7 w-full rounded-lg border border-slate-200 bg-white px-2.5 !text-[11px] font-medium text-slate-700 outline-none placeholder:!text-[10px] placeholder:text-slate-300 focus:border-amber-300"
                            />
                          </label>
                        </div>

                        {/* SHARED APPROVAL */}
                        <div className="grid grid-cols-6 gap-x-2.5 gap-y-2 rounded-lg border border-slate-200 bg-white p-2.5">
                          <label className="col-span-3 min-w-0">
                            <span className="block text-[9px] font-bold text-slate-600">
                              Signer name *
                            </span>

                            <input
                              value={consentApproval.signerName}
                              onChange={(event) =>
                                setConsentApprovalField(
                                  "signerName",
                                  event.target.value,
                                )
                              }
                              placeholder="Patient / representative"
                              className={`mt-1 h-7 w-full rounded-md border bg-white px-2.5 !text-[11px] font-medium leading-none text-slate-700 outline-none placeholder:!text-[10px] placeholder:text-slate-300 transition-all duration-300 focus:border-amber-300 ${
                                isMissingHighlighted("approval:signerName")
                                  ? "animate-pulse border-amber-300 bg-amber-50/40 shadow-[0_0_0_3px_rgba(251,191,36,0.10),0_0_16px_rgba(251,191,36,0.16)]"
                                  : "border-slate-200"
                              }`}
                            />
                          </label>

                          <div className="col-span-3 min-w-0">
                            <p className="block text-[9px] font-bold text-slate-600">
                              Signer role
                            </p>

                            <div className="mt-1 flex h-7 overflow-hidden rounded-md border border-slate-200 bg-white">
                              {(
                                [
                                  ["Patient", "Patient"],
                                  ["Parent / Guardian", "Guardian"],
                                  ["Authorized Representative", "Rep."],
                                ] as Array<[SignerRole, string]>
                              ).map(([role, label]) => (
                                <button
                                  key={role}
                                  type="button"
                                  onClick={() =>
                                    setConsentApprovalField(
                                      "signerRole",
                                      role,
                                    )
                                  }
                                  className={`min-w-0 flex-1 border-r border-slate-200 px-1 !text-[10px] font-bold leading-none last:border-r-0 ${
                                    consentApproval.signerRole === role
                                      ? "bg-amber-500 text-white"
                                      : "text-slate-500 hover:bg-amber-50"
                                  }`}
                                >
                                  {label}
                                </button>
                              ))}
                            </div>
                          </div>

                        </div>

                        {/* COMPACT PRINTOUT ROW */}
                        <div data-responsive-grid="2" className="grid min-w-0 grid-cols-[1fr_auto] items-center gap-2 rounded-lg border border-slate-200 bg-slate-50/45 px-2.5 py-2">
                          <div className="flex min-w-0 items-center gap-1.5">
                            <Printer size={13} className="shrink-0 text-amber-600" />
                            <span className="truncate text-[9px] font-semibold text-slate-500">
                              Printouts use auto-filled patient and operation details.
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => setShowPrintCenter(true)}
                            disabled={!selectedSurgery}
                            className="inline-flex h-7 items-center gap-1.5 rounded-lg border border-amber-200 bg-amber-100/50 px-3.5 !text-[11px] font-bold leading-none text-amber-700 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition hover:bg-amber-50 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <Printer size={10} />
                            Preview & Print
                          </button>
                        </div>
                      </div>
                    </section>);
}
