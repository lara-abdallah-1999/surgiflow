import { waitingPatientMrn, waitingPatientAge, waitingPatientGender } from "./config";
import { type WaitingProcedureItem } from "./types";


export function getPatientMrn(
  surgery: any,
): string {
  const value =
    surgery.mrn ??
    surgery.patientMrn ??
    surgery.medicalRecordNumber;

  if (
    typeof value === "string" &&
    value.trim()
  ) {
    return value;
  }

  return (
    waitingPatientMrn[surgery.id] ??
    "—"
  );
}


export function getPatientAge(
  surgery: any,
): number | string {
  const value =
    surgery.age ??
    surgery.patientAge;

  if (
    typeof value === "number" &&
    Number.isFinite(value) &&
    value > 0
  ) {
    return value;
  }

  return (
    waitingPatientAge[surgery.id] ??
    "—"
  );
}


export function getPatientGender(
  surgery: any,
): string {
  const value =
    surgery.gender ??
    surgery.patientGender;

  if (
    typeof value === "string" &&
    value.trim()
  ) {
    return value;
  }

  return (
    waitingPatientGender[surgery.id] ??
    "—"
  );
}


export function getProcedureItems(
  surgery: any,
): WaitingProcedureItem[] {
  if (Array.isArray(surgery.procedures)) {
    const items =
      surgery.procedures
        .map((item: any) => {
          if (
            typeof item === "string"
          ) {
            return {
              name: item,
            };
          }

          if (
            item &&
            typeof item === "object"
          ) {
            const name =
              item.name ??
              item.procedure ??
              item.label ??
              item.operation;

            const site =
              item.site ??
              item.side ??
              item.location ??
              item.bodySite;

            if (
              typeof name === "string"
            ) {
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
          (
            item: WaitingProcedureItem | null,
          ): item is WaitingProcedureItem =>
            item !== null,
        );

    if (items.length > 0) {
      return items;
    }
  }

  return [
    {
      name:
        surgery.procedure ||
        "Procedure",
      site:
        typeof surgery.procedureSite ===
        "string"
          ? surgery.procedureSite
          : undefined,
    },
  ];
}


export function getPatientPhone(
  surgery: any,
): string {
  const value =
    surgery.phone ??
    surgery.patientPhone ??
    surgery.phoneNumber ??
    surgery.patientPhoneNumber ??
    surgery.mobile ??
    surgery.patientMobile;

  return typeof value === "string"
    ? value.trim()
    : "";
}


export function normalizeWhatsAppPhone(
  phone: string,
): string {
  let digits = phone.replace(
    /\D/g,
    "",
  );

  if (digits.startsWith("00")) {
    digits = digits.slice(2);
  }

  // This demo project is Lebanon-based. If a local Lebanese
  // number is stored without +961, normalize it for WhatsApp.
  if (digits.startsWith("0")) {
    return `961${digits.slice(1)}`;
  }

  if (
    !digits.startsWith("961") &&
    (digits.length === 7 ||
      digits.length === 8)
  ) {
    return `961${digits}`;
  }

  return digits;
}


export function formatBookingDateForMessage(
  value: string,
): string {
  return new Date(
    `${value}T00:00:00`,
  ).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}


export function buildWhatsAppBookingMessage({
  surgery,
  date,
  time,
}: {
  surgery: any;
  date: string;
  time: string;
}): string {
  const procedures =
    getProcedureItems(surgery)
      .map((item) =>
        item.site
          ? `${item.name} — ${item.site}`
          : item.name,
      )
      .join(", ");

  const age = getPatientAge(surgery);
  const gender =
    getPatientGender(surgery);
  const mrn = getPatientMrn(surgery);

  return [
    `Hello ${surgery.patientName},`,
    "",
    "Your surgery has been booked successfully.",
    "",
    "Patient Information",
    `Name: ${surgery.patientName}`,
    `MRN: ${mrn}`,
    `Age: ${age} years`,
    `Gender: ${gender}`,
    `Case #: ${surgery.id}`,
    "",
    "Surgery Details",
    `Procedure: ${procedures}`,
    `Surgeon: ${surgery.doctor}`,
    `Date: ${formatBookingDateForMessage(
      date,
    )}`,
    `Time: ${time}`,
    "",
    "Please arrive at the hospital reception as instructed.",
  ].join("\n");
}
