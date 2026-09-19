import { accountingDemographics } from "./config";
import { type Period, type SortKey } from "./types";


/* ========================================================================== */
/* DATA HELPERS                                                               */
/* ========================================================================== */

export function getInitials(
  name: string,
) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map(
      (part) => part[0],
    )
    .join("")
    .toUpperCase();
}


export function getPatientMrn(
  surgery: unknown,
) {
  const record =
    surgery as {
      id?: string;
      mrn?: string;
      patientMrn?: string;
    };

  if (
    typeof record.mrn ===
    "string"
  ) {
    return record.mrn;
  }

  if (
    typeof record.patientMrn ===
    "string"
  ) {
    return record.patientMrn;
  }

  if (
    record.id &&
    accountingDemographics[
      record.id
    ]
  ) {
    return accountingDemographics[
      record.id
    ].mrn;
  }

  return record.id
    ? `MRN-${record.id}`
    : "MRN";
}


export function getPatientAge(
  surgery: unknown,
) {
  const record =
    surgery as {
      id?: string;
      age?: number;
      patientAge?: number;
    };

  const direct =
    record.age ??
    record.patientAge;

  if (
    typeof direct === "number" &&
    Number.isFinite(direct) &&
    direct > 0
  ) {
    return direct;
  }

  if (
    record.id &&
    accountingDemographics[
      record.id
    ]
  ) {
    return accountingDemographics[
      record.id
    ].age;
  }

  return "—";
}


export function getPatientGender(
  surgery: unknown,
) {
  const record =
    surgery as {
      id?: string;
      gender?: string;
      patientGender?: string;
      sex?: string;
    };

  const direct =
    record.gender ??
    record.patientGender ??
    record.sex;

  if (
    direct === "Male" ||
    direct === "Female"
  ) {
    return direct;
  }

  if (
    record.id &&
    accountingDemographics[
      record.id
    ]
  ) {
    return accountingDemographics[
      record.id
    ].gender;
  }

  return "Not specified";
}


export function getSurgeryProcedures(
  surgery: unknown,
): Array<{
  name: string;
  site?: string;
}> {
  const record =
    surgery as {
      procedure?: unknown;
      procedures?: unknown;
    };

  if (
    Array.isArray(
      record.procedures,
    )
  ) {
    const procedures =
      record.procedures
        .map((item) => {
          if (
            typeof item ===
            "string"
          ) {
            return {
              name: item,
            };
          }

          if (
            item &&
            typeof item ===
              "object"
          ) {
            const value =
              item as {
                name?: unknown;
                procedure?: unknown;
                site?: unknown;
              };

            const name =
              value.name ??
              value.procedure;

            if (
              typeof name ===
              "string"
            ) {
              return {
                name,
                site:
                  typeof value.site ===
                  "string"
                    ? value.site
                    : undefined,
              };
            }
          }

          return null;
        })
        .filter(
          (
            item,
          ): item is {
            name: string;
            site?: string;
          } => item !== null,
        );

    if (
      procedures.length > 0
    ) {
      return procedures;
    }
  }

  return [
    {
      name:
        typeof record.procedure ===
        "string"
          ? record.procedure
          : "Procedure",
    },
  ];
}


export function getReceiptNumber(
  surgery: any,
) {
  const value =
    surgery.receiptNumber ??
    surgery.receiptNo ??
    surgery.paymentReceiptNumber;

  if (
    typeof value === "string" &&
    value.trim()
  ) {
    return value;
  }

  return `RCT-${String(
    surgery.id ?? "0000",
  ).replace(/^SRG-/, "")}`;
}


export function getPaymentTimestamp(
  surgery: any,
) {
  const candidates = [
    surgery.paymentCompletedAt,
    surgery.paymentPaidAt,
    surgery.paidAt,
    surgery.paymentAt,
    surgery.cashierCompletedAt,
    surgery.updatedAt,
  ];

  for (const value of candidates) {
    if (!value) continue;

    const date =
      new Date(String(value));

    if (
      !Number.isNaN(
        date.getTime(),
      )
    ) {
      return date;
    }
  }

  return null;
}


export function getReceiptDate(
  surgery: any,
) {
  const date =
    getPaymentTimestamp(surgery);

  if (!date) {
    return "Not recorded";
  }

  return date.toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    },
  );
}


export function getReceiptTime(
  surgery: any,
) {
  const date =
    getPaymentTimestamp(surgery);

  if (!date) {
    return "Not recorded";
  }

  return date.toLocaleTimeString(
    "en-US",
    {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    },
  );
}


export function formatDateShort(
  value?: string,
) {
  if (!value) return "-";

  const date = new Date(
    `${value}T00:00:00`,
  );

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return value;
  }

  return date.toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
    },
  );
}


export function isDateInPeriod(
  value: string | undefined,
  selectedDate: string,
  period: Period,
) {
  if (
    !value ||
    !selectedDate
  ) {
    return true;
  }

  const surgeryDate =
    new Date(
      `${value}T00:00:00`,
    );

  const selected =
    new Date(
      `${selectedDate}T00:00:00`,
    );

  if (
    Number.isNaN(
      surgeryDate.getTime(),
    ) ||
    Number.isNaN(
      selected.getTime(),
    )
  ) {
    return true;
  }

  if (period === "Day") {
    return (
      surgeryDate.getFullYear() ===
        selected.getFullYear() &&
      surgeryDate.getMonth() ===
        selected.getMonth() &&
      surgeryDate.getDate() ===
        selected.getDate()
    );
  }

  if (period === "Week") {
    const day =
      selected.getDay();

    const diff =
      day === 0
        ? -6
        : 1 - day;

    const start =
      new Date(selected);

    start.setDate(
      selected.getDate() +
        diff,
    );
    start.setHours(
      0,
      0,
      0,
      0,
    );

    const end =
      new Date(start);

    end.setDate(
      start.getDate() + 6,
    );
    end.setHours(
      23,
      59,
      59,
      999,
    );

    return (
      surgeryDate >= start &&
      surgeryDate <= end
    );
  }

  return (
    surgeryDate.getFullYear() ===
      selected.getFullYear() &&
    surgeryDate.getMonth() ===
      selected.getMonth()
  );
}


export function getSortValue(
  surgery: any,
  key: SortKey,
) {
  switch (key) {
    case "patient":
      return surgery.patientName;

    case "case":
      return surgery.id;

    case "mrn":
      return getPatientMrn(
        surgery,
      );

    case "procedures":
      return getSurgeryProcedures(
        surgery,
      )
        .map(
          (item) =>
            item.name,
        )
        .join(" ");

    case "doctor":
      return surgery.doctor;

    case "date":
      return surgery.date;

    case "total":
      return surgery.cost;

    case "paid":
      return surgery.paidAmount;

    case "payment":
      return surgery.paymentStatus;

    case "status":
      return surgery.status;

    default:
      return "";
  }
}
