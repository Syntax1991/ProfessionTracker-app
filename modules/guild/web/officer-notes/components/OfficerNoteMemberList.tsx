import type { GuildMember } from "../../roster/types/roster.types";

type OfficerNoteMemberListProps = {
  members: GuildMember[];
  selectedMemberId: string | null;
  onSelect: (
    memberId: string
  ) => void;
};

export function OfficerNoteMemberList({
  members,
  selectedMemberId,
  onSelect
}: OfficerNoteMemberListProps) {
  if (members.length === 0) {
    return (
      <div className="empty-state">
        No guild members yet.
      </div>
    );
  }

  return (
    <ul className="officer-note-member-list">
      {members.map((member) => (
        <li key={member.id}>
          <button
            className={
              member.id ===
              selectedMemberId
                ? "officer-note-member-button selected"
                : "officer-note-member-button"
            }
            onClick={() =>
              onSelect(member.id)
            }
            type="button"
          >
            <strong>
              {member.name}
            </strong>

            <span>
              {member.className}
              {" · "}
              {member.rank}
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}
