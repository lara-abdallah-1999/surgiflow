import { AlignCenter,AlignLeft,AlignRight,Bold,ClipboardCheck,Highlighter,Italic,List,ListOrdered,Maximize2,Minimize2,Save,Underline,X } from "lucide-react";
import type * as React from 'react';
import { ReportToolbarButton } from "../components";

type Props = {
  reportExpanded: boolean;
  selected: import("../../../../types/surgery").Surgery;
  saveSurgeonReport: () => void;
  toggleReportExpanded: () => void;
  closeReportEditor: () => void;
  applyReportCommand: (command: string, value?: string) => void;
  rememberReportSelection: () => void;
  reportEditorRef: import("react").RefObject<HTMLDivElement | null>;
  handleReportInput: (event: React.FormEvent<HTMLDivElement>) => void;
};

export function PostOpReportEditor({ reportExpanded, selected, saveSurgeonReport, toggleReportExpanded, closeReportEditor, applyReportCommand, rememberReportSelection, reportEditorRef, handleReportInput }: Props) {
  return (<section data-workspace-panel="PostOpReportEditor"
                  className={`fixed z-[80] flex flex-col overflow-hidden border border-cyan-100 bg-white shadow-2xl ${
                    reportExpanded
                      ? "inset-3 rounded-2xl"
                      : "left-1/2 top-1/2 h-[620px] max-h-[86vh] w-[860px] max-w-[88vw] -translate-x-1/2 -translate-y-1/2 rounded-2xl"
                  }`}
                >
                  <div data-page-toolbar="true" className="flex h-[66px] shrink-0 items-center justify-between border-b border-cyan-100 bg-gradient-to-r from-cyan-50/75 via-white to-white px-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-100 text-cyan-700">
                        <ClipboardCheck
                          size={15}
                        />
                      </div>
                      <div>
                        <h3 className="text-[13px] font-bold text-slate-800">
                          Surgeon Post-Operative Report
                        </h3>
                        <p className="mt-0.5 text-[9px] text-slate-500">
                          {selected.patientName} • {selected.id} • Post-Op
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={
                          saveSurgeonReport
                        }
                        className="inline-flex h-7 items-center gap-1.5 rounded-md bg-cyan-600 px-2.5 text-[9px] font-semibold text-white transition hover:bg-cyan-700"
                      >
                        <Save size={11} />
                        Save Report
                      </button>

                      <button
                        type="button"
                        onClick={
                          toggleReportExpanded
                        }
                        className="flex h-7 items-center gap-1.5 rounded-md border border-cyan-200 bg-white px-2 text-[9px] font-semibold text-cyan-700 transition hover:bg-cyan-50"
                      >
                        {reportExpanded ? (
                          <Minimize2 size={11} />
                        ) : (
                          <Maximize2 size={11} />
                        )}
                        {reportExpanded
                          ? "Collapse"
                          : "Expand"}
                      </button>

                      <button
                        type="button"
                        onClick={
                          closeReportEditor
                        }
                        className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-400 hover:bg-slate-50"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  </div>

                  <div className="flex h-9 shrink-0 items-center gap-1 border-b border-cyan-100 bg-cyan-50/35 px-2">
                    <select
                      defaultValue="Arial"
                      onChange={(event) =>
                        applyReportCommand(
                          "fontName",
                          event.target.value,
                        )
                      }
                      className="h-6 rounded border border-slate-200 bg-white px-1.5 text-[9px] text-slate-600 outline-none"
                    >
                      <option>Arial</option>
                      <option>Georgia</option>
                      <option>Times New Roman</option>
                      <option>Courier New</option>
                    </select>

                    <select
                      defaultValue="3"
                      onChange={(event) =>
                        applyReportCommand(
                          "fontSize",
                          event.target.value,
                        )
                      }
                      className="h-6 w-12 rounded border border-slate-200 bg-white px-1 text-[9px] text-slate-600 outline-none"
                    >
                      <option value="1">10</option>
                      <option value="2">12</option>
                      <option value="3">14</option>
                      <option value="4">16</option>
                      <option value="5">18</option>
                    </select>

                    <div className="mx-0.5 h-4 w-px bg-slate-200" />

                    <ReportToolbarButton title="Bold" onClick={() => applyReportCommand("bold")}>
                      <Bold size={11} />
                    </ReportToolbarButton>
                    <ReportToolbarButton title="Italic" onClick={() => applyReportCommand("italic")}>
                      <Italic size={11} />
                    </ReportToolbarButton>
                    <ReportToolbarButton title="Underline" onClick={() => applyReportCommand("underline")}>
                      <Underline size={11} />
                    </ReportToolbarButton>

                    <div className="mx-0.5 h-4 w-px bg-slate-200" />

                    <ReportToolbarButton title="Align left" onClick={() => applyReportCommand("justifyLeft")}>
                      <AlignLeft size={11} />
                    </ReportToolbarButton>
                    <ReportToolbarButton title="Align center" onClick={() => applyReportCommand("justifyCenter")}>
                      <AlignCenter size={11} />
                    </ReportToolbarButton>
                    <ReportToolbarButton title="Align right" onClick={() => applyReportCommand("justifyRight")}>
                      <AlignRight size={11} />
                    </ReportToolbarButton>

                    <div className="mx-0.5 h-4 w-px bg-slate-200" />

                    <ReportToolbarButton title="Bulleted list" onClick={() => applyReportCommand("insertUnorderedList")}>
                      <List size={11} />
                    </ReportToolbarButton>
                    <ReportToolbarButton title="Numbered list" onClick={() => applyReportCommand("insertOrderedList")}>
                      <ListOrdered size={11} />
                    </ReportToolbarButton>

                    <div className="mx-0.5 h-4 w-px bg-slate-200" />

                    <label
                      title="Text color"
                      className="relative flex h-6 w-7 cursor-pointer items-center justify-center rounded border border-slate-200 bg-white text-[9px] font-bold text-slate-500"
                    >
                      A
                      <input
                        type="color"
                        defaultValue="#334155"
                        onMouseDown={
                          rememberReportSelection
                        }
                        onInput={(event) =>
                          applyReportCommand(
                            "foreColor",
                            (
                              event.target as HTMLInputElement
                            ).value,
                          )
                        }
                        className="absolute inset-0 cursor-pointer opacity-0"
                      />
                    </label>

                    <label
                      title="Highlight color"
                      className="relative flex h-6 w-7 cursor-pointer items-center justify-center rounded border border-slate-200 bg-white text-slate-500"
                    >
                      <Highlighter size={11} />
                      <input
                        type="color"
                        defaultValue="#CFFAFE"
                        onMouseDown={
                          rememberReportSelection
                        }
                        onInput={(event) =>
                          applyReportCommand(
                            "hiliteColor",
                            (
                              event.target as HTMLInputElement
                            ).value,
                          )
                        }
                        className="absolute inset-0 cursor-pointer opacity-0"
                      />
                    </label>
                  </div>

                  <div
                    ref={reportEditorRef}
                    contentEditable
                    suppressContentEditableWarning
                    spellCheck
                    onInput={
                      handleReportInput
                    }
                    onMouseUp={
                      rememberReportSelection
                    }
                    onKeyUp={
                      rememberReportSelection
                    }
                    onBlur={
                      rememberReportSelection
                    }
                    data-placeholder="Document procedure outcome, operative findings, events during surgery, complications, interventions, blood loss, specimens, and immediate post-operative plan..."
                    className={`min-h-0 flex-1 overflow-auto bg-white px-5 py-4 text-[12px] leading-5 text-slate-700 outline-none empty:before:pointer-events-none empty:before:text-slate-400 empty:before:content-[attr(data-placeholder)] ${
                      reportExpanded
                        ? "text-[13px] leading-6"
                        : ""
                    }`}
                  />
                </section>);
}
