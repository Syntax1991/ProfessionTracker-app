import type { CSSProperties } from "react";
import type { RaidBossAbilityCast } from "../types/cooldown.types";
import {
  formatSeconds,
  getWowIconUrl,
  percentOf
} from "../utils/timelineFormat";

type BossAbilityRowProps = {
  abilityName: string;
  fightDurationSeconds: number;
  casts: RaidBossAbilityCast[];
};

export function BossAbilityRow({
  abilityName,
  fightDurationSeconds,
  casts
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
        {casts.map((cast) =>
          cast.abilityIcon ? (
            <img
              alt={abilityName}
              className="cooldown-timeline-marker cooldown-timeline-boss-marker-icon"
              key={cast.id}
              src={getWowIconUrl(
                cast.abilityIcon
              )}
              style={
                {
                  left: `${percentOf(cast.timestampSeconds, fightDurationSeconds)}%`
                } as CSSProperties
              }
              title={`${abilityName} at ${formatSeconds(cast.timestampSeconds)}`}
            />
          ) : (
            <span
              className="cooldown-timeline-marker cooldown-timeline-boss-marker"
              key={cast.id}
              style={
                {
                  left: `${percentOf(cast.timestampSeconds, fightDurationSeconds)}%`
                } as CSSProperties
              }
              title={`${abilityName} at ${formatSeconds(cast.timestampSeconds)}`}
            />
          )
        )}
      </div>
    </div>
  );
}
