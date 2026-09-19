import {
AlertCircle,
Check,
CheckCircle2,
ClipboardCheck,
} from "lucide-react";

const checks = [
  {
    title: "Patient Arrival",
    description: "Patient has arrived at the hospital.",
    completed: true,
  },
  {
    title: "Reception Check-in",
    description: "Surgery reception check-in completed.",
    completed: true,
  },
  {
    title: "Pre-Operative Preparation",
    description: "Pre-operative preparation completed.",
    completed: true,
  },
  {
    title: "Medical Assessment",
    description: "Required clinical assessment completed.",
    completed: false,
  },
  {
    title: "Anesthesia Assessment",
    description: "Anesthesiologist assessment completed.",
    completed: false,
  },
  {
    title: "Consent & Documents",
    description: "Required consent and documents available.",
    completed: true,
  },
];

export default function PreOperative() {
  const completed = checks.filter((item) => item.completed).length;
  const percentage = Math.round((completed / checks.length) * 100);

  return (
    <div data-workspace-page="PreOperative" className="min-h-full p-6 lg:p-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <div>
          <p className="text-sm text-slate-500">Clinical Operations</p>

          <h1 className="mt-1 text-2xl font-semibold text-[#172033]">
            Pre-Operative Readiness
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Review patient readiness before the procedure begins.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 font-semibold text-[#102F63]">
                SH
              </div>

              <div>
                <h2 className="text-lg font-semibold text-slate-800">
                  Sarah Haddad
                </h2>

                <p className="text-sm text-slate-500">
                  SRG-2048 · Rhinoplasty
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Dr. Nadim Saleh · OR 02
                </p>
              </div>
            </div>

            <div className="min-w-[220px]">
              <div className="mb-2 flex justify-between text-xs">
                <span className="font-medium text-slate-600">
                  Readiness
                </span>

                <span className="font-semibold text-emerald-600">
                  {percentage}%
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-emerald-500 transition-all"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-6 py-4">
            <div className="flex items-center gap-2">
              <ClipboardCheck className="h-5 w-5 text-[#2563EB]" />
              <h2 className="font-semibold text-slate-800">
                Readiness Checklist
              </h2>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {checks.map((item) => (
              <div
                key={item.title}
                className="flex items-center justify-between px-6 py-5"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-full ${
                      item.completed
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-amber-50 text-amber-600"
                    }`}
                  >
                    {item.completed ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <AlertCircle className="h-4 w-4" />
                    )}
                  </div>

                  <div>
                    <p className="text-sm font-medium text-slate-800">
                      {item.title}
                    </p>

                    <p className="mt-0.5 text-xs text-slate-500">
                      {item.description}
                    </p>
                  </div>
                </div>

                <span
                  className={`text-xs font-medium ${
                    item.completed
                      ? "text-emerald-600"
                      : "text-amber-600"
                  }`}
                >
                  {item.completed ? "Completed" : "Pending"}
                </span>
              </div>
            ))}
          </div>

          <div className="flex justify-end border-t border-slate-100 px-6 py-4">
            <button className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#102F63] px-4 text-sm font-medium text-white transition hover:bg-[#0c2752]">
              <CheckCircle2 className="h-4 w-4" />
              Mark Ready for Surgery
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}