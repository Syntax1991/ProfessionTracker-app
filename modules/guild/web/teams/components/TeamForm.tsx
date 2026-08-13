import {
  useState,
  type FormEvent
} from "react";
import type {
  GuildTeam,
  GuildTeamInput
} from "../types/team.types";

type TeamFormProps = {
  team: GuildTeam | null;
  onCancel: () => void;
  onSubmit: (
    input: GuildTeamInput
  ) => Promise<void>;
};

type TeamFormState = {
  name: string;
  description: string;
  color: string;
  sortOrder: string;
};

function createInitialState(
  team: GuildTeam | null
): TeamFormState {
  return {
    name: team?.name ?? "",
    description:
      team?.description ?? "",
    color: team?.color ?? "#9d78e8",
    sortOrder: String(
      team?.sortOrder ?? 0
    )
  };
}

export function TeamForm({
  team,
  onCancel,
  onSubmit
}: TeamFormProps) {
  const [form, setForm] = useState(
    () => createInitialState(team)
  );

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      await onSubmit({
        name: form.name.trim(),
        description:
          form.description.trim() ||
          null,
        color:
          form.color.trim() || null,
        sortOrder: Number(
          form.sortOrder
        )
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
          <span>Name</span>
          <input
            minLength={2}
            onChange={(event) =>
              setForm({
                ...form,
                name: event.target.value
              })
            }
            required
            value={form.name}
          />
        </label>

        <label>
          <span>Color</span>
          <input
            onChange={(event) =>
              setForm({
                ...form,
                color: event.target.value
              })
            }
            type="color"
            value={form.color}
          />
        </label>

        <label>
          <span>Sort order</span>
          <input
            max={999}
            min={0}
            onChange={(event) =>
              setForm({
                ...form,
                sortOrder: event.target.value
              })
            }
            required
            type="number"
            value={form.sortOrder}
          />
        </label>
      </div>

      <label>
        <span>Description</span>
        <input
          maxLength={255}
          onChange={(event) =>
            setForm({
              ...form,
              description:
                event.target.value
            })
          }
          placeholder="e.g. Mythic core team, Tuesday/Thursday"
          value={form.description}
        />
      </label>

      <div className="form-actions">
        {team && (
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
            : team
              ? "Update Team"
              : "Create Team"}
        </button>
      </div>
    </form>
  );
}
