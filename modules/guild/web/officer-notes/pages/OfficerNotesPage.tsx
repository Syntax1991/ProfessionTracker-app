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
    <div className="guild-page">
      <PageHeader
        description="Private, timestamped context for guild leadership."
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

        <div className="guild-section-toolbar">
          <div>
            <span className="eyebrow">
              NOTES
            </span>

            <h2>
              Member History
            </h2>
          </div>
        </div>

        <div className="guild-split-workspace">
          <section className="panel guild-member-browser">
            <div className="panel-header">
              <div>
                <p className="eyebrow">
                  MEMBERS
                </p>

                <h2>
                  {members.length} Members
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

          <section className="panel guild-detail-panel">
            <div className="panel-header">
              <div>
                <p className="eyebrow">
                  HISTORY
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
                Select a member to view
                or add officer notes.
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
    </div>
  );
}