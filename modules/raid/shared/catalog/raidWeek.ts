/**
 * Real WoW weekly-reset boundaries (EU realm reset day is Wednesday —
 * matches env.ts's BATTLENET_REGION default of "eu"), used to group
 * RaidEvents/RaidSetups into a RaidWeek. Deterministic, not guessed:
 * a raid week runs Wednesday 00:00 through the following Tuesday
 * 23:59:59.999.
 */

const resetDayOfWeek = 3;

export function resolveRaidWeek(
  date: Date
): { startsAt: Date; endsAt: Date } {
  const daysSinceReset =
    (date.getDay() -
      resetDayOfWeek +
      7) %
    7;

  const startsAt = new Date(date);

  startsAt.setDate(
    startsAt.getDate() - daysSinceReset
  );

  startsAt.setHours(0, 0, 0, 0);

  const endsAt = new Date(startsAt);

  endsAt.setDate(endsAt.getDate() + 6);

  endsAt.setHours(23, 59, 59, 999);

  return { startsAt, endsAt };
}
