const daysPerWeek = 7;
const weeksPerGrid = 6;

export function isSameDay(
  left: Date,
  right: Date
): boolean {
  return (
    left.getFullYear() ===
      right.getFullYear() &&
    left.getMonth() ===
      right.getMonth() &&
    left.getDate() === right.getDate()
  );
}

export function isSameMonth(
  left: Date,
  right: Date
): boolean {
  return (
    left.getFullYear() ===
      right.getFullYear() &&
    left.getMonth() === right.getMonth()
  );
}

/**
 * Always returns a fixed 6x7 grid (Monday-first), same shape WoWAudit's
 * calendar uses — some cells belong to the previous/next month so the
 * grid stays a stable rectangle across every month.
 */
export function getMonthGridDays(
  monthDate: Date
): Date[] {
  const firstOfMonth = new Date(
    monthDate.getFullYear(),
    monthDate.getMonth(),
    1
  );

  const mondayFirstWeekday =
    (firstOfMonth.getDay() + 6) % 7;

  const gridStart = new Date(
    firstOfMonth.getFullYear(),
    firstOfMonth.getMonth(),
    1 - mondayFirstWeekday
  );

  return Array.from(
    {
      length:
        daysPerWeek * weeksPerGrid
    },
    (_, index) =>
      new Date(
        gridStart.getFullYear(),
        gridStart.getMonth(),
        gridStart.getDate() + index
      )
  );
}

export function addMonths(
  monthDate: Date,
  amount: number
): Date {
  return new Date(
    monthDate.getFullYear(),
    monthDate.getMonth() + amount,
    1
  );
}

export function formatMonthLabel(
  monthDate: Date
): string {
  return monthDate.toLocaleDateString(
    "en-GB",
    {
      month: "long",
      year: "numeric"
    }
  );
}

export const weekdayLabels = [
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
  "Sun"
];
