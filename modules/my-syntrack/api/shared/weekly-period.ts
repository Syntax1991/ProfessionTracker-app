export type WeeklyPeriod = {
  key: string;
  startsAt: string;
  endsAt: string;
};

const weeklyResetDay = 3;
const weeklyResetHourUtc = 7;
const weekInMilliseconds =
  7 * 24 * 60 * 60 * 1000;

function createResetOnDate(
  reference: Date
) {
  return new Date(
    Date.UTC(
      reference.getUTCFullYear(),
      reference.getUTCMonth(),
      reference.getUTCDate(),
      weeklyResetHourUtc
    )
  );
}

export function getWeeklyPeriod(
  now = new Date()
): WeeklyPeriod {
  const daysSinceReset =
    (now.getUTCDay() -
      weeklyResetDay +
      7) %
    7;
  const startsAt =
    createResetOnDate(now);

  startsAt.setUTCDate(
    startsAt.getUTCDate() -
      daysSinceReset
  );

  if (startsAt > now) {
    startsAt.setUTCDate(
      startsAt.getUTCDate() - 7
    );
  }

  const endsAt = new Date(
    startsAt.getTime() +
      weekInMilliseconds
  );

  return {
    key: startsAt
      .toISOString()
      .slice(0, 10),
    startsAt: startsAt.toISOString(),
    endsAt: endsAt.toISOString()
  };
}
