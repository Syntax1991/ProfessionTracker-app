import {
  useState,
  type FormEvent
} from "react";
import type {
  GuildMember,
  GuildMemberInput
} from "../types/roster.types";

type RosterMemberFormProps = {
  member: GuildMember | null;
  onCancel: () => void;
  onSubmit: (
    input: GuildMemberInput
  ) => Promise<void>;
};

type RosterMemberFormState = {
  name: string;
  realm: string;
  region: string;
  className: string;
  level: string;
  rank: string;
  rankIndex: string;
  role: string;
  note: string;
  officerNote: string;
};

function createInitialState(
  member: GuildMember | null
): RosterMemberFormState {
  return {
    name: member?.name ?? "",
    realm: member?.realm ?? "",
    region: member?.region ?? "eu",
    className: member?.className ?? "",
    level: String(member?.level ?? 80),
    rank: member?.rank ?? "",
    rankIndex: String(
      member?.rankIndex ?? 0
    ),
    role: member?.role ?? "",
    note: member?.note ?? "",
    officerNote:
      member?.officerNote ?? ""
  };
}

export function RosterMemberForm({
  member,
  onCancel,
  onSubmit
}: RosterMemberFormProps) {
  const [form, setForm] = useState(
    () => createInitialState(member)
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
        realm: form.realm.trim(),
        region: form.region,
        className: form.className.trim(),
        level: Number(form.level),
        rank: form.rank.trim(),
        rankIndex: Number(
          form.rankIndex
        ),
        role: form.role || null,
        note:
          form.note.trim() || null,
        officerNote:
          form.officerNote.trim() ||
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
          <span>Class</span>
          <input
            minLength={2}
            onChange={(event) =>
              setForm({
                ...form,
                className: event.target.value
              })
            }
            placeholder="e.g. Death Knight"
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

        <label>
          <span>Rank</span>
          <input
            minLength={1}
            onChange={(event) =>
              setForm({
                ...form,
                rank: event.target.value
              })
            }
            placeholder="e.g. Officer"
            required
            value={form.rank}
          />
        </label>

        <label>
          <span>Rank order</span>
          <input
            max={20}
            min={0}
            onChange={(event) =>
              setForm({
                ...form,
                rankIndex: event.target.value
              })
            }
            required
            type="number"
            value={form.rankIndex}
          />
        </label>

        <label>
          <span>Role</span>
          <select
            onChange={(event) =>
              setForm({
                ...form,
                role: event.target.value
              })
            }
            value={form.role}
          >
            <option value="">
              Unassigned
            </option>
            <option value="TANK">
              Tank
            </option>
            <option value="HEALER">
              Healer
            </option>
            <option value="MELEE">
              Melee DPS
            </option>
            <option value="RANGED">
              Ranged DPS
            </option>
          </select>
        </label>
      </div>

      <label>
        <span>Note</span>
        <input
          maxLength={255}
          onChange={(event) =>
            setForm({
              ...form,
              note: event.target.value
            })
          }
          value={form.note}
        />
      </label>

      <label>
        <span>Officer note</span>
        <input
          maxLength={255}
          onChange={(event) =>
            setForm({
              ...form,
              officerNote:
                event.target.value
            })
          }
          value={form.officerNote}
        />
      </label>

      <div className="form-actions">
        {member && (
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
            : member
              ? "Update Member"
              : "Add Member"}
        </button>
      </div>
    </form>
  );
}
