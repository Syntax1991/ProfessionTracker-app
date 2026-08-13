import type { VaultCharacter } from "../types/vaultMythicPlus.types";

type VaultCharacterRosterProps = {
  characters: VaultCharacter[];
  selectedCharacterId: string;
  onSelect: (characterId: string) => void;
};

export function VaultCharacterRoster({
  characters,
  selectedCharacterId,
  onSelect
}: VaultCharacterRosterProps) {
  return (
    <section className="panel vault-roster-panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">
            VAULT ROSTER
          </p>

          <h2>Characters</h2>
        </div>

        <span className="vault-roster-count">
          {characters.length}
        </span>
      </div>

      <div className="vault-character-list">
        {characters.map((character) => {
          const unlockedSlots =
            character.vaultSlots.filter(
              (slot) => slot.unlocked
            ).length;

          return (
            <button
              aria-pressed={
                selectedCharacterId ===
                character.id
              }
              className={
                selectedCharacterId ===
                character.id
                  ? "vault-character-row is-selected"
                  : "vault-character-row"
              }
              key={character.id}
              onClick={() =>
                onSelect(character.id)
              }
              type="button"
            >
              <span className="vault-character-avatar">
                {character.name
                  .slice(0, 2)
                  .toUpperCase()}
              </span>

              <span className="vault-character-identity">
                <strong>{character.name}</strong>
                <small>
                  {character.className}
                  {" · "}
                  {character.realm}
                </small>
              </span>

              <span className="vault-character-metrics">
                <strong>
                  {unlockedSlots}/3
                </strong>
                <small>
                  {character.highestKeyLevel ===
                  null
                    ? "No runs"
                    : `Top +${character.highestKeyLevel}`}
                </small>
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
