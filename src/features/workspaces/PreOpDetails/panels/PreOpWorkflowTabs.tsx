import { ClipboardCheck,PackageCheck,Syringe,UserCheck } from "lucide-react";
import { ProgressBadge } from "../components";
import { type TabKey } from "../types";

type Props = {
  activeTab: TabKey;
  setActiveTab: import("react").Dispatch<import("react").SetStateAction<TabKey>>;
  preOpAssessmentProgress: { completed: number; total: number; };
  testProgress: { completed: number; total: number; };
  anesthesiaProgress: { completed: number; total: number; };
  requiredSuppliesProgress: { completed: number; total: number; };
};

export function PreOpWorkflowTabs({ activeTab, setActiveTab, preOpAssessmentProgress, testProgress, anesthesiaProgress, requiredSuppliesProgress }: Props) {
  return (<aside className="preop-tabs row-span-2 flex min-h-0 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-sm">
      <div className="grid min-h-0 flex-1 grid-rows-4 gap-1">
        <button
          type="button"
          aria-pressed={activeTab === "preop-assessment"}
          onClick={() => setActiveTab("preop-assessment")}
          className={`group relative flex min-h-0 flex-col items-center justify-center gap-1 rounded-lg border px-1.5 py-1.5 text-center transition ${
            activeTab === "preop-assessment"
              ? "border-blue-200 bg-blue-50/70 text-blue-700"
              : "border-transparent text-slate-400 hover:border-slate-100 hover:bg-slate-50 hover:text-slate-600"
          }`}
        >
          {activeTab === "preop-assessment" && (
            <span className="absolute bottom-2 left-0 top-2 w-[3px] rounded-r-full bg-blue-500" />
          )}

          <span
            className={`flex h-6 w-6 items-center justify-center rounded-md ${
              activeTab === "preop-assessment"
                ? "bg-blue-100 text-blue-700"
                : "bg-slate-50 text-slate-400 group-hover:bg-white"
            }`}
          >
            <UserCheck size={12} />
          </span>

          <span className="max-w-[88px] text-[8px] font-bold leading-[10px]">
            PreOp Assessment
          </span>

          <ProgressBadge
            completed={preOpAssessmentProgress.completed}
            total={preOpAssessmentProgress.total}
            color="blue"
          />
        </button>

        <button
          type="button"
          aria-pressed={activeTab === "pre-tests"}
          onClick={() => setActiveTab("pre-tests")}
          className={`group relative flex min-h-0 flex-col items-center justify-center gap-1 rounded-lg border px-1.5 py-1.5 text-center transition ${
            activeTab === "pre-tests"
              ? "border-orange-200 bg-orange-50/70 text-orange-700"
              : "border-transparent text-slate-400 hover:border-slate-100 hover:bg-slate-50 hover:text-slate-600"
          }`}
        >
          {activeTab === "pre-tests" && (
            <span className="absolute bottom-2 left-0 top-2 w-[3px] rounded-r-full bg-orange-500" />
          )}

          <span
            className={`flex h-6 w-6 items-center justify-center rounded-md ${
              activeTab === "pre-tests"
                ? "bg-orange-100 text-orange-700"
                : "bg-slate-50 text-slate-400 group-hover:bg-white"
            }`}
          >
            <ClipboardCheck size={12} />
          </span>

          <span className="text-[8px] font-bold leading-[10px]">
            Pre Tests
          </span>

          <ProgressBadge
            completed={testProgress.completed}
            total={testProgress.total}
            color="orange"
          />
        </button>

        <button
          type="button"
          aria-pressed={activeTab === "anesthesia"}
          onClick={() => setActiveTab("anesthesia")}
          className={`group relative flex min-h-0 flex-col items-center justify-center gap-1 rounded-lg border px-1.5 py-1.5 text-center transition ${
            activeTab === "anesthesia"
              ? "border-purple-200 bg-purple-50/75 text-purple-700"
              : "border-transparent text-slate-400 hover:border-slate-100 hover:bg-slate-50 hover:text-slate-600"
          }`}
        >
          {activeTab === "anesthesia" && (
            <span className="absolute bottom-2 left-0 top-2 w-[3px] rounded-r-full bg-purple-500" />
          )}

          <span
            className={`flex h-6 w-6 items-center justify-center rounded-md ${
              activeTab === "anesthesia"
                ? "bg-purple-100 text-purple-700"
                : "bg-slate-50 text-slate-400 group-hover:bg-white"
            }`}
          >
            <Syringe size={12} />
          </span>

          <span className="max-w-[90px] text-[8px] font-bold leading-[10px]">
            Anesthesia
          </span>

          <ProgressBadge
            completed={anesthesiaProgress.completed}
            total={anesthesiaProgress.total}
            color="purple"
          />
        </button>

        <button
          type="button"
          aria-pressed={activeTab === "intra-op"}
          onClick={() => setActiveTab("intra-op")}
          className={`group relative flex min-h-0 flex-col items-center justify-center gap-1 rounded-lg border px-1.5 py-1.5 text-center transition ${
            activeTab === "intra-op"
              ? "border-teal-200 bg-teal-50/75 text-teal-700"
              : "border-transparent text-slate-400 hover:border-slate-100 hover:bg-slate-50 hover:text-slate-600"
          }`}
        >
          {activeTab === "intra-op" && (
            <span className="absolute bottom-2 left-0 top-2 w-[3px] rounded-r-full bg-teal-500" />
          )}

          <span
            className={`flex h-6 w-6 items-center justify-center rounded-md ${
              activeTab === "intra-op"
                ? "bg-teal-100 text-teal-700"
                : "bg-slate-50 text-slate-400 group-hover:bg-white"
            }`}
          >
            <PackageCheck size={12} />
          </span>

          <span className="text-[8px] font-bold leading-[10px]">
            Intra-Op
          </span>

          <ProgressBadge
            completed={requiredSuppliesProgress.completed}
            total={requiredSuppliesProgress.total}
            color="teal"
          />
        </button>
      </div>
    </aside>);
}
