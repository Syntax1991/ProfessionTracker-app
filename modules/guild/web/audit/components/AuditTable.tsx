import type { GuildMember } from "../../roster/types/roster.types";

type AuditTableProps = {
  members: GuildMember[];
};

function formatTimestamp(
  value: string | null
): string {
  if (!value) {
    return "Never";
  }

  return new Date(
    value
  ).toLocaleString();
}

export function AuditTable({
  members
}: AuditTableProps) {
  if (members.length === 0) {
    return (
      <div className="empty-state">
        No guild members yet.
      </div>
    );
  }

  const sortedMembers = [
    ...members
  ].sort(
    (left, right) =>
      (right.averageItemLevel ??
        -1) -
      (left.averageItemLevel ??
        -1)
  );

  return (
    <div className="table-scroll">
      <table>
        <thead>
          <tr>
            <th>Member</th>
            <th>Item Level</th>
            <th>Enchants</th>
            <th>Sockets</th>
            <th>Last Audited</th>
          </tr>
        </thead>

        <tbody>
          {sortedMembers.map(
            (member) => (
              <tr key={member.id}>
                <td>
                  <strong>
                    {member.name}
                  </strong>

                  <span className="guild-note">
                    {" "}
                    {member.className}
                  </span>
                </td>

                <td>
                  {member.averageItemLevel !==
                  null
                    ? Math.round(
                        member.averageItemLevel
                      )
                    : "—"}
                </td>

                <td>
                  {member.missingEnchantSlots !==
                  null ? (
                    member.missingEnchantSlots ===
                    0 ? (
                      <span className="source-badge addon">
                        All enchanted
                      </span>
                    ) : (
                      <span className="source-badge manual">
                        {
                          member.missingEnchantSlots
                        }{" "}
                        missing
                      </span>
                    )
                  ) : (
                    "—"
                  )}
                </td>

                <td>
                  {member.totalSocketCount !==
                  null
                    ? `${member.filledSocketCount ?? 0}/${member.totalSocketCount}`
                    : "—"}
                </td>

                <td>
                  {formatTimestamp(
                    member.auditedAt
                  )}
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
}
