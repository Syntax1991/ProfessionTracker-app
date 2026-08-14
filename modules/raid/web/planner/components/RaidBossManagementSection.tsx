import { LoadingPanel } from "../../../../../apps/web/src/shared/components/LoadingPanel";
import type { GuildMember } from "../../../../guild/web/roster/types/roster.types";
import { BossForm } from "../../boss-rosters/components/BossForm";
import { BossList } from "../../boss-rosters/components/BossList";
import { BossRosterGrid } from "../../boss-rosters/components/BossRosterGrid";
import type {
  RaidBoss,
  RaidBossInput,
  RaidBossRosterStatus
} from "../../boss-rosters/types/bossRoster.types";

type RaidBossManagementSectionProps = {
  bosses: RaidBoss[];
  isLoadingBosses: boolean;
  selectedBossId: string | null;
  rosterMembers: GuildMember[];
  onAddBoss: (
    input: RaidBossInput
  ) => Promise<void>;
  onSelectBoss: (
    bossId: string
  ) => void;
  onDeleteBoss: (
    boss: RaidBoss
  ) => void;
  onSetStatus: (
    bossId: string,
    memberId: string,
    status: RaidBossRosterStatus
  ) => void;
  onClearStatus: (
    bossId: string,
    memberId: string
  ) => void;
};

export function RaidBossManagementSection({
  bosses,
  isLoadingBosses,
  selectedBossId,
  rosterMembers,
  onAddBoss,
  onSelectBoss,
  onDeleteBoss,
  onSetStatus,
  onClearStatus
}: RaidBossManagementSectionProps) {
  const selectedBoss =
    bosses.find(
      (boss) =>
        boss.id === selectedBossId
    ) ?? null;

  return (
    <div className="guild-roster-layout">
      <section className="panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">
              BOSSES
            </p>

            <h2>
              {bosses.length} Bosses
            </h2>
          </div>
        </div>

        <BossForm
          onSubmit={onAddBoss}
        />

        {isLoadingBosses ? (
          <LoadingPanel />
        ) : (
          <BossList
            bosses={bosses}
            onDelete={
              onDeleteBoss
            }
            onSelect={
              onSelectBoss
            }
            selectedBossId={
              selectedBossId
            }
          />
        )}
      </section>

      <section className="panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">
              ROSTER
            </p>

            <h2>
              {selectedBoss
                ? selectedBoss.name
                : "Select a boss"}
            </h2>
          </div>
        </div>

        {!selectedBoss ? (
          <p className="muted-text">
            Select a boss above to
            plan its roster.
          </p>
        ) : (
          <BossRosterGrid
            boss={selectedBoss}
            onClearStatus={(
              memberId
            ) =>
              onClearStatus(
                selectedBoss.id,
                memberId
              )
            }
            onSetStatus={(
              memberId,
              status
            ) =>
              onSetStatus(
                selectedBoss.id,
                memberId,
                status
              )
            }
            rosterMembers={
              rosterMembers
            }
          />
        )}
      </section>
    </div>
  );
}
