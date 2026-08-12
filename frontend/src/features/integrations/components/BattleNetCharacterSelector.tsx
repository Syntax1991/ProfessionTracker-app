import {
  useBattleNetCharacterSelection
} from "../hooks/useBattleNetCharacterSelection";
import type {
  BattleNetCharacterPreview
} from "../types/battlenet.types";
import {
  BattleNetCharacterFilters
} from "./BattleNetCharacterFilters";
import {
  BattleNetCharacterTable
} from "./BattleNetCharacterTable";

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

  const visibleCount =
    selection
      .visibleCharacters
      .length;

  return (
    <section className="panel battlenet-selector">
      <div className="panel-header">
        <div>
          <p className="eyebrow">
            CHARACTER SELECTION
          </p>

          <h2>
            {selection.selectedCount}
            {" von "}
            {visibleCount}
            {" visible selected"}
          </h2>
        </div>

        <button
          className="button button-primary"
          disabled={
            isImporting ||
            selection.selectedCount ===
              0
          }
          onClick={() => {
            void onImport(
              selection
                .selectedCharacterKeys
            );
          }}
          type="button"
        >
          {isImporting
            ? "Syncing…"
            : `${selection.selectedCount} visible characters`}
        </button>
      </div>

      <div className="battlenet-selector-content">
        <BattleNetCharacterFilters
          classes={
            selection.classes
          }
          className={
            selection.className
          }
          minimumLevel={
            selection.minimumLevel
          }
          onClassChange={
            selection.setClassName
          }
          onMinimumLevelChange={
            selection
              .setMinimumLevel
          }
          onRealmChange={
            selection.setRealm
          }
          onSearchChange={
            selection.setSearch
          }
          realm={
            selection.realm
          }
          realms={
            selection.realms
          }
          search={
            selection.search
          }
        />

        <div className="selection-toolbar">
          <span>
            {visibleCount}
            {" visible"}

            {selection
              .hiddenSelectedCount >
              0 && (
              <>
                {" · "}
                {
                  selection
                    .hiddenSelectedCount
                }
                {" outside the filter will not be synced"}
              </>
            )}
          </span>

          <div>
            <button
              className="text-button"
              onClick={
                selection.selectVisible
              }
              type="button"
            >
              Select visible
            </button>

            <button
              className="text-button"
              onClick={
                selection.clearVisible
              }
              type="button"
            >
              Deselect visible
            </button>

            <button
              className="text-button danger"
              onClick={
                selection.clearSelection
              }
              type="button"
            >
              Clear selection
            </button>
          </div>
        </div>
      </div>

      <BattleNetCharacterTable
        characters={
          selection
            .visibleCharacters
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