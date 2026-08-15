import {
  useState,
  type FormEvent
} from "react";
import type { GuildMember } from "../../../../guild/web/roster/types/roster.types";
import type { RaidCooldownAssignmentInput } from "../types/cooldown.types";
import { formatSeconds } from "../utils/timelineFormat";
import { SpellPicker } from "./SpellPicker";

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

  const [spellId, setSpellId] =
    useState<number | null>(null);

  const [abilityIcon, setAbilityIcon] =
    useState<string | null>(null);

  const [useFreeText, setUseFreeText] =
    useState(false);

  const [abilityName, setAbilityName] =
    useState("");

  const [phaseLabel, setPhaseLabel] =
    useState("");

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const selectedMember =
    rosterMembers.find(
      (member) => member.id === memberId
    );

  const resolvedAbilityName =
    useFreeText
      ? abilityName.trim()
      : abilityName;

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (
      !memberId ||
      !resolvedAbilityName
    ) {
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit({
        memberId,
        abilityName:
          resolvedAbilityName,
        spellId: useFreeText
          ? null
          : spellId,
        abilityIcon: useFreeText
          ? null
          : abilityIcon,
        phaseLabel:
          phaseLabel.trim() ||
          null,
        timestampSeconds:
          initialTimestampSeconds,
        sortOrder: 0
      });

      setSpellId(null);
      setAbilityIcon(null);
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

      {useFreeText ? (
        <>
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
        </>
      ) : (
        <SpellPicker
          className={
            selectedMember?.className ??
            ""
          }
          onSelect={(spell) => {
            setSpellId(
              spell?.spellId ?? null
            );
            setAbilityIcon(
              spell?.icon ?? null
            );
            setAbilityName(
              spell?.name ?? ""
            );
          }}
          selectedSpellId={spellId}
        />
      )}

      <button
        className="text-button"
        onClick={() => {
          setUseFreeText(
            (current) => !current
          );
          setSpellId(null);
          setAbilityIcon(null);
          setAbilityName("");
        }}
        type="button"
      >
        {useFreeText
          ? "Use spell picker instead"
          : "Can't find it? Type a name instead"}
      </button>

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
          !resolvedAbilityName
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
