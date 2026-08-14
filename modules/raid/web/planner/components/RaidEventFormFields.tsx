import type { GuildTeam } from "../../../../guild/web/teams/types/team.types";
import type {
  RaidDifficulty
} from "../types/raidEvent.types";

export type RaidEventFormState = {
  title: string;
  raidKey: string;
  legacyRaidInstance: string;
  difficulty: RaidDifficulty;
  scheduledAt: string;
  teamId: string;
  notes: string;
};

type RaidOption = {
  key: string;
  name: string;
};

type RaidEventFormFieldsProps = {
  form: RaidEventFormState;
  raids: RaidOption[];
  teams: GuildTeam[];
  selectedSeason: string;
  bossCount: number | null;
  isEditing: boolean;
  isSubmitting: boolean;
  onCancel: () => void;
  onRaidChange: (
    raidKey: string
  ) => void;
  onScheduledAtChange: (
    scheduledAt: string
  ) => void;
  onFieldChange: <
    K extends keyof RaidEventFormState
  >(
    field: K,
    value: RaidEventFormState[K]
  ) => void;
};

export function RaidEventFormFields({
  form,
  raids,
  teams,
  selectedSeason,
  bossCount,
  isEditing,
  isSubmitting,
  onCancel,
  onRaidChange,
  onScheduledAtChange,
  onFieldChange
}: RaidEventFormFieldsProps) {
  const raidValue =
    form.raidKey ||
    (
      form.legacyRaidInstance
        ? "__legacy__"
        : ""
    );

  return (
    <>
      <div className="raid-content-summary">
        <div>
          <span>Content</span>

          <strong>
            {selectedSeason}
          </strong>
        </div>

        {bossCount !== null && (
          <div>
            <span>
              Encounters
            </span>

            <strong>
              {bossCount}
            </strong>
          </div>
        )}
      </div>

      <div className="form-grid">
        <label>
          <span>Event name</span>

          <input
            minLength={2}
            onChange={(event) =>
              onFieldChange(
                "title",
                event.target.value
              )
            }
            placeholder="e.g. Raid Progress"
            required
            value={form.title}
          />
        </label>

        <label>
          <span>Raid</span>

          <select
            onChange={(event) =>
              onRaidChange(
                event.target.value
              )
            }
            required
            value={raidValue}
          >
            {form.legacyRaidInstance && (
              <option value="__legacy__">
                {
                  form.legacyRaidInstance
                }{" "}
                (legacy)
              </option>
            )}

            {raids.map((raid) => (
              <option
                key={raid.key}
                value={raid.key}
              >
                {raid.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span>Difficulty</span>

          <select
            onChange={(event) =>
              onFieldChange(
                "difficulty",
                event.target
                  .value as RaidDifficulty
              )
            }
            value={form.difficulty}
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
            onChange={(event) =>
              onScheduledAtChange(
                event.target.value
              )
            }
            required
            type="datetime-local"
            value={form.scheduledAt}
          />
        </label>

        <label>
          <span>Team</span>

          <select
            onChange={(event) =>
              onFieldChange(
                "teamId",
                event.target.value
              )
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
          onChange={(event) =>
            onFieldChange(
              "notes",
              event.target.value
            )
          }
          value={form.notes}
        />
      </label>

      <div className="form-actions">
        <button
          className="button button-secondary"
          onClick={onCancel}
          type="button"
        >
          Cancel
        </button>

        <button
          className="button button-primary"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting
            ? "Saving…"
            : isEditing
              ? "Update Event"
              : "Schedule Raid"}
        </button>
      </div>
    </>
  );
}