import {
  useState,
  type FormEvent
} from "react";
import type { RaidBossInput } from "../types/bossRoster.types";

type BossFormProps = {
  onSubmit: (
    input: RaidBossInput
  ) => Promise<void>;
};

export function BossForm({
  onSubmit
}: BossFormProps) {
  const [name, setName] =
    useState("");

  const [sortOrder, setSortOrder] =
    useState("0");

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!name.trim()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit({
        name: name.trim(),
        sortOrder:
          Number(sortOrder)
      });

      setName("");
      setSortOrder("0");
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
      <input
        maxLength={120}
        onChange={(event) =>
          setName(
            event.target.value
          )
        }
        placeholder="e.g. Vexie and the Geargrinders"
        value={name}
      />

      <input
        max={999}
        min={0}
        onChange={(event) =>
          setSortOrder(
            event.target.value
          )
        }
        type="number"
        value={sortOrder}
      />

      <button
        className="button button-primary"
        disabled={
          isSubmitting ||
          !name.trim()
        }
        type="submit"
      >
        {isSubmitting
          ? "Adding…"
          : "Add boss"}
      </button>
    </form>
  );
}
