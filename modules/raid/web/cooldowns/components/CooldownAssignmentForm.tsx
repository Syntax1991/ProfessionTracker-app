import {
  useState,
  type FormEvent
} from "react";
import type { GuildMember } from "../../../../guild/web/roster/types/roster.types";
import type { RaidCooldownAssignmentInput } from "../types/cooldown.types";
import { formatSeconds } from "../utils/timelineFormat";

type CooldownAssignmentFormProps = {
  rosterMembers: GuildMember[];
  abilitySuggestions: string[];
  datalistId: string;
  initialTimestampSeconds?: number | null;
  initialMemberId?: string | null;
  onSubmit: (
    input: RaidCooldownAssignmentInput
  ) => Promise<void>;
};

export function CooldownAssignmentForm({
  rosterMembers,
  abilitySuggestions,
  datalistId,
  initialTimestampSeconds = null,
  initialMemberId = null,
  onSubmit
}: CooldownAssignmentFormProps) {
  const [memberId, setMemberId] =
    useState(
      initialMemberId ??
        rosterMembers[0]?.id ??
        ""
    );

  const [abilityName, setAbilityName] =
    useState("");

  const [phaseLabel, setPhaseLabel] =
    useState("");

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (
      !memberId ||
      !abilityName.trim()
    ) {
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit({
        memberId,
        abilityName:
          abilityName.trim(),
        phaseLabel:
          phaseLabel.trim() ||
          null,
        timestampSeconds:
          initialTimestampSeconds,
        sortOrder: 0
      });

      setAbilityName("");
      setPhaseLabel("");
    }
    finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      className="boss-add-form"
      onSubmit={handleSubmit}
    >
      {initialTimestampSeconds !==
        null && (
        <span className="cooldown-timeline-placing-at">
          at{" "}
          {formatSeconds(
            initialTimestampSeconds
          )}
        </span>
      )}

      <select
        onChange={(event) =>
          setMemberId(
            event.target.value
          )
        }
        value={memberId}
      >
        {rosterMembers.map(
          (member) => (
            <option
              key={member.id}
              value={member.id}
            >
              {member.name}
            </option>
          )
        )}
      </select>

      <input
        list={datalistId}
        maxLength={80}
        onChange={(event) =>
          setAbilityName(
            event.target.value
          )
        }
        placeholder="Ability (e.g. Aura Mastery)"
        value={abilityName}
      />

      <datalist id={datalistId}>
        {abilitySuggestions.map(
          (name) => (
            <option
              key={name}
              value={name}
            />
          )
        )}
      </datalist>

      <input
        maxLength={60}
        onChange={(event) =>
          setPhaseLabel(
            event.target.value
          )
        }
        placeholder="Phase (e.g. Pull, 35%)"
        value={phaseLabel}
      />

      <button
        className="button button-primary"
        disabled={
          isSubmitting ||
          !memberId ||
          !abilityName.trim()
        }
        type="submit"
      >
        {isSubmitting
          ? "Adding…"
          : "Add assignment"}
      </button>
    </form>
  );
}
