import {
  useMemo,
  useState
} from "react";
import {
  LoadingPanel
} from "../../../shared/components/LoadingPanel";
import {
  StatusMessage
} from "../../../shared/components/StatusMessage";
import {
  useProfessionRecipes
} from "../hooks/useProfessionRecipes";
import type {
  ProfessionDetail
} from "../types/professionDetail.types";
import {
  ProfessionCrafterCharacterPanel
} from "./ProfessionCrafterCharacterPanel";
import {
  createCrafterSummaries
} from "./professionCrafterView.helpers";

type ProfessionCrafterWorkspaceProps = {
  detail: ProfessionDetail;
  professionId: string;
};

export function ProfessionCrafterWorkspace({
  detail,
  professionId
}: ProfessionCrafterWorkspaceProps) {
  const {
    catalog,
    isLoading,
    error
  } =
    useProfessionRecipes(
      professionId
    );

  const [
    selectedCharacterId,
    setSelectedCharacterId
  ] =
    useState(
      detail.characters[0]
        ?.character.id ??
        ""
    );

  const summaries =
    useMemo(
      () =>
        createCrafterSummaries(
          detail.characters,
          catalog?.items ?? []
        ),
      [
        catalog,
        detail.characters
      ]
    );

  const selectedSummary =
    summaries.find(
      (summary) =>
        summary.coverage
          .character.id ===
        selectedCharacterId
    ) ??
    summaries[0] ??
    null;

  return (
    <section className="profession-crafter-workspace">
      <div className="profession-detail-section-heading">
        <div>
          <p className="eyebrow">
            CRAFTER
          </p>

          <h2>
            Who can craft what?
          </h2>
        </div>

        <p>
          Recipes, craft safety and
          required material quality.
        </p>
      </div>

      {error && (
        <StatusMessage type="error">
          {error}
        </StatusMessage>
      )}

      {isLoading ? (
        <LoadingPanel />
      ) : !catalog ? null : (
        <>
          {summaries.length ===
          0 ? (
            <section className="panel">
              <div className="empty-state">
                This profession currently has
                no assigned crafter.
              </div>
            </section>
          ) : (
            <>
              <section className="panel profession-crafter-picker">
                {summaries.map(
                  (summary) => {
                    const character =
                      summary.coverage
                        .character;

                    const selected =
                      selectedSummary
                        ?.coverage
                        .character.id ===
                      character.id;

                    return (
                      <button
                        className={
                          selected
                            ? "profession-crafter-picker-button active"
                            : "profession-crafter-picker-button"
                        }
                        key={
                          summary.coverage
                            .characterProfessionId
                        }
                        onClick={
                          () =>
                            setSelectedCharacterId(
                              character.id
                            )
                        }
                        type="button"
                      >
                        <span className="profession-crafter-picker-avatar">
                          {
                            character.name
                              .slice(
                                0,
                                2
                              )
                              .toUpperCase()
                          }
                        </span>

                        <span>
                          <strong>
                            {
                              character.name
                            }
                          </strong>

                          <small>
                            {
                              summary.entries
                                .length
                            }
                            {" Recipes · "}
                            {
                              summary.safeCount
                            }
                            {" safe"}
                          </small>
                        </span>
                      </button>
                    );
                  }
                )}
              </section>

              {selectedSummary && (
                <ProfessionCrafterCharacterPanel
                  key={
                    selectedSummary
                      .coverage
                      .character.id
                  }
                  summary={
                    selectedSummary
                  }
                />
              )}
            </>
          )}
        </>
      )}
    </section>
  );
}