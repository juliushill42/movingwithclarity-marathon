export type DayPlan = {
  day: number;
  date: string;
  label: string;
  focus: string;
};

const START = Date.parse("2026-09-22T00:00:00-05:00");

const FOCUS: Record<number, { label: string; focus: string }> = {
  1: { label: "Open the run", focus: "Publish the 193 systems. Show what each one is and why it exists." },
  2: { label: "Choose first builds", focus: "Mark the first systems to actually build. Keep guesses labeled as guesses." },
  3: { label: "Set the public record", focus: "Every chosen system gets a plain-language card people can audit." },
  4: { label: "Build day", focus: "Ship something reviewable. Screen recording when a build can be shown." },
  5: { label: "Build day", focus: "Keep the list honest. Selected is not finished." },
  6: { label: "Build day", focus: "One person. One factory. Public proof over claims." },
  7: { label: "Week 1 review", focus: "What shipped. What slipped. What still needs a recording." },
  8: { label: "Build day", focus: "Second wave of systems." },
  9: { label: "Build day", focus: "Second wave of systems." },
  10: { label: "Build day", focus: "Second wave of systems." },
  11: { label: "Build day", focus: "Second wave of systems." },
  12: { label: "Build day", focus: "Second wave of systems." },
  13: { label: "Build day", focus: "Second wave of systems." },
  14: { label: "Week 2 review", focus: "Mid-run check. Update the list. Do not inflate status." },
  15: { label: "Build day", focus: "Final wave. Close gaps that can be shown in public." },
  16: { label: "Build day", focus: "Final wave. Close gaps that can be shown in public." },
  17: { label: "Build day", focus: "Final wave. Close gaps that can be shown in public." },
  18: { label: "Build day", focus: "Final wave. Close gaps that can be shown in public." },
  19: { label: "Build day", focus: "Final wave. Close gaps that can be shown in public." },
  20: { label: "Public review", focus: "Walk the 193. Separate built, chosen, and still on paper." },
  21: { label: "Close the run", focus: "Oct 12. Publish the final public record." },
};

export function schedule(): DayPlan[] {
  return Array.from({ length: 21 }, (_, i) => {
    const day = i + 1;
    const d = new Date(START + i * 86400000);
    const date = d.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      timeZone: "America/Chicago",
    });
    const row = FOCUS[day];
    return { day, date, label: row.label, focus: row.focus };
  });
}

export function todayPlan(): DayPlan {
  const days = schedule();
  const elapsed = Math.floor((Date.now() - START) / 86400000);
  const idx = Math.min(20, Math.max(0, elapsed));
  return days[idx];
}
