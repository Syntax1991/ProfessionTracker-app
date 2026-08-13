export type RaidEventInput = {
  title: string;
  raidInstance: string;
  difficulty: string;
  scheduledAt: string;
  teamId: string | null;
  notes: string | null;
};

export type RaidEventWithTeam = {
  id: string;
  title: string;
  raidInstance: string;
  difficulty: string;
  scheduledAt: Date;
  teamId: string | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
  teamName: string | null;
};
