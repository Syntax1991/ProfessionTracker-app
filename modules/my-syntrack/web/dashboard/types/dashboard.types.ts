export type ProfessionCoverage = {
  id: string;
  key: string;
  name: string;
  category: string;
  assignmentCount: number;
};

export type DashboardSummary = {
  characterCount: number;
  craftingReadyCharacterCount: number;
  professionAssignmentCount: number;
  coveredProfessionCount: number;
  totalProfessionCount: number;
  minimumCraftingLevel: number;
  professionCoverage: ProfessionCoverage[];
};