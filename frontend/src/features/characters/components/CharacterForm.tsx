import {
  useState,
  type FormEvent
} from "react";
import type { Profession } from "../../professions/types/profession.types";
import type {
  Character,
  CharacterInput
} from "../types/character.types";

type CharacterFormProps = {
  character: Character | null;
  professions: Profession[];
  onCancel: () => void;
  onSubmit: (
    input: CharacterInput
  ) => Promise<void>;
};

type CharacterFormState = {
  name: string;
  realm: string;
  region: string;
  className: string;
  level: string;
  professionIds: string[];
};

function createInitialState(
  character: Character | null
): CharacterFormState {
  return {
    name: character?.name ?? "",
    realm: character?.realm ?? "",
    region: character?.region ?? "eu",
    className: character?.className ?? "",
    level: String(character?.level ?? 80),
    professionIds:
      character?.professions.map(
        (assignment) =>
          assignment.profession.id
      ) ?? []
  };
}

export function CharacterForm({
  character,
  professions,
  onCancel,
  onSubmit
}: CharacterFormProps) {
  const [form, setForm] = useState(
    () => createInitialState(character)
  );

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const toggleProfession = (
    professionId: string
  ) => {
    setForm((current) => {
      const isSelected =
        current.professionIds.includes(
          professionId
        );

      if (isSelected) {
        return {
          ...current,
          professionIds:
            current.professionIds.filter(
              (id) => id !== professionId
            )
        };
      }

      if (current.professionIds.length >= 2) {
        return current;
      }

      return {
        ...current,
        professionIds: [
          ...current.professionIds,
          professionId
        ]
      };
    });
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      await onSubmit({
        name: form.name.trim(),
        realm: form.realm.trim(),
        region: form.region,
        className: form.className.trim(),
        level: Number(form.level),
        professionIds: form.professionIds
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
          <span>Realm</span>
          <input
            minLength={2}
            onChange={(event) =>
              setForm({
                ...form,
                realm: event.target.value
              })
            }
            required
            value={form.realm}
          />
        </label>

        <label>
          <span>Region</span>
          <select
            onChange={(event) =>
              setForm({
                ...form,
                region: event.target.value
              })
            }
            value={form.region}
          >
            <option value="eu">EU</option>
            <option value="us">US</option>
            <option value="kr">KR</option>
            <option value="tw">TW</option>
          </select>
        </label>

        <label>
          <span>Klasse</span>
          <input
            minLength={2}
            onChange={(event) =>
              setForm({
                ...form,
                className: event.target.value
              })
            }
            placeholder="z. B. Todesritter"
            required
            value={form.className}
          />
        </label>

        <label>
          <span>Level</span>
          <input
            max={100}
            min={1}
            onChange={(event) =>
              setForm({
                ...form,
                level: event.target.value
              })
            }
            required
            type="number"
            value={form.level}
          />
        </label>
      </div>

      <fieldset>
        <legend>Primärberufe</legend>

        <p className="field-hint">
          Es können maximal zwei Berufe
          ausgewählt werden.
        </p>

        <div className="profession-selector">
          {professions.map((profession) => {
            const isSelected =
              form.professionIds.includes(
                profession.id
              );

            const isDisabled =
              !isSelected &&
              form.professionIds.length >= 2;

            return (
              <label
                className={
                  isSelected
                    ? "profession-option selected"
                    : "profession-option"
                }
                key={profession.id}
              >
                <input
                  checked={isSelected}
                  disabled={isDisabled}
                  onChange={() =>
                    toggleProfession(
                      profession.id
                    )
                  }
                  type="checkbox"
                />

                <span>{profession.name}</span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="form-actions">
        {character && (
          <button
            className="button button-secondary"
            onClick={onCancel}
            type="button"
          >
            Abbrechen
          </button>
        )}

        <button
          className="button button-primary"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting
            ? "Speichern…"
            : character
              ? "Charakter aktualisieren"
              : "Charakter anlegen"}
        </button>
      </div>
    </form>
  );
}