import type { GuildMember } from "../types/roster.types";
import {
  ROLE_LABELS,
  ROLE_ORDER,
  resolveRoleKey
} from "../utils/rosterRoles";
import { RosterTable } from "./RosterTable";

type RosterRoleGroupsProps = {
  members: GuildMember[];
  onDelete: (
    member: GuildMember
  ) => void;
  onEdit: (
    member: GuildMember
  ) => void;
};

export function RosterRoleGroups({
  members,
  onDelete,
  onEdit
}: RosterRoleGroupsProps) {
  if (members.length === 0) {
    return (
      <RosterTable
        members={members}
        onDelete={onDelete}
        onEdit={onEdit}
      />
    );
  }

  return (
    <div className="roster-role-groups">
      {ROLE_ORDER.map((roleKey) => {
        const groupMembers =
          members.filter(
            (member) =>
              resolveRoleKey(
                member.role
              ) === roleKey
          );

        if (groupMembers.length === 0) {
          return null;
        }

        return (
          <div
            className="roster-role-group"
            key={roleKey}
          >
            <div className="roster-role-group-header">
              <h3>
                {ROLE_LABELS[roleKey]}
              </h3>

              <span className="roster-role-group-count">
                {groupMembers.length}
              </span>
            </div>

            <RosterTable
              members={groupMembers}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          </div>
        );
      })}
    </div>
  );
}
