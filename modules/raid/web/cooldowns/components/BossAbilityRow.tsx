import type { CSSProperties } from "react";
import type { RaidBossAbilityCast } from "../types/cooldown.types";
import {
  formatSeconds,
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
  return (
    <div className="cooldown-timeline-row cooldown-timeline-row-boss">
      <div
        className="cooldown-timeline-row-label"
        title={abilityName}
      >
        {abilityName}
      </div>

      <div className="cooldown-timeline-row-track cooldown-timeline-row-track-readonly">
        {casts.map((cast) => (
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
        ))}
      </div>
    </div>
  );
}
