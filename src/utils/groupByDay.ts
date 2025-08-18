import { formatDateMDY } from './formatDateMDY';

export interface HasDate { matchDate: string; }

export type DayGroup<T extends HasDate = HasDate> = {
  key: string; // YYYY-MM-DD
  dayText: string; // M/DD/YY header text
  items: T[];
};

export const groupByDay = <T extends HasDate>(items: T[]): DayGroup<T>[] => {
  const byKey = new Map<string, { sampleDateISO: string; items: T[] }>();
  for (const it of items) {
    const d = new Date(it.matchDate);
    if (isNaN(d.getTime())) continue;
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const key = `${yyyy}-${mm}-${dd}`;
    const entry = byKey.get(key) ?? { sampleDateISO: d.toISOString(), items: [] };
    entry.items.push(it);
    // Keep the latest sample ISO for header formatting if needed
    entry.sampleDateISO = d.toISOString();
    byKey.set(key, entry);
  }

  const groups: DayGroup<T>[] = [];
  for (const [key, { sampleDateISO, items }] of byKey.entries()) {
    const dayText = formatDateMDY(sampleDateISO);
    groups.push({ key, dayText, items });
  }

  // Sort groups by date desc (newest first)
  groups.sort((a, b) => (a.key < b.key ? 1 : a.key > b.key ? -1 : 0));
  return groups;
};
