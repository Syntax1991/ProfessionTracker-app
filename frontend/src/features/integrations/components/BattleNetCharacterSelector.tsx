import { BattleNetCharacterFilters } from "./BattleNetCharacterFilters";
import { BattleNetCharacterTable } from "./BattleNetCharacterTable";
import { useBattleNetCharacterSelection } from "../hooks/useBattleNetCharacterSelection";
import type { BattleNetCharacterPreview } from "../types/battlenet.types";

type BattleNetCharacterSelectorProps = {
  characters:
    BattleNetCharacterPreview[];
  defaultMinimumLevel: number;
  isImporting: boolean;
  onImport: (
    characterKeys: string[]
  ) => Promise<void>;
};

export function BattleNetCharacterSelector({
  characters,
  defaultMinimumLevel,
  isImporting,
  onImport
}: BattleNetCharacterSelectorProps) {
  const selection =
    useBattleNetCharacterSelection(
      characters,
      defaultMinimumLevel
    );

  return (
    <section className="panel battlenet-selector">
      <div className="panel-header">
        <div>
          <p className="eyebrow">
            CHARAKTERAUSWAHL
          </p>

          <h2>
            {selection.selectedCount}
            {" von "}
            {characters.length}
            {" ausgewählt"}
          </h2>
        </div>

        <button
          className="button button-primary"
          disabled={
            isImporting ||
            selection.selectedCount === 0
          }
          onClick={() => {
            void onImport(
              selection.selectedCharacterKeys
            );
          }}
          type="button"
        >
          {isImporting
            ? "Synchronisierung läuft…"
            : `${selection.selectedCount} Charaktere synchronisieren`}
        </button>
      </div>

      <div className="battlenet-selector-content">
        <BattleNetCharacterFilters
          classes={selection.classes}
          className={selection.className}
          minimumLevel={
            selection.minimumLevel
          }
          onClassChange={
            selection.setClassName
          }
          onMinimumLevelChange={
            selection.setMinimumLevel
          }
          onRealmChange={
            selection.setRealm
          }
          onSearchChange={
            selection.setSearch
          }
          realm={selection.realm}
          realms={selection.realms}
          search={selection.search}
        />

        <div className="selection-toolbar">
          <span>
            {
              selection
                .visibleCharacters
                .length
            }
            {" sichtbar"}
          </span>

          <div>
            <button
              className="text-button"
              onClick={
                selection.selectVisible
              }
              type="button"
            >
              Sichtbare auswählen
            </button>

            <button
              className="text-button"
              onClick={
                selection.clearVisible
              }
              type="button"
            >
              Sichtbare abwählen
            </button>

            <button
              className="text-button danger"
              onClick={
                selection.clearSelection
              }
              type="button"
            >
              Auswahl leeren
            </button>
          </div>
        </div>
      </div>

      <BattleNetCharacterTable
        characters={
          selection.visibleCharacters
        }
        onToggle={
          selection.toggleCharacter
        }
        selectedKeys={
          selection.selectedKeys
        }
      />
    </section>
  );
}