import { useState } from "react";
import { PageHeader } from "../../../../../apps/web/src/shared/components/PageHeader";
import { Tabs } from "../../../../../apps/web/src/shared/components/Tabs";
import {
  getLootCatalogForRaid,
  groupLootByBoss,
  groupLootBySlot,
  lootCatalog
} from "../../../shared/catalog/lootCatalog";

type LootTableViewTab = "slot" | "encounter";

const tabs: Array<{
  id: LootTableViewTab;
  label: string;
}> = [
  {
    id: "slot",
    label: "By Item Slot"
  },
  {
    id: "encounter",
    label: "By Encounter"
  }
];

const slotLabels: Record<string, string> = {
  HEAD: "Head",
  NECK: "Neck",
  SHOULDER: "Shoulder",
  BACK: "Back",
  CHEST: "Chest",
  WRIST: "Wrist",
  HANDS: "Hands",
  GLOVES: "Gloves",
  WAIST: "Waist",
  LEGS: "Legs",
  FEET: "Feet",
  FINGER_1: "Finger",
  TRINKET: "Trinket",
  MAIN_HAND: "One-Hand",
  OFF_HAND: "Off-Hand",
  TWOHAND: "Two-Hand",
  RANGED: "Ranged",
  MISCELLANEOUS: "Miscellaneous"
};

export function LootTablePage() {
  const [activeTab, setActiveTab] =
    useState<LootTableViewTab>("slot");

  const raid = lootCatalog[0] ?? null;

  const items = raid
    ? getLootCatalogForRaid(
        raid.raidKey
      )
    : [];

  const groups =
    activeTab === "slot"
      ? groupLootBySlot(items).map(
          (group) => ({
            heading:
              slotLabels[
                group.slot
              ] ?? group.slot,
            items: group.items
          })
        )
      : groupLootByBoss(items).map(
          (group) => ({
            heading:
              group.bossName,
            items: group.items
          })
        );

  return (
    <div>
      <PageHeader
        description={
          raid
            ? `Where items drop in ${raid.raidKey.replaceAll("_", " ")}.`
            : "No loot catalog available yet."
        }
        eyebrow="LOOT"
        title="Loot Table"
      />

      {raid && (
        <>
          <Tabs
            activeTab={activeTab}
            ariaLabel="Loot Table view"
            onChange={setActiveTab}
            tabs={tabs}
          />

          <div className="app-tab-content">
            {groups.map((group) => (
              <section
                className="panel"
                key={group.heading}
              >
                <div className="panel-header">
                  <div>
                    <p className="eyebrow">
                      {activeTab ===
                      "slot"
                        ? "SLOT"
                        : "ENCOUNTER"}
                    </p>

                    <h2>
                      {group.heading}
                    </h2>
                  </div>
                </div>

                <div className="table-scroll">
                  <table>
                    <thead>
                      <tr>
                        <th>
                          Item
                        </th>

                        <th>
                          {activeTab ===
                          "slot"
                            ? "Boss"
                            : "Slot"}
                        </th>

                        <th>
                          Tier token
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {group.items.map(
                        (item) => (
                          <tr
                            key={
                              item.id
                            }
                          >
                            <td>
                              {item.name}
                            </td>

                            <td>
                              {activeTab ===
                              "slot"
                                ? item.bossName
                                : (slotLabels[
                                    item
                                      .slot
                                  ] ??
                                  item.slot)}
                            </td>

                            <td>
                              {item.tierSlot
                                ? item.tierSlot ===
                                  "ANY"
                                  ? "Flexible"
                                  : slotLabels[
                                      item
                                        .tierSlot
                                    ] ??
                                    item.tierSlot
                                : "—"}
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
