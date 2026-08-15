import type { CSSProperties } from "react";
import { Tooltip } from "../../../../../apps/web/src/shared/components/Tooltip";
import type {
  RaidBossAbilityCast,
  RaidBossPhaseMarker
} from "../types/cooldown.types";
import {
  formatSeconds,
  getWowIconUrl,
  percentOf
} from "../utils/timelineFormat";

type BossAbilityRowProps = {
  abilityName: string;
  fightDurationSeconds: number;
  casts: RaidBossAbilityCast[];
  phaseMarkers: RaidBossPhaseMarker[];
  isTooltipSuppressed: boolean;
};

function resolvePhaseLabel(
  timestampSeconds: number,
  phaseMarkers: RaidBossPhaseMarker[]
): string | null {
  const activePhase = [...phaseMarkers]
    .filter(
      (marker) =>
        marker.startSeconds <=
        timestampSeconds
    )
    .sort(
      (a, b) =>
        b.startSeconds -
        a.startSeconds
    )[0];

  return activePhase?.label ?? null;
}

export function BossAbilityRow({
  abilityName,
  fightDurationSeconds,
  casts,
  phaseMarkers,
  isTooltipSuppressed
}: BossAbilityRowProps) {
  const rowIcon = casts.find(
    (cast) => cast.abilityIcon
  )?.abilityIcon;

  return (
    <div className="cooldown-timeline-row cooldown-timeline-row-boss">
      <div
        className="cooldown-timeline-row-label"
        title={abilityName}
      >
        {rowIcon && (
          <img
            alt=""
            className="cooldown-timeline-row-icon"
            src={getWowIconUrl(
              rowIcon
            )}
          />
        )}

        <span>{abilityName}</span>
      </div>

      <div className="cooldown-timeline-row-track cooldown-timeline-row-track-readonly">
        {casts.map((cast, index) => {
          const phaseLabel =
            resolvePhaseLabel(
              cast.timestampSeconds,
              phaseMarkers
            );

          const previousCast =
            index > 0
              ? casts[index - 1]
              : null;

          const secondsSincePrevious =
            previousCast
              ? cast.timestampSeconds -
                previousCast.timestampSeconds
              : null;

          const tooltipContent = (
            <>
              <span className="tooltip-title">
                {cast.abilityIcon && (
                  <img
                    alt=""
                    src={getWowIconUrl(
                      cast.abilityIcon
                    )}
                  />
                )}
                {abilityName}
              </span>

              <span className="tooltip-time">
                {formatSeconds(
                  cast.timestampSeconds
                )}
              </span>

              {phaseLabel && (
                <span className="tooltip-meta">
                  {phaseLabel}
                </span>
              )}

              {secondsSincePrevious !==
                null && (
                <span className="tooltip-meta">
                  Time since last:{" "}
                  {formatSeconds(
                    secondsSincePrevious
                  )}
                </span>
              )}
            </>
          );

          const markerStyle = {
            left: `${percentOf(cast.timestampSeconds, fightDurationSeconds)}%`
          } as CSSProperties;

          return (
            <Tooltip
              anchorClassName={
                cast.abilityIcon
                  ? "cooldown-timeline-marker cooldown-timeline-boss-marker-icon"
                  : "cooldown-timeline-marker cooldown-timeline-boss-marker"
              }
              anchorStyle={
                markerStyle
              }
              content={
                tooltipContent
              }
              disabled={
                isTooltipSuppressed
              }
              key={cast.id}
            >
              {cast.abilityIcon && (
                <img
                  alt={abilityName}
                  src={getWowIconUrl(
                    cast.abilityIcon
                  )}
                />
              )}
            </Tooltip>
          );
        })}
      </div>
    </div>
  );
}
