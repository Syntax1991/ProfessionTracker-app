import {
  useState,
  type FormEvent
} from "react";
import type { RaidBossPhaseMarkerInput } from "../types/cooldown.types";
import { parseTimeInput } from "../utils/timelineFormat";

type PhaseMarkerFormProps = {
  onSubmit: (
    input: RaidBossPhaseMarkerInput
  ) => Promise<void>;
};

export function PhaseMarkerForm({
  onSubmit
}: PhaseMarkerFormProps) {
  const [labelInput, setLabelInput] =
    useState("");

  const [timeInput, setTimeInput] =
    useState("");

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const startSeconds = parseTimeInput(
      timeInput
    );

    if (
      !labelInput.trim() ||
      startSeconds === null
    ) {
      return;
    }

    await onSubmit({
      label: labelInput.trim(),
      startSeconds,
      sortOrder: 0
    });

    setLabelInput("");
    setTimeInput("");
  };

  return (
    <form
      className="boss-add-form"
      onSubmit={handleSubmit}
    >
      <input
        maxLength={60}
        onChange={(event) =>
          setLabelInput(
            event.target.value
          )
        }
        placeholder="Phase label (e.g. Intermission)"
        value={labelInput}
      />

      <input
        onChange={(event) =>
          setTimeInput(
            event.target.value
          )
        }
        placeholder="mm:ss"
        value={timeInput}
      />

      <button
        className="button button-secondary"
        type="submit"
      >
        + Add phase marker
      </button>
    </form>
  );
}
