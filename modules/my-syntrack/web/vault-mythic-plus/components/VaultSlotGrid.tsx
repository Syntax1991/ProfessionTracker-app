import type { VaultCharacter } from "../types/vaultMythicPlus.types";

type VaultSlotGridProps = {
  character: VaultCharacter;
};

export function VaultSlotGrid({
  character
}: VaultSlotGridProps) {
  return (
    <section className="vault-slot-section">
      <div className="vault-section-heading">
        <div>
          <p className="eyebrow">
            DUNGEON ROW
          </p>

          <h2>Great Vault slots</h2>
        </div>

        <p>
          Reward levels use your highest,
          fourth-highest and eighth-highest
          logged run.
        </p>
      </div>

      <div className="vault-slot-grid">
        {character.vaultSlots.map(
          (slot, index) => {
            const runsRemaining =
              Math.max(
                0,
                slot.threshold -
                  character.runs.length
              );

            return (
              <article
                className={
                  slot.unlocked
                    ? "vault-slot-card is-unlocked"
                    : "vault-slot-card"
                }
                key={slot.threshold}
              >
                <span className="vault-slot-number">
                  SLOT 0{index + 1}
                </span>

                <strong>
                  {slot.unlocked
                    ? slot.keyLevel === 0
                      ? "Mythic 0"
                      : `+${slot.keyLevel}`
                    : `${runsRemaining} ${runsRemaining === 1 ? "run" : "runs"}`}
                </strong>

                <small>
                  {slot.unlocked
                    ? `Unlocked with ${slot.threshold} ${slot.threshold === 1 ? "run" : "runs"}`
                    : `Unlocks at ${slot.threshold} ${slot.threshold === 1 ? "run" : "runs"}`}
                </small>
              </article>
            );
          }
        )}
      </div>
    </section>
  );
}
