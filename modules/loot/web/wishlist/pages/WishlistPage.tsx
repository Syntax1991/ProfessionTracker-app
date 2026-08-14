import { LoadingPanel } from "../../../../../apps/web/src/shared/components/LoadingPanel";
import { PageHeader } from "../../../../../apps/web/src/shared/components/PageHeader";
import { StatusMessage } from "../../../../../apps/web/src/shared/components/StatusMessage";
import { lootCatalog } from "../../../shared/catalog/lootCatalog";
import { useMyWishlist } from "../hooks/useMyWishlist";
import type { LootTierStatus } from "../types/wishlist.types";

const tierSlots: Array<{
  slot: string;
  label: string;
}> = [
  { slot: "HEAD", label: "Helm" },
  { slot: "SHOULDER", label: "Shoulder" },
  { slot: "CHEST", label: "Chest" },
  { slot: "GLOVES", label: "Gloves" },
  { slot: "LEGS", label: "Legs" }
];

const trinketItems = lootCatalog
  .flatMap((raid) => raid.items)
  .filter((item) => item.slot === "TRINKET");

export function WishlistPage() {
  const {
    wishlist,
    isLoading,
    error,
    setTierStatus,
    setTrinketChoice
  } = useMyWishlist();

  const tierStatusFor = (
    slot: string
  ): LootTierStatus | null =>
    wishlist?.tierPreferences.find(
      (pref) => pref.tierSlot === slot
    )?.status ?? null;

  const trinketItemIdFor = (
    rank: number
  ): number | null =>
    wishlist?.trinketChoices.find(
      (choice) => choice.rank === rank
    )?.itemId ?? null;

  return (
    <div>
      <PageHeader
        description="Set your tier and trinket priorities for this raid."
        eyebrow="LOOT"
        title="Wishlist"
      />

      {error && (
        <StatusMessage type="error">
          {error}
        </StatusMessage>
      )}

      {isLoading ? (
        <LoadingPanel />
      ) : (
        <>
          <section className="panel">
            <div className="panel-header">
              <div>
                <p className="eyebrow">
                  TIER PRIORITY
                </p>

                <h2>
                  Preferred / Avoid
                  per slot
                </h2>
              </div>
            </div>

            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    {tierSlots.map(
                      (tier) => (
                        <th
                          key={
                            tier.slot
                          }
                        >
                          {
                            tier.label
                          }
                        </th>
                      )
                    )}
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    {tierSlots.map(
                      (tier) => (
                        <td
                          key={
                            tier.slot
                          }
                        >
                          <select
                            onChange={(
                              event
                            ) => {
                              const value =
                                event
                                  .target
                                  .value;

                              void setTierStatus(
                                tier.slot,
                                value ===
                                  ""
                                  ? null
                                  : (value as LootTierStatus)
                              );
                            }}
                            value={
                              tierStatusFor(
                                tier.slot
                              ) ?? ""
                            }
                          >
                            <option value="">
                              Not set
                            </option>

                            <option value="PREFERRED">
                              Preferred
                            </option>

                            <option value="AVOID">
                              Avoid
                            </option>
                          </select>
                        </td>
                      )
                    )}
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="panel">
            <div className="panel-header">
              <div>
                <p className="eyebrow">
                  TRINKET PRIORITY
                </p>

                <h2>
                  1st / 2nd / 3rd
                  choice
                </h2>
              </div>
            </div>

            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>
                      1st choice
                    </th>

                    <th>
                      2nd choice
                    </th>

                    <th>
                      3rd choice
                    </th>
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    {[1, 2, 3].map(
                      (rank) => (
                        <td
                          key={rank}
                        >
                          <select
                            onChange={(
                              event
                            ) => {
                              const value =
                                event
                                  .target
                                  .value;

                              void setTrinketChoice(
                                rank,
                                value ===
                                  ""
                                  ? null
                                  : Number(
                                      value
                                    )
                              );
                            }}
                            value={
                              trinketItemIdFor(
                                rank
                              ) ?? ""
                            }
                          >
                            <option value="">
                              Not set
                            </option>

                            {trinketItems.map(
                              (
                                item
                              ) => (
                                <option
                                  key={
                                    item.itemId
                                  }
                                  value={
                                    item.itemId
                                  }
                                >
                                  {
                                    item.name
                                  }
                                  {" — "}
                                  {
                                    item.bossName
                                  }
                                </option>
                              )
                            )}
                          </select>
                        </td>
                      )
                    )}
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
