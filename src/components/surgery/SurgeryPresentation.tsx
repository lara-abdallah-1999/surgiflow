import type { ReactNode } from "react";

export type ProcedureDisplay = {
  name: string;
  site?: string;
};

export type ModuleTone =
  | "orange"
  | "indigo"
  | "blue"
  | "violet"
  | "green"
  | "teal"
  | "slate";

const demoPatientGender: Record<string, "Male" | "Female"> = {
  "SRG-2048": "Female",
  "SRG-2051": "Female",
  "SRG-2044": "Male",
  "SRG-2057": "Female",
  "SRG-2031": "Female",
};

export function getPatientGender(surgery: unknown): string {
  const record = surgery as {
    id?: string;
    gender?: unknown;
    patientGender?: unknown;
    sex?: unknown;
  };

  const value =
    record.gender ?? record.patientGender ?? record.sex;

  if (typeof value === "string" && value.trim()) {
    return value;
  }

  return record.id
    ? demoPatientGender[record.id] ?? "Not specified"
    : "Not specified";
}

export function getSurgeryProcedures(
  surgery: unknown,
): ProcedureDisplay[] {
  const record = surgery as {
    procedure?: unknown;
    procedures?: unknown;
    operations?: unknown;
    procedureList?: unknown;
  };

  const raw =
    record.procedures ??
    record.operations ??
    record.procedureList;

  if (Array.isArray(raw)) {
    const parsed = raw
      .map((item) => {
        if (typeof item === "string") {
          return { name: item };
        }

        if (typeof item === "object" && item !== null) {
          const value = item as {
            name?: unknown;
            procedure?: unknown;
            label?: unknown;
            operation?: unknown;
            type?: unknown;
            site?: unknown;
            location?: unknown;
            side?: unknown;
            bodySite?: unknown;
          };

          const name =
            value.name ??
            value.procedure ??
            value.label ??
            value.operation ??
            value.type;

          const site =
            value.site ??
            value.location ??
            value.side ??
            value.bodySite;

          if (typeof name === "string") {
            return {
              name,
              site:
                typeof site === "string"
                  ? site
                  : undefined,
            };
          }
        }

        return null;
      })
      .filter(
        (item): item is ProcedureDisplay => item !== null,
      );

    if (parsed.length > 0) {
      return parsed;
    }
  }

  return [
    {
      name:
        typeof record.procedure === "string"
          ? record.procedure
          : "Procedure",
    },
  ];
}

export function ProcedureNames({
  surgery,
  className = "",
}: {
  surgery: unknown;
  className?: string;
}) {
  const procedures = getSurgeryProcedures(surgery);

  return (
    <div
      className={`flex min-w-0 items-center overflow-hidden ${className}`}
    >
      {procedures.map((procedure, index) => (
        <div
          key={`${procedure.name}-${index}`}
          className="flex min-w-0 items-center"
        >
          {index > 0 && (
            <span className="mx-2 shrink-0 text-[10px] text-slate-300">
              •
            </span>
          )}

          <span className="truncate text-[10px] font-medium text-slate-600">
            {procedure.name}
          </span>
        </div>
      ))}
    </div>
  );
}

export function ProcedureChips({
  surgery,
  tone = "slate",
}: {
  surgery: unknown;
  tone?: ModuleTone;
}) {
  const procedures = getSurgeryProcedures(surgery);

  const tones: Record<ModuleTone, string> = {
    orange:
      "border-orange-200 bg-orange-50 text-orange-700",
    indigo:
      "border-indigo-200 bg-indigo-50 text-indigo-700",
    blue:
      "border-blue-200 bg-blue-50 text-blue-700",
    violet:
      "border-violet-200 bg-violet-50 text-violet-700",
    green:
      "border-emerald-200 bg-emerald-50 text-emerald-700",
    teal:
      "border-teal-200 bg-teal-50 text-teal-700",
    slate:
      "border-slate-200 bg-slate-50 text-slate-700",
  };

  return (
    <div className="flex min-w-0 flex-wrap items-center gap-1">
      {procedures.map((procedure, index) => (
        <div
          key={`${procedure.name}-${procedure.site ?? index}`}
          className={`inline-flex max-w-[210px] items-center gap-1 rounded-md border px-2 py-1 ${tones[tone]}`}
        >
          <span className="truncate text-[10px] font-semibold">
            {procedure.name}
          </span>

          {procedure.site && (
            <>
              <span className="text-slate-300">•</span>
              <span className="truncate text-[8px] font-medium text-slate-400">
                {procedure.site}
              </span>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export function ModuleStatCard({
  label,
  value,
  icon,
  tone,
}: {
  label: string;
  value: string | number;
  icon: ReactNode;
  tone: ModuleTone;
}) {
  const styles: Record<
    ModuleTone,
    { icon: string; border: string }
  > = {
    orange: {
      icon: "bg-orange-50 text-orange-600",
      border: "border-orange-100",
    },
    indigo: {
      icon: "bg-indigo-50 text-indigo-600",
      border: "border-indigo-100",
    },
    blue: {
      icon: "bg-blue-50 text-blue-600",
      border: "border-blue-100",
    },
    violet: {
      icon: "bg-violet-50 text-violet-600",
      border: "border-violet-100",
    },
    green: {
      icon: "bg-emerald-50 text-emerald-600",
      border: "border-emerald-100",
    },
    teal: {
      icon: "bg-teal-50 text-teal-600",
      border: "border-teal-100",
    },
    slate: {
      icon: "bg-slate-100 text-slate-600",
      border: "border-slate-200",
    },
  };

  const style = styles[tone];

  return (
    <div
      className={`flex h-[64px] items-center gap-3 rounded-xl border bg-white px-3.5 shadow-[0_1px_2px_rgba(15,23,42,0.03)] ${style.border}`}
    >
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${style.icon}`}
      >
        {icon}
      </div>

      <div className="min-w-0">
        <p className="truncate text-[8px] font-semibold uppercase tracking-wide text-slate-400">
          {label}
        </p>
        <p className="mt-0.5 text-[18px] font-semibold leading-none text-slate-800">
          {value}
        </p>
      </div>
    </div>
  );
}

export function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}
