import { apiRequest } from "../../../../../apps/web/src/shared/api/httpClient";
import type {
  GuildOfficerNote,
  GuildOfficerNoteInput,
  GuildOfficerNoteListResponse
} from "../types/officerNote.types";

export function getGuildOfficerNoteCount():
  Promise<{ total: number }> {
  return apiRequest<{
    total: number;
  }>("/guild/officer-notes/count");
}

export function getGuildOfficerNotesForMember(
  memberId: string
): Promise<GuildOfficerNoteListResponse> {
  return apiRequest<GuildOfficerNoteListResponse>(
    `/guild/officer-notes/member/${memberId}`
  );
}

export function createGuildOfficerNote(
  input: GuildOfficerNoteInput
): Promise<GuildOfficerNote> {
  return apiRequest<GuildOfficerNote>(
    "/guild/officer-notes",
    {
      method: "POST",
      body: JSON.stringify(input)
    }
  );
}

export function deleteGuildOfficerNote(
  noteId: string
): Promise<void> {
  return apiRequest<void>(
    `/guild/officer-notes/${noteId}`,
    {
      method: "DELETE"
    }
  );
}
