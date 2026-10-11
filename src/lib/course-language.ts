export function normalizeCourseLanguage(value?: string | null) {
  const raw = String(value ?? "").trim().toLowerCase();

  if (!raw) return "en";
  if (raw === "hi" || raw.startsWith("hi") || raw === "hindi") return "hi";
  if (raw === "en" || raw.startsWith("en") || raw === "english") return "en";

  return raw.startsWith("hi") ? "hi" : "en";
}
