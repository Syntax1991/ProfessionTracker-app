import { useState } from "react";
import type { GuildTeamMemberSummary } from "../types/team.types";

type TeamMemberPickerProps = {
  availableMembers: GuildTeamMemberSummary[];
  onAdd: (
    memberId: string,
    role: string
  ) => void;
};

export function TeamMemberPicker({
  availableMembers,
  onAdd
}: TeamMemberPickerProps) {
  const [
    selectedMemberId,
    setSelectedMemberId
  ] = useState("");

  const [role, setRole] =
    useState("MEMBER");

  if (availableMembers.length === 0) {
    return (
      <p className="muted-text">
        All roster members are already assigned to this team.
      </p>
    );
  }

  return (
    <div className="team-member-picker">
      <select
        onChange={(event) =>
          setSelectedMemberId(
            event.target.value
          )
        }
        value={selectedMemberId}
      >
        <option value="">
          Select member…
        </option>

        {availableMembers.map(
          (member) => (
            <option
              key={member.id}
              value={member.id}
            >
              {member.name} (
              {member.className})
            </option>
          )
        )}
      </select>

      <select
        onChange={(event) =>
          setRole(
            event.target.value
          )
        }
        value={role}
      >
        <option value="MEMBER">
          Member
        </option>
        <option value="SUBSTITUTE">
          Substitute
        </option>
        <option value="LEAD">
          Lead
        </option>
      </select>

      <button
        className="button button-secondary"
        disabled={
          !selectedMemberId
        }
        onClick={() => {
          onAdd(
            selectedMemberId,
            role
          );

          setSelectedMemberId("");
        }}
        type="button"
      >
        Add to team
      </button>
    </div>
  );
}
