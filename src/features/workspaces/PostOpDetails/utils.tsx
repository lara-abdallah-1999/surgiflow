import { type Medication, type FollowUpOrder, type LifestyleHabitType, type Period, type LifestylePlan, type PostOpState, type PatientCondition, type PostOpProcedureItem, type PostOpVisit } from "./types";
import { lifestyleHabitTypes, EMPTY_STATE, EMPTY_LIFESTYLE, demoPostOpPatientAge, POST_OP_VISIT_SLOTS } from "./config";



export function getPatientPhoneForWhatsApp(
  surgery: any,
) {
  return String(
    surgery?.phone ??
      surgery?.patientPhone ??
      surgery?.mobile ??
      "",
  )
    .replace(/[^\d+]/g, "")
    .replace(/^\+/, "");
}


export function formatWhatsAppMedicationLines(
  medications: Medication[],
) {
  const activeMedications =
    medications.filter(
      (medication) =>
        medication.status === "Active",
    );

  if (!activeMedications.length) {
    return ["No active medications."];
  }

  return activeMedications.map(
    (medication, index) =>
      `${index + 1}. ${medication.name}\n   Dose: ${medication.dose}\n   Frequency: ${medication.frequency}\n   Duration: ${medication.duration}`,
  );
}


export function formatWhatsAppFollowUpLines(
  followUps: FollowUpOrder[],
) {
  const pendingFollowUps =
    followUps.filter(
      (order) =>
        order.status === "Requested" ||
        order.status === "Scheduled",
    );

  if (!pendingFollowUps.length) {
    return [
      "No requested or scheduled tests/imaging.",
    ];
  }

  return pendingFollowUps.map(
    (order, index) =>
      `${index + 1}. ${order.type}: ${order.name}\n   Due date: ${
        order.dueDate
          ? formatShortDate(order.dueDate)
          : "Not specified"
      }\n   Status: ${order.status}`,
  );
}


export function buildPostOpVisitWhatsAppMessage({
  action,
  patientName,
  doctor,
  date,
  time,
  previousDate,
  previousTime,
  medications,
  followUps,
}: {
  action: "booked" | "updated" | "cancelled";
  patientName: string;
  doctor: string;
  date: string;
  time: string;
  previousDate?: string;
  previousTime?: string;
  medications: Medication[];
  followUps: FollowUpOrder[];
}) {
  const formattedDate =
    date
      ? formatShortDate(date)
      : "";

  const formattedTime =
    time
      ? formatVisitTime(time)
      : "";

  const medicationLines =
    formatWhatsAppMedicationLines(
      medications,
    );

  const followUpLines =
    formatWhatsAppFollowUpLines(
      followUps,
    );

  const planDetails = [
    "",
    "------------------------------",
    "MEDICATIONS",
    "------------------------------",
    ...medicationLines,
    "",
    "------------------------------",
    "TESTS & IMAGING",
    "------------------------------",
    ...followUpLines,
  ];

  if (action === "booked") {
    return [
      `Hello ${patientName},`,
      "",
      "Your Post-Op follow-up visit has been booked.",
      "",
      `Doctor: ${doctor}`,
      `Date: ${formattedDate}`,
      `Time: ${formattedTime}`,
      ...planDetails,
      "",
      "Please contact the hospital if you need any assistance.",
    ].join("\n");
  }

  if (action === "updated") {
    return [
      `Hello ${patientName},`,
      "",
      "Your Post-Op follow-up visit has been updated.",
      "",
      previousDate || previousTime
        ? `Previous appointment: ${
            previousDate
              ? formatShortDate(previousDate)
              : ""
          }${
            previousDate && previousTime
              ? " at "
              : ""
          }${
            previousTime
              ? formatVisitTime(previousTime)
              : ""
          }`
        : "",
      `New date: ${formattedDate}`,
      `New time: ${formattedTime}`,
      `Doctor: ${doctor}`,
      ...planDetails,
      "",
      "Please contact the hospital if you need any assistance.",
    ]
      .filter(
        (line) =>
          line !== "",
      )
      .join("\n");
  }

  return [
    `Hello ${patientName},`,
    "",
    "Your Post-Op follow-up visit has been cancelled.",
    "",
    `Doctor: ${doctor}`,
    `Cancelled date: ${formattedDate}`,
    `Cancelled time: ${formattedTime}`,
    ...planDetails,
    "",
    "Please contact the hospital if you need to arrange another visit.",
  ].join("\n");
}


export function openPostOpWhatsApp(
  phone: string,
  message: string,
) {
  if (!phone) return false;

  const normalizedPhone =
    phone.replace(/\D/g, "");

  const params =
    new URLSearchParams();

  params.set(
    "text",
    message,
  );

  const url = `https://wa.me/${normalizedPhone}?${params.toString()}`;

  window.open(
    url,
    "_blank",
    "noopener,noreferrer",
  );

  return true;
}


export function getLifestylePlaceholder(
  type: LifestyleHabitType,
) {
  switch (type) {
    case "Walking":
      return "e.g. Walk 20–30 min twice daily";
    case "Exercise":
      return "e.g. Gentle stretching only";
    case "Nutrition":
      return "e.g. High-protein soft diet";
    case "Foods to Avoid":
      return "e.g. Avoid spicy or hard foods";
    case "Hydration":
      return "e.g. 2 L water daily";
    case "Sleep / Rest":
      return "e.g. Sleep with head elevated";
    case "Restriction":
      return "e.g. No lifting over 5 kg";
    default:
      return "Add patient-specific guidance";
  }
}


export function hasRichTextContent(
  html: string | undefined | null,
) {
  if (!html) return false;

  const text = html
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<\/p>/gi, " ")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .trim();

  return text.length > 0;
}


/* ========================================================================== */
/* DATA HELPERS                                                               */
/* ========================================================================== */

export function getPostOpDateSortValue(
  surgery: any,
) {
  const value =
    surgery.surgeryDate ??
    surgery.scheduledDate ??
    surgery.date ??
    surgery.scheduledAt ??
    surgery.startDate ??
    surgery.surgeryStartedAt;

  return value
    ? String(value)
    : "";
}


export function formatPostOpSurgeryDate(
  surgery: any,
) {
  const raw =
    getPostOpDateSortValue(
      surgery,
    );

  if (!raw) return "—";

  const date =
    new Date(
      raw.length === 10
        ? `${raw}T00:00:00`
        : raw,
    );

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return raw;
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


export function isPostOpDateInPeriod(
  surgery: any,
  selectedDate: string,
  period: Period,
) {
  const raw =
    getPostOpDateSortValue(
      surgery,
    );

  if (
    !raw ||
    !selectedDate
  ) {
    return true;
  }

  const surgeryDate =
    new Date(
      raw.length === 10
        ? `${raw}T00:00:00`
        : raw,
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


export function formatDischargeDateTime(
  value: string,
) {
  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return "Date not recorded";
  }

  return date.toLocaleString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    },
  );
}


export function normalizeLifestylePlan(
  value: unknown,
): LifestylePlan {
  if (Array.isArray(value)) {
    return value
      .filter(
        (item) =>
          item &&
          typeof item === "object" &&
          typeof item.instruction ===
            "string",
      )
      .map(
        (item: any, index) => ({
          id:
            typeof item.id === "string"
              ? item.id
              : `lifestyle-loaded-${index}`,
          type:
            lifestyleHabitTypes.includes(
              item.type,
            )
              ? item.type
              : ("Other" as LifestyleHabitType),
          instruction:
            item.instruction,
        }),
      );
  }

  if (
    value &&
    typeof value === "object"
  ) {
    const old =
      value as Record<
        string,
        unknown
      >;

    const migrated: LifestylePlan =
      [];

    const add = (
      type: LifestyleHabitType,
      key: string,
    ) => {
      const instruction =
        typeof old[key] === "string"
          ? old[key].trim()
          : "";

      if (!instruction) return;

      migrated.push({
        id: `lifestyle-migrated-${key}`,
        type,
        instruction,
      });
    };

    add(
      "Walking",
      "walkingMinutesPerDay",
    );
    add(
      "Exercise",
      "exercisePlan",
    );
    add(
      "Nutrition",
      "allowedFoods",
    );
    add(
      "Foods to Avoid",
      "avoidFoods",
    );
    add(
      "Hydration",
      "hydration",
    );
    add(
      "Sleep / Rest",
      "sleepRest",
    );
    add(
      "Restriction",
      "restrictions",
    );
    add(
      "Other",
      "notes",
    );

    return migrated;
  }

  return [];
}


export function persistPostOp(
  id: string,
  value: PostOpState,
) {
  localStorage.setItem(
    `post-op-${id}`,
    JSON.stringify(value),
  );
}


export function loadPostOp(
  id: string,
): PostOpState {
  const raw =
    localStorage.getItem(
      `post-op-${id}`,
    );

  if (!raw) {
    return {
      ...EMPTY_STATE,
      medications: [],
      followUps: [],
      lifestyle: [...EMPTY_LIFESTYLE],
      surgeonReport: "",
      visits: [],
    };
  }

  try {
    const parsed =
      JSON.parse(raw);

    return {
      condition:
        isCondition(
          parsed.condition,
        )
          ? parsed.condition
          : "Stable",
      painLevel:
        typeof parsed.painLevel ===
        "number"
          ? Math.max(
              0,
              Math.min(
                10,
                parsed.painLevel,
              ),
            )
          : 2,
      woundStatus:
        typeof parsed.woundStatus ===
        "string"
          ? parsed.woundStatus
          : "Healing normally",
      instructions:
        typeof parsed.instructions ===
        "string"
          ? parsed.instructions
          : "",
      medications:
        Array.isArray(
          parsed.medications,
        )
          ? parsed.medications.map(
              (item: any) => ({
                ...item,
                stopReason:
                  typeof item?.stopReason ===
                  "string"
                    ? item.stopReason
                    : "",
              }),
            )
          : [],
      followUps:
        Array.isArray(
          parsed.followUps,
        )
          ? parsed.followUps.map(
              (item: any) => ({
                ...item,
                result:
                  typeof item?.result ===
                  "string"
                    ? item.result
                    : "",
              }),
            )
          : [],
      lifestyle:
        normalizeLifestylePlan(
          parsed.lifestyle,
        ),
      surgeonReport:
        typeof parsed.surgeonReport === "string"
          ? parsed.surgeonReport
          : "",
      visits:
        Array.isArray(
          parsed.visits,
        )
          ? parsed.visits.map(
              (visit: any) => ({
                ...visit,
                time:
                  typeof visit?.time ===
                  "string"
                    ? visit.time
                    : "",
                result:
                  typeof visit?.result ===
                  "string"
                    ? visit.result
                    : "",
              }),
            )
          : [],
      /*
       * Discharge confirmation is intentionally reset on refresh.
       * The clinical plan stays saved, but the user must explicitly
       * re-confirm discharge readiness in the current page session.
       */
      dischargeChecklist: {
        medicationsReviewed: false,
        followUpsArranged: false,
        instructionsProvided: false,
      },
      discharged: false,
      dischargedAt: null,
    };
  } catch {
    return {
      ...EMPTY_STATE,
      medications: [],
      followUps: [],
      lifestyle: [...EMPTY_LIFESTYLE],
      surgeonReport: "",
      visits: [],
    };
  }
}


export function createSarahDemoState(): PostOpState {
  return {
    condition: "Improving",
    painLevel: 3,
    woundStatus:
      "Clean, dry, healing normally",
    instructions:
      "Continue wound care, avoid strenuous activity, and return earlier for fever, worsening pain, or unusual swelling.",
    medications: [
      {
        id: "med-sarah-1",
        name: "Paracetamol",
        dose: "500 mg",
        frequency:
          "Every 6 hours PRN",
        duration: "5 days",
        status: "Active",
      stopReason: "",
      },
      {
        id: "med-sarah-2",
        name: "Amoxicillin / Clavulanate",
        dose: "625 mg",
        frequency:
          "Every 8 hours",
        duration: "7 days",
        status: "Active",
      stopReason: "",
      },
      {
        id: "med-sarah-3",
        name: "Saline Nasal Spray",
        dose: "2 sprays",
        frequency:
          "4 times daily",
        duration: "14 days",
        status: "Active",
      stopReason: "",
      },
    ],
    followUps: [
      {
        id: "order-sarah-1",
        type: "Lab Test",
        name: "Complete Blood Count",
        dueDate: "2026-09-12",
        status: "Requested",
        result: "",
      },
      {
        id: "order-sarah-2",
        type: "X-Ray",
        name: "Nasal Bone X-Ray",
        dueDate: "2026-09-15",
        status: "Scheduled",
        result: "",
      },
      {
        id: "order-sarah-3",
        type: "MRI",
        name: "MRI if persistent obstruction",
        dueDate: "2026-09-22",
        status: "Requested",
        result: "",
      },
    ],
    lifestyle: [
      {
        id: "lifestyle-sarah-1",
        type: "Walking",
        instruction:
          "20–30 minutes twice daily as tolerated.",
      },
      {
        id: "lifestyle-sarah-2",
        type: "Exercise",
        instruction:
          "Light walking and gentle stretching only.",
      },
      {
        id: "lifestyle-sarah-3",
        type: "Nutrition",
        instruction:
          "Protein-rich meals, vegetables, fruit and soft low-sodium foods.",
      },
      {
        id: "lifestyle-sarah-4",
        type: "Foods to Avoid",
        instruction:
          "Avoid spicy, hard, highly salted or irritating foods.",
      },
      {
        id: "lifestyle-sarah-5",
        type: "Hydration",
        instruction:
          "Aim for around 2 L of water daily unless medically restricted.",
      },
      {
        id: "lifestyle-sarah-6",
        type: "Sleep / Rest",
        instruction:
          "Sleep 7–8 hours and keep the head elevated.",
      },
    ],
    surgeonReport:
      "<p><strong>Procedure completed successfully.</strong></p><p>Patient tolerated the procedure well. No immediate post-operative complications noted.</p>",
    visits: [
      {
        id: "visit-sarah-1",
        date: "2026-09-10",
        time: "10:00",
        status: "Completed",
        condition: "Improving",
        progress:
          "Initial wound and swelling review",
        notes:
          "Expected swelling, no bleeding, wound clean.",
        result:
          "Healing is progressing as expected. No active bleeding or signs of infection.",
      },
      {
        id: "visit-sarah-2",
        date: "2026-09-17",
        time: "11:30",
        status: "Upcoming",
        condition: "Improving",
        progress:
          "Review healing and nasal airway",
        notes: "",
        result: "",
      },
      {
        id: "visit-sarah-3",
        date: "2026-10-01",
        time: "09:30",
        status: "Upcoming",
        condition: "Improving",
        progress:
          "Evaluate final surgical progress",
        notes: "",
        result: "",
      },
    ],
    dischargeChecklist: {
      medicationsReviewed: false,
      followUpsArranged: false,
      instructionsProvided: false,
    },
    discharged: false,
    dischargedAt: null,
  };
}


export function isPostOpStateEmpty(
  state: PostOpState,
) {
  return (
    state.medications.length ===
      0 &&
    state.followUps.length === 0 &&
    state.lifestyle.length === 0 &&
    state.visits.length === 0
  );
}


export function isCondition(
  value: unknown,
): value is PatientCondition {
  return [
    "Improving",
    "Stable",
    "Needs Attention",
  ].includes(
    String(value),
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

  return surgery.id
    ? demoPostOpPatientAge[
        surgery.id
      ] ?? "—"
    : "—";
}


export function getProcedureItems(
  surgery: any,
): PostOpProcedureItem[] {
  if (
    Array.isArray(
      surgery.procedures,
    )
  ) {
    const items =
      surgery.procedures
        .map((item: any) => {
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
              typeof name ===
              "string"
            ) {
              return {
                name,
                site:
                  typeof site ===
                  "string"
                    ? site
                    : undefined,
              };
            }
          }

          return null;
        })
        .filter(
          (
            item: PostOpProcedureItem | null,
          ): item is PostOpProcedureItem =>
            item !== null,
        );

    if (items.length > 0) {
      return items;
    }
  }

  const fallbackSitesRaw =
    surgery.procedureSites ??
    surgery.sites ??
    surgery.procedureSide;

  const fallbackSites =
    Array.isArray(
      fallbackSitesRaw,
    )
      ? fallbackSitesRaw
          .map(
            (value: unknown) =>
              typeof value ===
              "string"
                ? value
                : "",
          )
          .filter(Boolean)
      : typeof fallbackSitesRaw ===
          "string"
        ? fallbackSitesRaw
            .split(",")
            .map(
              (value: string) =>
                value.trim(),
            )
            .filter(Boolean)
        : [];

  return [
    {
      name:
        surgery.procedure ||
        "Procedure",
      site: fallbackSites[0],
    },
  ];
}


export function getProcedureNames(
  surgery: any,
) {
  return getProcedureItems(
    surgery,
  ).map((item) => item.name);
}


export function stripHtml(
  value: string,
) {
  return value
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .trim();
}


export function createId(
  prefix: string,
) {
  return `${prefix}-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 7)}`;
}


export function formatShortDate(
  value: string,
) {
  if (!value) return "Not set";

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


export function getNextVisitLabel(
  visits: PostOpVisit[],
) {
  const next =
    visits
      .filter(
        (visit) =>
          visit.status ===
          "Upcoming",
      )
      .sort((a, b) =>
        a.date.localeCompare(
          b.date,
        ),
      )[0];

  return next
    ? `${formatShortDate(
        next.date,
      )}${
        next.time
          ? ` • ${formatVisitTime(
              next.time,
            )}`
          : ""
      }`
    : "Not scheduled";
}


export function getDoctorVisitBookingCount(
  doctor: string,
  date: string,
  slot: string,
  surgeries: any[],
  existingVisits: PostOpVisit[],
) {
  if (!doctor || !date || !slot) return 0;

  const normalizedSlot =
    normalizeVisitTime(slot);

  const visitIds = new Set<string>();

  const addVisit = (visit: PostOpVisit) => {
    if (
      visit.date === date &&
      visit.status === "Upcoming" &&
      normalizeVisitTime(visit.time) === normalizedSlot
    ) {
      visitIds.add(visit.id);
    }
  };

  existingVisits.forEach(addVisit);

  surgeries.forEach((surgery) => {
    if (
      String(surgery.doctor ?? "").trim() !==
      doctor.trim()
    ) {
      return;
    }

    const state = loadPostOp(surgery.id);
    state.visits.forEach(addVisit);
  });

  return visitIds.size;
}


export function isDoctorBusyWithSurgeryAtSlot(
  doctor: string,
  date: string,
  slot: string,
  surgeries: any[],
) {
  const normalizedSlot =
    normalizeVisitTime(slot);

  return surgeries.some((surgery) => {
    if (
      String(surgery.doctor ?? "").trim() !==
      doctor.trim()
    ) {
      return false;
    }

    const rawDate =
      surgery.surgeryDate ??
      surgery.scheduledDate ??
      surgery.date ??
      surgery.scheduledAt;

    if (!rawDate) return false;

    const surgeryDate =
      String(rawDate).slice(0, 10);

    if (surgeryDate !== date) return false;

    const rawTime =
      surgery.time ??
      surgery.surgeryTime ??
      surgery.scheduledTime ??
      surgery.startTime ??
      (typeof surgery.scheduledAt === "string"
        ? surgery.scheduledAt.slice(11, 16)
        : "");

    return (
      normalizeVisitTime(rawTime) === normalizedSlot
    );
  });
}


export function getDoctorAvailableVisitSlots(
  doctor: string,
  date: string,
  surgeries: any[],
  _existingVisits: PostOpVisit[],
) {
  if (!doctor || !date) {
    return [];
  }

  const selectedDate = new Date(
    `${date}T00:00:00`,
  );

  if (
    Number.isNaN(selectedDate.getTime())
  ) {
    return [];
  }

  const today =
    formatDateInput(new Date());

  if (date < today) {
    return [];
  }

  // Demo clinic availability: Sunday unavailable.
  if (selectedDate.getDay() === 0) {
    return [];
  }

  const now = new Date();

  return POST_OP_VISIT_SLOTS.filter(
    (slot) => {
      if (
        isDoctorBusyWithSurgeryAtSlot(
          doctor,
          date,
          slot,
          surgeries,
        )
      ) {
        return false;
      }

      if (date === today) {
        const [hours, minutes] =
          slot.split(":").map(Number);

        const slotDate = new Date();
        slotDate.setHours(
          hours,
          minutes,
          0,
          0,
        );

        if (slotDate <= now) {
          return false;
        }
      }

      return true;
    },
  );
}


export function normalizeVisitTime(
  value: unknown,
) {
  if (
    typeof value !==
    "string"
  ) {
    return "";
  }

  const match =
    value
      .trim()
      .match(
        /^(\d{1,2}):(\d{2})/,
      );

  if (!match) {
    return "";
  }

  return `${String(
    Number(match[1]),
  ).padStart(2, "0")}:${String(
    Number(match[2]),
  ).padStart(2, "0")}`;
}


export function formatVisitTime(
  value: string,
) {
  const normalized =
    normalizeVisitTime(
      value,
    );

  if (!normalized) {
    return "—";
  }

  const [
    hours,
    minutes,
  ] = normalized
    .split(":")
    .map(Number);

  const date =
    new Date();

  date.setHours(
    hours,
    minutes,
    0,
    0,
  );

  return date.toLocaleTimeString(
    "en-US",
    {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    },
  );
}


export function addDays(
  date: Date,
  days: number,
) {
  const copy =
    new Date(date);

  copy.setDate(
    copy.getDate() + days,
  );

  return copy;
}


export function formatDateInput(
  date: Date,
) {
  const year =
    date.getFullYear();

  const month =
    String(
      date.getMonth() + 1,
    ).padStart(2, "0");

  const day =
    String(
      date.getDate(),
    ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}
