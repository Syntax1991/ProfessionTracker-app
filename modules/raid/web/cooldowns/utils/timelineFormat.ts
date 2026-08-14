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
