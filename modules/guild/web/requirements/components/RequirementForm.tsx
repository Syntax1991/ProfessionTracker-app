import {
  useState,
  type FormEvent
} from "react";
import type {
  GuildRequirement,
  GuildRequirementCategory,
  GuildRequirementInput
} from "../types/requirement.types";

type RequirementFormProps = {
  requirement: GuildRequirement | null;
  onCancel: () => void;
  onSubmit: (
    input: GuildRequirementInput
  ) => Promise<void>;
};

type RequirementFormState = {
  title: string;
  description: string;
  category: GuildRequirementCategory;
  sortOrder: string;
};

function createInitialState(
  requirement: GuildRequirement | null
): RequirementFormState {
  return {
    title: requirement?.title ?? "",
    description:
      requirement?.description ??
      "",
    category:
      requirement?.category ??
      "OTHER",
    sortOrder: String(
      requirement?.sortOrder ?? 0
    )
  };
}

export function RequirementForm({
  requirement,
  onCancel,
  onSubmit
}: RequirementFormProps) {
  const [form, setForm] = useState(
    () =>
      createInitialState(
        requirement
      )
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
        title: form.title.trim(),
        description:
          form.description.trim() ||
          null,
        category: form.category,
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
          <span>Title</span>
          <input
            minLength={2}
            onChange={(event) =>
              setForm({
                ...form,
                title: event.target.value
              })
            }
            required
            value={form.title}
          />
        </label>

        <label>
          <span>Category</span>
          <select
            onChange={(event) =>
              setForm({
                ...form,
                category: event
                  .target
                  .value as GuildRequirementCategory
              })
            }
            value={form.category}
          >
            <option value="GEAR">
              Gear
            </option>
            <option value="KEYSTONE">
              Keystone
            </option>
            <option value="ATTENDANCE">
              Attendance
            </option>
            <option value="PROFESSION">
              Profession
            </option>
            <option value="OTHER">
              Other
            </option>
          </select>
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
          maxLength={500}
          onChange={(event) =>
            setForm({
              ...form,
              description:
                event.target.value
            })
          }
          placeholder="e.g. 620+ item level for Heroic signups"
          value={form.description}
        />
      </label>

      <div className="form-actions">
        {requirement && (
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
            : requirement
              ? "Update Requirement"
              : "Add Requirement"}
        </button>
      </div>
    </form>
  );
}
