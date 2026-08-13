import type { GuildOfficerNote } from "../types/officerNote.types";

type OfficerNoteListProps = {
  notes: GuildOfficerNote[];
  onDelete: (
    noteId: string
  ) => void;
};

function formatTimestamp(
  value: string
): string {
  return new Date(
    value
  ).toLocaleString();
}

export function OfficerNoteList({
  notes,
  onDelete
}: OfficerNoteListProps) {
  if (notes.length === 0) {
    return (
      <p className="muted-text">
        No officer notes for this member yet.
      </p>
    );
  }

  return (
    <ul className="officer-note-list">
      {notes.map((note) => (
        <li key={note.id}>
          <div className="officer-note-meta">
            <span>
              {note.authorCharacter}
            </span>

            <span>
              {formatTimestamp(
                note.createdAt
              )}
            </span>
          </div>

          <p>{note.body}</p>

          <button
            className="text-button danger"
            onClick={() =>
              onDelete(note.id)
            }
            type="button"
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}
