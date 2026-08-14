import { LoadingPanel } from "../../../../../apps/web/src/shared/components/LoadingPanel";
import { StatusMessage } from "../../../../../apps/web/src/shared/components/StatusMessage";
import { useRoster } from "../../roster/hooks/useRoster";
import { GearSlotUpgradeTable } from "./GearSlotUpgradeTable";
import { useGuildGearSlots } from "../hooks/useGuildGearSlots";

export function GearUpgradesTab() {
  const {
    members,
    isLoading: isLoadingRoster,
    error: rosterError
  } = useRoster();

  const {
    gearSlots,
    isLoading: isLoadingSlots,
    error: slotsError
  } = useGuildGearSlots();

  const isLoading =
    isLoadingRoster ||
    isLoadingSlots;

  return (
    <>
      {(rosterError ||
        slotsError) && (
        <StatusMessage type="error">
          {rosterError ??
            slotsError ??
            "Unknown error"}
        </StatusMessage>
      )}

      <section className="panel guild-content-panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">
              UPGRADES
            </p>

            <h2>
              Crest Upgrade Progress
            </h2>
          </div>
        </div>

        {isLoading ? (
          <LoadingPanel />
        ) : (
          <GearSlotUpgradeTable
            gearSlots={gearSlots}
            members={members}
          />
        )}
      </section>
    </>
  );
}
