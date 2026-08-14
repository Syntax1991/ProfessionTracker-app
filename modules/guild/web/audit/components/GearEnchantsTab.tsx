import { LoadingPanel } from "../../../../../apps/web/src/shared/components/LoadingPanel";
import { StatusMessage } from "../../../../../apps/web/src/shared/components/StatusMessage";
import { useRoster } from "../../roster/hooks/useRoster";
import { GearSlotEnchantTable } from "./GearSlotEnchantTable";
import { useGuildGearSlots } from "../hooks/useGuildGearSlots";

export function GearEnchantsTab() {
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
              ENCHANTS
            </p>

            <h2>
              Enchant Coverage
            </h2>
          </div>
        </div>

        {isLoading ? (
          <LoadingPanel />
        ) : (
          <GearSlotEnchantTable
            gearSlots={gearSlots}
            members={members}
          />
        )}
      </section>
    </>
  );
}
