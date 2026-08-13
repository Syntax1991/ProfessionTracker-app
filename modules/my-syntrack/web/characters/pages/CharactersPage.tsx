import { useState } from "react";
import { LoadingPanel } from "../../../../../apps/web/src/shared/components/LoadingPanel";
import { PageHeader } from "../../../../../apps/web/src/shared/components/PageHeader";
import { StatusMessage } from "../../../../../apps/web/src/shared/components/StatusMessage";
import { useProfessions } from "../../../../professions/web/hooks/useProfessions";
import { CharacterForm } from "../components/CharacterForm";
import { CharacterTable } from "../components/CharacterTable";
import { useCharacters } from "../hooks/useCharacters";
import type {
  Character,
  CharacterInput
} from "../types/character.types";

const minimumCraftingLevel = 80;

export function CharactersPage() {
  const [
    editingCharacter,
    setEditingCharacter
  ] = useState<Character | null>(null);

  const {
    characters,
    isLoading,
    error,
    createCharacter,
    updateCharacter,
    deleteCharacter
  } = useCharacters();

  const {
    professions,
    isLoading: professionsLoading,
    error: professionsError
  } = useProfessions();

  const handleSubmit = async (
    input: CharacterInput
  ) => {
    if (editingCharacter) {
      await updateCharacter(
        editingCharacter.id,
        input
      );

      setEditingCharacter(null);
      return;
    }

    await createCharacter(input);
  };

  const handleDelete = async (
    character: Character
  ) => {
    const confirmed = window.confirm(
      `${character.name} delete?`
    );

    if (!confirmed) {
      return;
    }

    await deleteCharacter(character.id);

    if (
      editingCharacter?.id ===
      character.id
    ) {
      setEditingCharacter(null);
    }
  };

  return (
    <>
      <PageHeader
        description="Manage your crafters and their two primary professions."
        eyebrow="CRAFTER ROSTER"
        title="Characters"
      />

      {(error || professionsError) && (
        <StatusMessage type="error">
          {error ??
            professionsError ??
            "Unknown error"}
        </StatusMessage>
      )}

      <div className="characters-layout">
        <section className="panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">
                {editingCharacter
                  ? "EDIT"
                  : "NEW CRAFTER"}
              </p>

              <h2>
                {editingCharacter
                  ? editingCharacter.name
                  : "Add Character"}
              </h2>
            </div>
          </div>

          {professionsLoading ? (
            <LoadingPanel />
          ) : (
            <CharacterForm
              character={editingCharacter}
              key={
                editingCharacter?.id ??
                "new-character"
              }
              onCancel={() =>
                setEditingCharacter(null)
              }
              onSubmit={handleSubmit}
              professions={professions}
            />
          )}
        </section>

        <section className="panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">
                OVERVIEW
              </p>

              <h2>
                {characters.length} Characters
              </h2>
            </div>
          </div>

          {isLoading ? (
            <LoadingPanel />
          ) : (
            <CharacterTable
              characters={characters}
              minimumCraftingLevel={
                minimumCraftingLevel
              }
              onDelete={(character) => {
                void handleDelete(character);
              }}
              onEdit={setEditingCharacter}
            />
          )}
        </section>
      </div>
    </>
  );
}