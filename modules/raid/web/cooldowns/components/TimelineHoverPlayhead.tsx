import type { CSSProperties } from "react";
import {
  formatSeconds,
  percentOf
} from "../utils/timelineFormat";

type TimelineHoverPlayheadProps = {
  seconds: number | null;
  fightDurationSeconds: number;
  isDragging: boolean;
};

/**
 * One playhead, owned by TimelineGrid, spanning every row (boss
 * ability rows and raider cooldown rows alike) instead of a separate
 * listener/line per row. Driven by either hover or an active drag —
 * the caller resolves which seconds value wins.
 */
export function TimelineHoverPlayhead({
  seconds,
  fightDurationSeconds,
  isDragging
}: TimelineHoverPlayheadProps) {
  if (seconds === null) {
    return null;
  }

  return (
    <div
      className={
        isDragging
          ? "cooldown-timeline-playhead is-dragging"
          : "cooldown-timeline-playhead"
      }
      style={
        {
          left: `${percentOf(seconds, fightDurationSeconds)}%`
        } as CSSProperties
      }
    >
      <span className="cooldown-timeline-playhead-time">
        {formatSeconds(seconds)}
      </span>
    </div>
  );
}
