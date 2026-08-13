import { useState } from "react";
import { LoadingPanel } from "../../../../../apps/web/src/shared/components/LoadingPanel";
import { PageHeader } from "../../../../../apps/web/src/shared/components/PageHeader";
import { StatusMessage } from "../../../../../apps/web/src/shared/components/StatusMessage";
import { useRoster } from "../../roster/hooks/useRoster";
import { GuildVerificationGate } from "../../verification/components/GuildVerificationGate";
import { OfficerNoteForm } from "../components/OfficerNoteForm";
import { OfficerNoteList } from "../components/OfficerNoteList";
import { OfficerNoteMemberList } from "../components/OfficerNoteMemberList";
import { useOfficerNotes } from "../hooks/useOfficerNotes";

export function OfficerNotesPage() {
  const [
    selectedMemberId,
    setSelectedMemberId
  ] = useState<string | null>(
    null
  );

  const {
    members,
    isLoading: isLoadingRoster,
    error: rosterError
  } = useRoster();

  const {
    notes,
    isLoading: isLoadingNotes,
    error: notesError,
    addNote,
    removeNote
  } = useOfficerNotes(
    selectedMemberId
  );

  const selectedMember =
    members.find(
      (member) =>
        member.id ===
        selectedMemberId
    ) ?? null;

  return (
    <>
      <PageHeader
        description="Keep freeform, timestamped notes about guild members — separate from the raw WoW officer note."
        eyebrow="GUILD"
        title="Officer Notes"
      />

      <GuildVerificationGate>
        {(rosterError ||
          notesError) && (
          <StatusMessage type="error">
            {rosterError ??
              notesError ??
              "Unknown error"}
          </StatusMessage>
        )}

        <div className="guild-roster-layout">
          <section className="panel">
            <div className="panel-header">
              <div>
                <p className="eyebrow">
                  MEMBERS
                </p>

                <h2>
                  {members.length}{" "}
                  Guild Members
                </h2>
              </div>
            </div>

            {isLoadingRoster ? (
              <LoadingPanel />
            ) : (
              <OfficerNoteMemberList
                members={members}
                onSelect={
                  setSelectedMemberId
                }
                selectedMemberId={
                  selectedMemberId
                }
              />
            )}
          </section>

          <section className="panel">
            <div className="panel-header">
              <div>
                <p className="eyebrow">
                  NOTES
                </p>

                <h2>
                  {selectedMember
                    ? selectedMember.name
                    : "Select a member"}
                </h2>
              </div>
            </div>

            {!selectedMember ? (
              <p className="muted-text">
                Select a guild member on the left to view and add
                officer notes.
              </p>
            ) : isLoadingNotes ? (
              <LoadingPanel />
            ) : (
              <>
                <OfficerNoteForm
                  onSubmit={
                    addNote
                  }
                />

                <OfficerNoteList
                  notes={notes}
                  onDelete={(
                    noteId
                  ) => {
                    void removeNote(
                      noteId
                    );
                  }}
                />
              </>
            )}
          </section>
        </div>
      </GuildVerificationGate>
    </>
  );
}
