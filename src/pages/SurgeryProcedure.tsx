import {
Activity,
CheckCircle2,
Clock3,
PauseCircle,
PlayCircle,
UserRound,
} from "lucide-react";
import { useState } from "react";

export default function SurgeryProcedure() {
  const [running, setRunning] = useState(true);

  return (
    <div data-workspace-page="SurgeryProcedure" className="min-h-full p-6 lg:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div>
          <p className="text-sm text-slate-500">Operating Room 02</p>

          <h1 className="mt-1 text-2xl font-semibold text-[#172033]">
            Rhinoplasty
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Sarah Haddad · SRG-2048 · Dr. Nadim Saleh
          </p>
        </div>

        <div className="rounded-xl border border-purple-200 bg-purple-50 p-6">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-purple-500" />

                <span className="text-sm font-semibold text-purple-700">
                  {running ? "SURGERY IN PROGRESS" : "SURGERY PAUSED"}
                </span>
              </div>

              <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-800">
                01:18:42
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Started at 08:42
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setRunning(!running)}
                className="inline-flex h-10 items-center gap-2 rounded-lg border border-purple-200 bg-white px-4 text-sm font-medium text-purple-700"
              >
                {running ? (
                  <PauseCircle className="h-4 w-4" />
                ) : (
                  <PlayCircle className="h-4 w-4" />
                )}

                {running ? "Pause Procedure" : "Resume Procedure"}
              </button>

              <button className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#102F63] px-4 text-sm font-medium text-white">
                <CheckCircle2 className="h-4 w-4" />
                Complete Surgery
              </button>
            </div>
          </div>
        </div>

        <div data-responsive-grid="3" className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-6 py-4">
              <h2 className="font-semibold text-slate-800">
                Procedure Timeline
              </h2>
            </div>

            <div className="divide-y divide-slate-100">
              <TimelineItem
                time="08:30"
                title="Patient entered operating room"
                completed
              />

              <TimelineItem
                time="08:35"
                title="Anesthesia started"
                completed
              />

              <TimelineItem
                time="08:42"
                title="Procedure started"
                completed
              />

              <TimelineItem
                time="09:20"
                title="Procedure in progress"
                current
              />

              <TimelineItem
                time="--:--"
                title="Procedure completed"
              />
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="font-semibold text-slate-800">
              Procedure Details
            </h2>

            <div className="mt-5 space-y-5">
              <Info
                icon={UserRound}
                label="Patient"
                value="Sarah Haddad"
              />

              <Info
                icon={Activity}
                label="Surgeon"
                value="Dr. Nadim Saleh"
              />

              <Info
                icon={Clock3}
                label="Scheduled Duration"
                value="2 hours"
              />

              <Info
                icon={Activity}
                label="Operating Room"
                value="OR 02"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TimelineItem({
  time,
  title,
  completed,
  current,
}: {
  time: string;
  title: string;
  completed?: boolean;
  current?: boolean;
}) {
  return (
    <div data-workspace-page="SurgeryProcedure" className="flex items-center gap-4 px-6 py-5">
      <span className="w-12 text-xs font-medium text-slate-500">
        {time}
      </span>

      <div
        className={`flex h-8 w-8 items-center justify-center rounded-full ${
          completed
            ? "bg-emerald-50 text-emerald-600"
            : current
              ? "bg-purple-50 text-purple-600"
              : "bg-slate-100 text-slate-500"
        }`}
      >
        {completed ? (
          <CheckCircle2 className="h-4 w-4" />
        ) : (
          <span className="h-2 w-2 rounded-full bg-current" />
        )}
      </div>

      <span
        className={`text-sm ${
          current
            ? "font-semibold text-purple-700"
            : "text-slate-600"
        }`}
      >
        {title}
      </span>
    </div>
  );
}

function Info({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof UserRound;
  label: string;
  value: string;
}) {
  return (
    <div data-workspace-page="SurgeryProcedure" className="flex items-center gap-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
        <Icon className="h-4 w-4" />
      </div>

      <div>
        <p className="text-xs text-slate-500">{label}</p>
        <p className="mt-0.5 text-sm font-medium text-slate-700">
          {value}
        </p>
      </div>
    </div>
  );
}