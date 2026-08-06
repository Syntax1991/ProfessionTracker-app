import { useState } from "react";
import { LoadingPanel } from "../../../shared/components/LoadingPanel";
import { PageHeader } from "../../../shared/components/PageHeader";
import { StatusMessage } from "../../../shared/components/StatusMessage";
import { useProfessions } from "../../professions/hooks/useProfessions";
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
      `${character.name} wirklich löschen?`
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
        description="Verwalte deine Crafter und ihre beiden Primärberufe."
        eyebrow="CHARAKTERFLOTTE"
        title="Charaktere"
      />

      {(error || professionsError) && (
        <StatusMessage type="error">
          {error ??
            professionsError ??
            "Unbekannter Fehler"}
        </StatusMessage>
      )}

      <div className="characters-layout">
        <section className="panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">
                {editingCharacter
                  ? "BEARBEITEN"
                  : "NEUER CRAFTER"}
              </p>

              <h2>
                {editingCharacter
                  ? editingCharacter.name
                  : "Charakter hinzufügen"}
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
                ÜBERSICHT
              </p>

              <h2>
                {characters.length} Charaktere
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