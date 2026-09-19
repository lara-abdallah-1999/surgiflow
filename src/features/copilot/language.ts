/** Explicit workflow phrase translation. It does not translate clinical narratives. */
export function normalizeArabic(value: string) {
  return value.normalize("NFKC").replace(/[\u064B-\u065F\u0670\u0640]/g, "").replace(/[أإآ]/g, "ا").replace(/ى/g, "ي").replace(/ة/g, "ه").replace(/[٠-٩]/g, (digit) => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit))).replace(/[۰-۹]/g, (digit) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit))).toLowerCase().trim();
}

const phrases: Record<string, string> = {};
const add = (english: string, arabic: string[]) => arabic.forEach((phrase) => { phrases[normalizeArabic(phrase)] = english; });
add("Brief me", ["اعطني ملخص", "لخص الحالة", "لخص حالة المريض", "ملخص الحالة", "عطيني ملخص"]);
add("What is next?", ["ما هي الخطوة التالية", "شو الخطوة الجاية", "ماذا افعل الان", "شو لازم اعمل"]);
add("What is missing?", ["ما الذي ينقص", "ما هي النواقص", "شو ناقص", "ما الذي يمنع العملية", "شو باقي"]);
add("Payment status", ["حالة الدفع", "هل تم الدفع", "المريض دفع"]);
add("What allergies are recorded?", ["ما هي حساسية المريض", "شو حساسية المريض", "اعرض الحساسية"]);
add("What procedures are planned?", ["ما هي العمليات المخططة", "شو العملية", "اعرض الاجراءات"]);
add("Who is the surgeon?", ["من هو الجراح", "مين الدكتور", "مين الجراح"]);
add("Open Cashier", ["افتح المحاسبة", "افتح الكاشير", "افتح الدفع", "روح على المحاسبة"]);
add("Open Pre-Op", ["افتح ما قبل العملية", "افتح التحضير", "روح على التحضير"]);
add("Open Surgery", ["افتح العملية", "افتح الجراحة"]);
add("Open Recovery", ["افتح الافاقة", "افتح التعافي", "روح على الافاقة"]);
add("Show Equipment", ["اعرض المعدات", "افتح المعدات"]);
add("Take me to the next step", ["افتح الخطوة التالية", "خذني للخطوة التالية"]);
add("Which recovery checks remain?", ["ما هي فحوصات الافاقة المتبقية", "شو ناقص بالافاقة"]);
add("Has awakening been confirmed?", ["هل استيقظ المريض", "المريض فاق", "هل تم تاكيد الافاقة"]);
add("What equipment is still in use?", ["ما المعدات التي ما زالت قيد الاستخدام", "شو المعدات المستعملة"]);
add("How long has surgery been running?", ["كم مضى على العملية", "قديش صار وقت العملية"]);
add("Can I end surgery?", ["هل يمكن انهاء العملية", "فيني انهي العملية"]);
add("Draft a handoff", ["جهز مسودة تسليم", "اكتب مسودة تسليم"]);
add("Draft a case summary", ["اكتب ملخص الحالة", "جهز ملخص الحالة"]);
add("Start surgery", ["ابدأ العملية", "ابدأ الجراحة", "بلش العملية"]);
add("End surgery", ["انه العملية", "انهي العملية"]);
add("Confirm awakening", ["اكد افاقة المريض", "سجل افاقة المريض"]);
add("Record anesthesia", ["سجل اعطاء التخدير", "اكد اعطاء التخدير"]);
add("Record site and cut", ["سجل الموقع والشق", "سجل وقت الشق"]);
add("Mark ready for transfer", ["اكد الجاهزية للنقل", "سجل جاهز للنقل"]);
add("Confirm transfer", ["اكد نقل المريض", "سجل نقل المريض"]);

export function translateWorkflowCommand(raw: string): { command: string; translated: boolean; narrativePreserved?: boolean } {
  const text = normalizeArabic(raw).replace(/[.!?؟،]+$/, "").replace(/^(من فضلك|لو سمحت)\s+/, "");
  const command = phrases[text];
  if (command) return { command, translated: true };
  const dictated = raw.trim().match(/^(?:أضف|اضف|سجل|اكتب)\s+ملاحظة\s+(الإفاقة|الافاقة|التعافي|العملية)\s*[:：]\s*([\s\S]+)$/);
  if (dictated) return { command: `Add ${dictated[1] === "العملية" ? "intraoperative" : "recovery"} note: ${dictated[2]}`, translated: true, narrativePreserved: true };
  return { command: raw, translated: false };
}
