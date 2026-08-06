import {
  Link,
  useParams
} from "react-router-dom";
import { LoadingPanel } from "../../../shared/components/LoadingPanel";
import { PageHeader } from "../../../shared/components/PageHeader";
import { StatusMessage } from "../../../shared/components/StatusMessage";
import { CharacterProfessionSpecializations } from "../components/CharacterProfessionSpecializations";
import { useCharacterSpecializations } from "../hooks/useCharacterSpecializations";

export function CharacterSpecializationsPage() {
  const {
    characterId
  } = useParams<{
    characterId: string;
  }>();

  const {
    overview,
    ranks,
    isLoading,
    savingProfessionId,
    error,
    setNodeRank,
    saveProfession
  } =
    useCharacterSpecializations(
      characterId
    );

  if (!characterId) {
    return (
      <>
        <PageHeader
          eyebrow="SPEZIALISIERUNGEN"
          title="Berufsspezialisierungen"
        />

        <StatusMessage type="error">
          Die Charakter-ID fehlt.
        </StatusMessage>
      </>
    );
  }

  if (
    isLoading ||
    !overview
  ) {
    return (
      <>
        <PageHeader
          eyebrow="SPEZIALISIERUNGEN"
          title="Berufsspezialisierungen"
        />

        {error ? (
          <StatusMessage type="error">
            {error}
          </StatusMessage>
        ) : (
          <LoadingPanel />
        )}
      </>
    );
  }

  return (
    <>
      <PageHeader
        actions={
          <Link
            className="button button-secondary"
            to="/characters"
          >
            Zurück zu Charakteren
          </Link>
        }
        description={
          `${overview.character.className} · ${overview.character.realm} · Level ${overview.character.level}`
        }
        eyebrow="SPEZIALISIERUNGEN"
        title={
          overview.character.name
        }
      />

      {error && (
        <StatusMessage type="error">
          {error}
        </StatusMessage>
      )}

      {overview.professions.length === 0 ? (
        <section className="panel">
          <div className="empty-state">
            Dieser Charakter besitzt noch keine hinterlegten Primärberufe.
          </div>
        </section>
      ) : (
        overview.professions.map(
          (profession) => (
            <CharacterProfessionSpecializations
              isSaving={
                savingProfessionId ===
                profession.id
              }
              key={
                profession.id
              }
              onRankChange={
                setNodeRank
              }
              onSave={() => {
                void saveProfession(
                  profession.id
                );
              }}
              profession={
                profession
              }
              ranks={
                ranks
              }
            />
          )
        )
      )}
    </>
  );
}