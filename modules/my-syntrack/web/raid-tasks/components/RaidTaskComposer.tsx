import {
  useState,
  type FormEvent
} from "react";
import type {
  PersonalRaidTaskInput,
  RaidTaskCategory,
  RaidTaskCharacter,
  RaidTaskPriority
} from "../types/raidTask.types";

type RaidTaskComposerProps = {
  character: RaidTaskCharacter;
  isSaving: boolean;
  onCancel: () => void;
  onCreate: (
    input: PersonalRaidTaskInput
  ) => Promise<boolean>;
};

const categoryOptions: Array<{
  value: RaidTaskCategory;
  label: string;
}> = [
  {
    value: "PREPARATION",
    label: "Preparation"
  },
  {
    value: "ASSIGNMENT",
    label: "Assignment"
  },
  {
    value: "STRATEGY",
    label: "Strategy"
  },
  {
    value: "CONSUMABLES",
    label: "Consumables"
  }
];

export function RaidTaskComposer({
  character,
  isSaving,
  onCancel,
  onCreate
}: RaidTaskComposerProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] =
    useState("");
  const [category, setCategory] =
    useState<RaidTaskCategory>(
      "PREPARATION"
    );
  const [priority, setPriority] =
    useState<RaidTaskPriority>("NORMAL");
  const [raidName, setRaidName] =
    useState("");
  const [dueAt, setDueAt] = useState("");

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const input: PersonalRaidTaskInput = {
      title: title.trim(),
      category,
      priority
    };

    if (description.trim()) {
      input.description =
        description.trim();
    }

    if (raidName.trim()) {
      input.raidName = raidName.trim();
    }

    if (dueAt) {
      input.dueAt =
        new Date(dueAt).toISOString();
    }

    if (await onCreate(input)) {
      onCancel();
    }
  };

  return (
    <section className="panel raid-task-composer">
      <div className="panel-header">
        <div>
          <p className="eyebrow">
            NEW RAID TASK
          </p>

          <h2>Prepare {character.name}</h2>
        </div>

        <button
          className="raid-task-close"
          onClick={onCancel}
          type="button"
        >
          Close
        </button>
      </div>

      <form
        className="raid-task-form"
        onSubmit={(event) => {
          void handleSubmit(event);
        }}
      >
        <label className="raid-task-title-field">
          <span>Task</span>
          <input
            autoFocus
            maxLength={100}
            onChange={(event) =>
              setTitle(event.target.value)
            }
            placeholder="Review assigned mechanic"
            required
            value={title}
          />
        </label>

        <label>
          <span>Category</span>
          <select
            onChange={(event) =>
              setCategory(
                event.target
                  .value as RaidTaskCategory
              )
            }
            value={category}
          >
            {categoryOptions.map((option) => (
              <option
                key={option.value}
                value={option.value}
              >
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span>Priority</span>
          <select
            onChange={(event) =>
              setPriority(
                event.target
                  .value as RaidTaskPriority
              )
            }
            value={priority}
          >
            <option value="LOW">Low</option>
            <option value="NORMAL">
              Normal
            </option>
            <option value="HIGH">High</option>
          </select>
        </label>

        <label>
          <span>Raid or boss</span>
          <input
            maxLength={80}
            onChange={(event) =>
              setRaidName(event.target.value)
            }
            placeholder="Optional context"
            value={raidName}
          />
        </label>

        <label>
          <span>Due</span>
          <input
            onChange={(event) =>
              setDueAt(event.target.value)
            }
            type="datetime-local"
            value={dueAt}
          />
        </label>

        <label className="raid-task-description-field">
          <span>Notes</span>
          <textarea
            maxLength={300}
            onChange={(event) =>
              setDescription(
                event.target.value
              )
            }
            placeholder="Add a concise reminder or preparation note."
            rows={3}
            value={description}
          />
        </label>

        <div className="raid-task-form-actions">
          <button
            className="button button-secondary"
            disabled={isSaving}
            onClick={onCancel}
            type="button"
          >
            Cancel
          </button>

          <button
            className="button button-primary"
            disabled={isSaving}
            type="submit"
          >
            {isSaving
              ? "Creating..."
              : "Create task"}
          </button>
        </div>
      </form>
    </section>
  );
}
