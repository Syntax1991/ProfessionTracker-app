export type CharacterInput = {
  name: string;
  realm: string;
  region: string;
  className: string;
  level: number;
  professionIds: string[];
};

export type BattleNetProfessionAssignmentInput = {
  professionId: string;
  skill: number;
  knowledgePoints: number;
  specializationSummary: string | null;
};

export type BattleNetCharacterInput = {
  battleNetId: string;
  name: string;
  realm: string;
  realmSlug: string;
  region: string;
  className: string;
  level: number;
  professions: BattleNetProfessionAssignmentInput[];
};