import {
  useState,
  type FormEvent
} from "react";
import type { GuildTeam } from "../../../../guild/web/teams/types/team.types";
import type {
  RaidDifficulty,
  RaidEvent,
  RaidEventInput
} from "../types/raidEvent.types";

type RaidEventFormProps = {
  event: RaidEvent | null;
  prefillDate: Date | null;
  teams: GuildTeam[];
  onCancel: () => void;
  onSubmit: (
    input: RaidEventInput
  ) => Promise<void>;
};

type RaidEventFormState = {
  title: string;
  raidInstance: string;
  difficulty: RaidDifficulty;
  scheduledAt: string;
  teamId: string;
  notes: string;
};

function toDateTimeInputValue(
  value: string | undefined
): string {
  if (!value) {
    return "";
  }

  return new Date(value)
    .toISOString()
    .slice(0, 16);
}

function toPrefillDateTimeInputValue(
  date: Date
): string {
  const withDefaultTime = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    20,
    0
  );

  const offsetMilliseconds =
    withDefaultTime.getTimezoneOffset() *
    60 *
    1000;

  return new Date(
    withDefaultTime.getTime() -
      offsetMilliseconds
  )
    .toISOString()
    .slice(0, 16);
}

function createInitialState(
  event: RaidEvent | null,
  prefillDate: Date | null
): RaidEventFormState {
  return {
    title: event?.title ?? "",
    raidInstance:
      event?.raidInstance ?? "",
    difficulty:
      event?.difficulty ??
      "HEROIC",
    scheduledAt: event
      ? toDateTimeInputValue(
          event.scheduledAt
        )
      : prefillDate
        ? toPrefillDateTimeInputValue(
            prefillDate
          )
        : "",
    teamId: event?.teamId ?? "",
    notes: event?.notes ?? ""
  };
}

export function RaidEventForm({
  event,
  prefillDate,
  teams,
  onCancel,
  onSubmit
}: RaidEventFormProps) {
  const [form, setForm] = useState(
    () =>
      createInitialState(
        event,
        prefillDate
      )
  );

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const handleSubmit = async (
    formEvent: FormEvent<HTMLFormElement>
  ) => {
    formEvent.preventDefault();
    setIsSubmitting(true);

    try {
      await onSubmit({
        title: form.title.trim(),
        raidInstance:
          form.raidInstance.trim(),
        difficulty:
          form.difficulty,
        scheduledAt:
          new Date(
            form.scheduledAt
          ).toISOString(),
        teamId:
          form.teamId || null,
        notes:
          form.notes.trim() ||
          null
      });
    }
    finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      className="character-form"
      onSubmit={handleSubmit}
    >
      <div className="form-grid">
        <label>
          <span>Title</span>
          <input
            minLength={2}
            onChange={(inputEvent) =>
              setForm({
                ...form,
                title: inputEvent
                  .target.value
              })
            }
            required
            value={form.title}
          />
        </label>

        <label>
          <span>Raid instance</span>
          <input
            minLength={2}
            onChange={(inputEvent) =>
              setForm({
                ...form,
                raidInstance:
                  inputEvent.target
                    .value
              })
            }
            placeholder="e.g. Liberation of Undermine"
            required
            value={
              form.raidInstance
            }
          />
        </label>

        <label>
          <span>Difficulty</span>
          <select
            onChange={(inputEvent) =>
              setForm({
                ...form,
                difficulty:
                  inputEvent.target
                    .value as RaidDifficulty
              })
            }
            value={
              form.difficulty
            }
          >
            <option value="LFR">
              LFR
            </option>
            <option value="NORMAL">
              Normal
            </option>
            <option value="HEROIC">
              Heroic
            </option>
            <option value="MYTHIC">
              Mythic
            </option>
          </select>
        </label>

        <label>
          <span>
            Date &amp; time
          </span>
          <input
            onChange={(inputEvent) =>
              setForm({
                ...form,
                scheduledAt:
                  inputEvent.target
                    .value
              })
            }
            required
            type="datetime-local"
            value={
              form.scheduledAt
            }
          />
        </label>

        <label>
          <span>Team</span>
          <select
            onChange={(inputEvent) =>
              setForm({
                ...form,
                teamId:
                  inputEvent.target
                    .value
              })
            }
            value={form.teamId}
          >
            <option value="">
              No team
            </option>

            {teams.map((team) => (
              <option
                key={team.id}
                value={team.id}
              >
                {team.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label>
        <span>Notes</span>
        <input
          maxLength={500}
          onChange={(inputEvent) =>
            setForm({
              ...form,
              notes:
                inputEvent.target
                  .value
            })
          }
          value={form.notes}
        />
      </label>

      <div className="form-actions">
        {event && (
          <button
            className="button button-secondary"
            onClick={onCancel}
            type="button"
          >
            Cancel
          </button>
        )}

        <button
          className="button button-primary"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting
            ? "Saving…"
            : event
              ? "Update Event"
              : "Schedule Raid"}
        </button>
      </div>
    </form>
  );
}
