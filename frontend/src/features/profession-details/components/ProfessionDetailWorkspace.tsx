import {
  useState
} from "react";
import type {
  ProfessionDetail
} from "../types/professionDetail.types";
import {
  ProfessionCapabilityMatrix
} from "./ProfessionCapabilityMatrix";
import {
  ProfessionCharacterCard
} from "./ProfessionCharacterCard";
import {
  ProfessionCoverageMatrix
} from "./ProfessionCoverageMatrix";
import {
  ProfessionRecipeFinder
} from "./ProfessionRecipeFinder";

type ProfessionDetailWorkspaceProps = {
  detail: ProfessionDetail;
  professionId: string;
};

type ProfessionDetailTab =
  | "overview"
  | "recipes"
  | "crafters"
  | "slots";

export function ProfessionDetailWorkspace({
  detail,
  professionId
}: ProfessionDetailWorkspaceProps) {
  const [
    activeTab,
    setActiveTab
  ] =
    useState<ProfessionDetailTab>(
      "overview"
    );

  const tabs: Array<{
    id: ProfessionDetailTab;
    label: string;
    count: number;
  }> = [
    {
      id: "overview",
      label: "Übersicht",
      count:
        detail.summary
          .coveredCapabilityCount
    },
    {
      id: "recipes",
      label: "Rezepte",
      count:
        detail.summary
          .catalogRecipeCount
    },
    {
      id: "crafters",
      label: "Crafter",
      count:
        detail.summary
          .characterCount
    },
    {
      id: "slots",
      label: "Slots",
      count:
        detail.summary
          .slotCount
    }
  ];

  return (
    <>
      <section className="profession-detail-summary-grid">
        <article className="panel profession-detail-summary-card">
          <span>
            Charaktere
          </span>

          <strong>
            {
              detail.summary
                .characterCount
            }
          </strong>

          <small>
            {
              detail.summary
                .trackedCharacterCount
            }
            {" erfasst"}
          </small>
        </article>

        <article className="panel profession-detail-summary-card">
          <span>
            Fähigkeiten
          </span>

          <strong>
            {
              detail.summary
                .coveredCapabilityCount
            }
            {"/"}
            {
              detail.summary
                .catalogCapabilityCount
            }
          </strong>

          <small>
            accountweit
          </small>
        </article>

        <article className="panel profession-detail-summary-card">
          <span>
            Rezepte
          </span>

          <strong>
            {
              detail.summary
                .learnedRecipeCount
            }
          </strong>

          <small>
            {
              detail.summary
                .catalogRecipeCount
            }
            {" im Katalog"}
          </small>
        </article>

        <article className="panel profession-detail-summary-card">
          <span>
            Slots
          </span>

          <strong>
            {
              detail.summary
                .slotCount
            }
          </strong>

          <small>
            abgedeckt
          </small>
        </article>
      </section>

      <nav
        aria-label="Berufsdetail"
        className="panel profession-detail-tabs"
        role="tablist"
      >
        {tabs.map(
          (tab) => (
            <button
              aria-selected={
                activeTab ===
                tab.id
              }
              className={
                activeTab ===
                tab.id
                  ? "profession-detail-tab active"
                  : "profession-detail-tab"
              }
              key={tab.id}
              onClick={
                () =>
                  setActiveTab(
                    tab.id
                  )
              }
              role="tab"
              type="button"
            >
              <span>
                {tab.label}
              </span>

              <strong>
                {tab.count}
              </strong>
            </button>
          )
        )}
      </nav>

      <div
        className="profession-detail-tab-content"
        role="tabpanel"
      >
        {activeTab ===
          "overview" && (
          <ProfessionCapabilityMatrix
            detail={detail}
          />
        )}

        {activeTab ===
          "recipes" && (
          <ProfessionRecipeFinder
            professionId={
              professionId
            }
          />
        )}

        {activeTab ===
          "slots" && (
          <ProfessionCoverageMatrix
            detail={detail}
          />
        )}

        {activeTab ===
          "crafters" && (
          <section className="profession-detail-character-section profession-detail-character-tab">
            <div className="profession-detail-section-heading">
              <div>
                <p className="eyebrow">
                  CRAFTER
                </p>

                <h2>
                  Charaktere
                </h2>
              </div>

              <p>
                {
                  detail.summary
                    .missingCharacterCount
                }
                {
                  " Charaktere ohne vollständige Craft-Daten."
                }
              </p>
            </div>

            {detail.characters.length ===
            0 ? (
              <section className="panel">
                <div className="empty-state">
                  Diesem Beruf ist noch
                  kein Charakter
                  zugewiesen.
                </div>
              </section>
            ) : (
              <div className="profession-character-list">
                {detail.characters.map(
                  (coverage) => (
                    <ProfessionCharacterCard
                      coverage={
                        coverage
                      }
                      key={
                        coverage
                          .characterProfessionId
                      }
                    />
                  )
                )}
              </div>
            )}
          </section>
        )}
      </div>
    </>
  );
}