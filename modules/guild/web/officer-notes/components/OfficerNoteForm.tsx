import {
  useState,
  type FormEvent
} from "react";

type OfficerNoteFormProps = {
  onSubmit: (
    body: string
  ) => Promise<void>;
};

export function OfficerNoteForm({
  onSubmit
}: OfficerNoteFormProps) {
  const [body, setBody] =
    useState("");

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!body.trim()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit(body.trim());
      setBody("");
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
      <label>
        <span>New note</span>
        <textarea
          maxLength={1000}
          onChange={(event) =>
            setBody(
              event.target.value
            )
          }
          placeholder="e.g. Missed three raids in a row without excuse."
          rows={3}
          value={body}
        />
      </label>

      <div className="form-actions">
        <button
          className="button button-primary"
          disabled={
            isSubmitting ||
            !body.trim()
          }
          type="submit"
        >
          {isSubmitting
            ? "Saving…"
            : "Add note"}
        </button>
      </div>
    </form>
  );
}
