export function getBlockedCountries(): string[] {
  const raw = import.meta.env.VITE_BLOCKED_COUNTRIES || "";
  return raw
    .split(",")
    .map((c: string) => c.trim().toUpperCase())
    .filter(Boolean);
}