import type { GuildMember } from "../../roster/types/roster.types";
import type { GuildMemberGearSlot } from "../types/audit.types";
import { gearSlotColumns } from "../utils/gearSlotCatalog";

type GearSlotEnchantTableProps = {
  members: GuildMember[];
  gearSlots: GuildMemberGearSlot[];
};

export function GearSlotEnchantTable({
  members,
  gearSlots
}: GearSlotEnchantTableProps) {
  const slotsByMemberId = new Map<
    string,
    Map<string, GuildMemberGearSlot>
  >();

  for (const slot of gearSlots) {
    const existing =
      slotsByMemberId.get(
        slot.memberId
      ) ?? new Map();

    existing.set(
      slot.slotKey,
      slot
    );

    slotsByMemberId.set(
      slot.memberId,
      existing
    );
  }

  if (members.length === 0) {
    return (
      <p className="muted-text">
        The guild roster is empty.
      </p>
    );
  }

  return (
    <div className="table-scroll">
      <table>
        <thead>
          <tr>
            <th>Member</th>

            {gearSlotColumns.map(
              (column) => (
                <th key={column.key}>
                  {column.label}
                </th>
              )
            )}
          </tr>
        </thead>

        <tbody>
          {members.map(
            (member) => {
              const memberSlots =
                slotsByMemberId.get(
                  member.id
                );

              return (
                <tr
                  key={member.id}
                >
                  <td>
                    {member.name}
                  </td>

                  {gearSlotColumns.map(
                    (column) => {
                      const slot =
                        memberSlots?.get(
                          column.key
                        );

                      if (
                        !slot ||
                        slot.enchantStatus ===
                          "NOT_APPLICABLE"
                      ) {
                        return (
                          <td
                            className="muted-text"
                            key={
                              column.key
                            }
                          >
                            —
                          </td>
                        );
                      }

                      return (
                        <td
                          key={
                            column.key
                          }
                          title={
                            slot.itemName ??
                            undefined
                          }
                        >
                          {slot.enchantStatus ===
                          "READY"
                            ? "✓"
                            : "✗"}
                        </td>
                      );
                    }
                  )}
                </tr>
              );
            }
          )}
        </tbody>
      </table>
    </div>
  );
}
