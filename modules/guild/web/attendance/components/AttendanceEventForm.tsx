import {
  useState,
  type FormEvent
} from "react";
import type {
  GuildAttendanceEvent,
  GuildAttendanceEventInput
} from "../types/attendance.types";

type AttendanceEventFormProps = {
  event: GuildAttendanceEvent | null;
  onCancel: () => void;
  onSubmit: (
    input: GuildAttendanceEventInput
  ) => Promise<void>;
};

type AttendanceEventFormState = {
  title: string;
  eventDate: string;
  raidName: string;
  notes: string;
};

function toDateInputValue(
  value: string | undefined
): string {
  if (!value) {
    return new Date()
      .toISOString()
      .slice(0, 10);
  }

  return new Date(value)
    .toISOString()
    .slice(0, 10);
}

function createInitialState(
  event: GuildAttendanceEvent | null
): AttendanceEventFormState {
  return {
    title: event?.title ?? "",
    eventDate: toDateInputValue(
      event?.eventDate
    ),
    raidName:
      event?.raidName ?? "",
    notes: event?.notes ?? ""
  };
}

export function AttendanceEventForm({
  event,
  onCancel,
  onSubmit
}: AttendanceEventFormProps) {
  const [form, setForm] = useState(
    () => createInitialState(event)
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
        eventDate:
          form.eventDate,
        raidName:
          form.raidName.trim() ||
          null,
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
          <span>Date</span>
          <input
            onChange={(inputEvent) =>
              setForm({
                ...form,
                eventDate:
                  inputEvent.target
                    .value
              })
            }
            required
            type="date"
            value={form.eventDate}
          />
        </label>

        <label>
          <span>Raid</span>
          <input
            onChange={(inputEvent) =>
              setForm({
                ...form,
                raidName:
                  inputEvent.target
                    .value
              })
            }
            placeholder="e.g. Liberation of Undermine"
            value={form.raidName}
          />
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
              : "Add Event"}
        </button>
      </div>
    </form>
  );
}
