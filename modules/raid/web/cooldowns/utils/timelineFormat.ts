export function formatSeconds(
  totalSeconds: number
): string {
  const minutes = Math.floor(
    totalSeconds / 60
  );

  const seconds = Math.floor(
    totalSeconds % 60
  );

  return `${minutes}:${String(
    seconds
  ).padStart(2, "0")}`;
}

export function parseTimeInput(
  value: string
): number | null {
  const trimmed = value.trim();

  if (!trimmed) {
    return null;
  }

  const parts = trimmed.split(":");

  if (parts.length === 1) {
    const seconds = Number(
      parts[0]
    );

    return Number.isFinite(seconds)
      ? Math.max(
          0,
          Math.round(seconds)
        )
      : null;
  }

  if (parts.length === 2) {
    const minutes = Number(
      parts[0]
    );

    const seconds = Number(
      parts[1]
    );

    if (
      !Number.isFinite(minutes) ||
      !Number.isFinite(seconds)
    ) {
      return null;
    }

    return Math.max(
      0,
      Math.round(
        minutes * 60 + seconds
      )
    );
  }

  return null;
}

export function percentOf(
  seconds: number,
  fightDurationSeconds: number
): number {
  if (fightDurationSeconds <= 0) {
    return 0;
  }

  return Math.min(
    100,
    Math.max(
      0,
      (seconds /
        fightDurationSeconds) *
        100
    )
  );
}

export function secondsFromClickX(
  clientX: number,
  trackElement: HTMLElement,
  fightDurationSeconds: number
): number {
  const rect =
    trackElement.getBoundingClientRect();

  if (rect.width === 0) {
    return 0;
  }

  const ratio = Math.min(
    1,
    Math.max(
      0,
      (clientX - rect.left) /
        rect.width
    )
  );

  return Math.round(
    ratio * fightDurationSeconds
  );
}

export function formatRelativeTime(
  isoTimestamp: string,
  now: Date = new Date()
): string {
  const thenMs = new Date(
    isoTimestamp
  ).getTime();

  const diffSeconds = Math.max(
    0,
    Math.round(
      (now.getTime() - thenMs) / 1000
    )
  );

  if (diffSeconds < 60) {
    return "just now";
  }

  const diffMinutes = Math.floor(
    diffSeconds / 60
  );

  if (diffMinutes < 60) {
    return `${diffMinutes}m ago`;
  }

  const diffHours = Math.floor(
    diffMinutes / 60
  );

  if (diffHours < 24) {
    return `${diffHours}h ago`;
  }

  const diffDays = Math.floor(
    diffHours / 24
  );

  return `${diffDays}d ago`;
}

export function getWowIconUrl(
  icon: string
): string {
  const fileName = icon.endsWith(
    ".jpg"
  )
    ? icon
    : `${icon}.jpg`;

  return `https://wow.zamimg.com/images/wow/icons/medium/${fileName}`;
}
