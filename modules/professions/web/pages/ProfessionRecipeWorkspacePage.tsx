import {
  ProfessionRecipeFinder
} from "../details/components/ProfessionRecipeFinder";
import type {
  ProfessionRecipeFinderMode
} from "../details/utils/professionRecipeFinder.config";
import {
  ProfessionModuleWorkspace
} from "../shared/components/ProfessionModuleWorkspace";

type ProfessionRecipeWorkspacePageProps = {
  mode: ProfessionRecipeFinderMode;
};

const pageCopy:
  Record<
    ProfessionRecipeFinderMode,
    {
      eyebrow: string;
      title: string;
      description: string;
    }
  > = {
    catalog: {
      eyebrow: "CRAFT CATALOG",
      title: "Recipes",
      description:
        "Search the full profession catalog and compare every available crafter."
    },
    "material-quality": {
      eyebrow: "REAGENT PLANNING",
      title: "Material Quality",
      description:
        "Compare captured reagent-quality scenarios before committing expensive materials."
    },
    concentration: {
      eyebrow: "CRAFTING RESOURCE",
      title: "Concentration",
      description:
        "Identify the crafts and characters where concentration closes the quality gap."
    },
    recommendations: {
      eyebrow: "CRAFTING INTELLIGENCE",
      title: "Craft Recommendations",
      description:
        "Choose the most efficient material and concentration path for each captured craft."
    }
  };

export function ProfessionRecipeWorkspacePage({
  mode
}: ProfessionRecipeWorkspacePageProps) {
  const copy = pageCopy[mode];

  return (
    <ProfessionModuleWorkspace
      description={copy.description}
      eyebrow={copy.eyebrow}
      title={copy.title}
    >
      {(profession) => (
        <ProfessionRecipeFinder
          key={`${profession.id}-${mode}`}
          mode={mode}
          professionId={
            profession.id
          }
        />
      )}
    </ProfessionModuleWorkspace>
  );
}
