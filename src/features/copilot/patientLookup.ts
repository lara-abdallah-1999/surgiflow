import type { Surgery } from "../../types/surgery";
import { normalizeArabic } from "./language";

const digitWords: Record<string, string> = { zero: "0", one: "1", two: "2", three: "3", four: "4", five: "5", six: "6", seven: "7", eight: "8", nine: "9", صفر: "0", واحد: "1", اثنين: "2", اتنين: "2", ثلاثة: "3", ثلاثه: "3", اربعه: "4", خمسه: "5", سته: "6", سبعه: "7", ثمانيه: "8", تسعه: "9" };
export function findPatientCases(surgeries: readonly Surgery[], query: string) {
  let text = normalizeArabic(query).replace(/\b(?:open|find|patient|record|records|name|mrn|number|and|the)\b/g, " ").replace(/(?:افتح|ملف|المريض|المريضة|المريضه|اسم|رقم|السجل|الطبي|ابحث عن|ام ار ان|إم آر إن)/g, " ");
  text = text.split(/\s+/).map((token) => digitWords[token] ?? token).join(" ");
  const tokens = text.replace(/[^\p{L}\p{N}\s-]/gu, " ").trim().split(/\s+/).filter(Boolean);
  const digits = text.replace(/[^0-9]/g, "");
  return surgeries.filter((surgery) => {
    const record = surgery as Surgery & { mrn?: string; patientNameArabic?: string };
    const fields = normalizeArabic([surgery.patientName, record.patientNameArabic, surgery.id, surgery.patientId, record.mrn].filter(Boolean).join(" "));
    const exactIdentifier = digits.length >= 4 && [record.mrn, surgery.id, surgery.patientId].some((value) => value?.replace(/[^0-9]/g, "") === digits);
    // An identifier may narrow Arabic speech even if only an English name is stored.
    // The caller always asks the user to verify the resulting patient card.
    return exactIdentifier || tokens.every((token) => fields.includes(token));
  });
}
