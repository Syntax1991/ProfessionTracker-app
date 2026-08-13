import {
  useCallback,
  useEffect,
  useState
} from "react";
import {
  createGuildOfficerNote,
  deleteGuildOfficerNote,
  getGuildOfficerNotesForMember
} from "../api/officerNoteApi";
import type { GuildOfficerNote } from "../types/officerNote.types";

export function useOfficerNotes(
  memberId: string | null
) {
  const [notes, setNotes] =
    useState<GuildOfficerNote[]>(
      []
    );

  const [isLoading, setIsLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const loadNotes = useCallback(
    async () => {
      if (!memberId) {
        setNotes([]);
        return;
      }

      setError(null);
      setIsLoading(true);

      try {
        const response =
          await getGuildOfficerNotesForMember(
            memberId
          );

        setNotes(response.items);
      }
      catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Notes could not be loaded."
        );
      }
      finally {
        setIsLoading(false);
      }
    },
    [memberId]
  );

  useEffect(() => {
    void loadNotes();
  }, [loadNotes]);

  const addNote = async (
    body: string
  ) => {
    if (!memberId) {
      return;
    }

    setError(null);

    try {
      await createGuildOfficerNote({
        memberId,
        body
      });

      await loadNotes();
    }
    catch (addError) {
      const message =
        addError instanceof Error
          ? addError.message
          : "Note could not be added.";

      setError(message);
      throw addError;
    }
  };

  const removeNote = async (
    noteId: string
  ) => {
    setError(null);

    try {
      await deleteGuildOfficerNote(
        noteId
      );

      await loadNotes();
    }
    catch (removeError) {
      const message =
        removeError instanceof Error
          ? removeError.message
          : "Note could not be removed.";

      setError(message);
      throw removeError;
    }
  };

  return {
    notes,
    isLoading,
    error,
    addNote,
    removeNote
  };
}
