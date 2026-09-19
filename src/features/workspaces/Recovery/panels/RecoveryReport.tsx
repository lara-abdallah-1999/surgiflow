import { AlignCenter,AlignLeft,AlignRight,Bold,Highlighter,Italic,List,ListOrdered,Maximize2,Minimize2,Stethoscope,Underline } from "lucide-react";
import type * as React from 'react';
import { ToolbarButton } from "../components";

type Props = {
  reportExpanded: boolean;
  selected: import("../../../../types/surgery").Surgery;
  toggleReportExpanded: () => void;
  applyReportCommand: (command: string, value?: string) => void;
  rememberReportSelection: () => void;
  reportEditorRef: import("react").RefObject<HTMLDivElement | null>;
  handleReportInput: (event: React.FormEvent<HTMLDivElement>) => void;
};

export function RecoveryReport({ reportExpanded, selected, toggleReportExpanded, applyReportCommand, rememberReportSelection, reportEditorRef, handleReportInput }: Props) {
  return (<div data-workspace-panel="RecoveryReport"
                    className={`flex min-h-0 flex-col overflow-hidden border border-emerald-200 bg-white shadow-sm ${
                      reportExpanded
                        ? "fixed bottom-4 left-4 right-4 top-4 z-[70] rounded-2xl shadow-2xl"
                        : "rounded-xl"
                    }`}
                  >
                    <div data-page-toolbar="true" className="flex h-11 shrink-0 items-center justify-between gap-3 border-b border-emerald-100 bg-emerald-50/40 px-3">
                      <div className="flex min-w-0 items-center gap-2">
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-emerald-100 text-emerald-600">
                          <Stethoscope size={13} />
                        </div>

                        <div className="min-w-0">
                          <p className="text-[11px] font-semibold text-slate-800">
                            Surgeon Post-Operative Report
                          </p>
                          <p className="truncate !text-[10px] text-slate-400 font-medium">
                            Clinical report by {selected.doctor}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className="rounded-md bg-white px-2 py-1 text-[9px] font-semibold text-emerald-600 ring-1 ring-emerald-100">
                          Rich Text
                        </span>

                        <button
                          type="button"
                          onClick={toggleReportExpanded}
                          className="flex h-7 items-center gap-1.5 rounded-md border border-emerald-200 bg-white px-2 text-[9px] font-semibold text-emerald-700 transition hover:bg-emerald-50"
                          title={reportExpanded ? "Collapse report" : "Expand report"}
                        >
                          {reportExpanded ? (
                            <Minimize2 size={11} />
                          ) : (
                            <Maximize2 size={11} />
                          )}
                          {reportExpanded ? "Collapse" : "Expand"}
                        </button>
                      </div>
                    </div>

                    <div className="flex min-h-0 flex-1 flex-col">
                      {/* DOCUMENT TOOLBAR */}
                      <div className="flex h-9 shrink-0 items-center gap-1 border-b border-emerald-100 bg-emerald-50/35 px-2">
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

                        <ToolbarButton
                          title="Bold"
                          onClick={() =>
                            applyReportCommand("bold")
                          }
                        >
                          <Bold size={11} />
                        </ToolbarButton>

                        <ToolbarButton
                          title="Italic"
                          onClick={() =>
                            applyReportCommand("italic")
                          }
                        >
                          <Italic size={11} />
                        </ToolbarButton>

                        <ToolbarButton
                          title="Underline"
                          onClick={() =>
                            applyReportCommand("underline")
                          }
                        >
                          <Underline size={11} />
                        </ToolbarButton>

                        <div className="mx-0.5 h-4 w-px bg-slate-200" />

                        <ToolbarButton
                          title="Align left"
                          onClick={() =>
                            applyReportCommand("justifyLeft")
                          }
                        >
                          <AlignLeft size={11} />
                        </ToolbarButton>

                        <ToolbarButton
                          title="Align center"
                          onClick={() =>
                            applyReportCommand("justifyCenter")
                          }
                        >
                          <AlignCenter size={11} />
                        </ToolbarButton>

                        <ToolbarButton
                          title="Align right"
                          onClick={() =>
                            applyReportCommand("justifyRight")
                          }
                        >
                          <AlignRight size={11} />
                        </ToolbarButton>

                        <div className="mx-0.5 h-4 w-px bg-slate-200" />

                        <ToolbarButton
                          title="Bulleted list"
                          onClick={() =>
                            applyReportCommand("insertUnorderedList")
                          }
                        >
                          <List size={11} />
                        </ToolbarButton>

                        <ToolbarButton
                          title="Numbered list"
                          onClick={() =>
                            applyReportCommand("insertOrderedList")
                          }
                        >
                          <ListOrdered size={11} />
                        </ToolbarButton>

                        <div className="mx-0.5 h-4 w-px bg-slate-200" />

                        <label
                          title="Text color"
                          className="relative flex h-6 w-7 cursor-pointer items-center justify-center rounded border border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                        >
                          A
                          <input
                            type="color"
                            defaultValue="#334155"
                            onMouseDown={rememberReportSelection}
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
                          className="relative flex h-6 w-7 cursor-pointer items-center justify-center rounded border border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                        >
                          <Highlighter size={11} />
                          <input
                            type="color"
                            defaultValue="#FEF3C7"
                            onMouseDown={rememberReportSelection}
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

                      {/* DOCUMENT EDITOR — single report surface */}
                      <div
                        ref={reportEditorRef}
                        contentEditable
                        suppressContentEditableWarning
                        spellCheck
                        onInput={handleReportInput}
                        onMouseUp={rememberReportSelection}
                        onKeyUp={rememberReportSelection}
                        onBlur={rememberReportSelection}
                        data-placeholder="Document procedure outcome, operative findings, events during surgery, complications, interventions, blood loss, specimens, and immediate post-operative plan..."
                        className={`min-h-0 flex-1 overflow-auto bg-white px-5 py-4 text-[12px] leading-5 text-slate-700 outline-none empty:before:pointer-events-none empty:before:text-slate-400 empty:before:content-[attr(data-placeholder)] ${
                          reportExpanded
                            ? "text-[13px] leading-6"
                            : ""
                        }`}
                      />
                    </div>
                  </div>);
}
