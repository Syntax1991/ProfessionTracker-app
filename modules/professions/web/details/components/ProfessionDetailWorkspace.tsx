import {
  useState
} from "react";
import { Tabs } from "../../../../../apps/web/src/shared/components/Tabs";
import type {
  ProfessionDetail
} from "../types/professionDetail.types";
import {
  ProfessionCapabilityMatrix
} from "./ProfessionCapabilityMatrix";
import {
  ProfessionCoverageMatrix
} from "./ProfessionCoverageMatrix";
import {
  ProfessionCrafterWorkspace
} from "./ProfessionCrafterWorkspace";
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
      label: "Overview",
      count:
        detail.summary
          .coveredCapabilityCount
    },
    {
      id: "recipes",
      label: "Recipes",
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
            Characters
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
            {" captured"}
          </small>
        </article>

        <article className="panel profession-detail-summary-card">
          <span>
            Capabilities
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
            account-wide
          </small>
        </article>

        <article className="panel profession-detail-summary-card">
          <span>
            Recipes
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
            {" in catalog"}
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
            covered
          </small>
        </article>
      </section>

      <Tabs
        activeTab={activeTab}
        ariaLabel="Professionsdetail"
        onChange={setActiveTab}
        tabs={tabs}
      />

      <div
        className="app-tab-content"
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
          "crafters" && (
          <ProfessionCrafterWorkspace
            detail={detail}
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
      </div>
    </>
  );
}