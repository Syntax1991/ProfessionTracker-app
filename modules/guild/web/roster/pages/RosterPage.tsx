import { useState } from "react";
import { LoadingPanel } from "../../../../../apps/web/src/shared/components/LoadingPanel";
import { PageHeader } from "../../../../../apps/web/src/shared/components/PageHeader";
import { StatusMessage } from "../../../../../apps/web/src/shared/components/StatusMessage";
import { GuildVerificationGate } from "../../verification/components/GuildVerificationGate";
import { RosterImportPanel } from "../components/RosterImportPanel";
import { RosterImportPreviewPanel } from "../components/RosterImportPreviewPanel";
import { RosterImportResultPanel } from "../components/RosterImportResultPanel";
import { RosterMemberForm } from "../components/RosterMemberForm";
import { RosterTable } from "../components/RosterTable";
import { useRoster } from "../hooks/useRoster";
import { useRosterImport } from "../hooks/useRosterImport";
import type {
  GuildMember,
  GuildMemberInput
} from "../types/roster.types";

export function RosterPage() {
  const [
    editingMember,
    setEditingMember
  ] = useState<GuildMember | null>(null);

  const {
    members,
    isLoading,
    error,
    createMember,
    updateMember,
    deleteMember,
    reload
  } = useRoster();

  const rosterImport =
    useRosterImport(() => {
      void reload();
    });

  const handleSubmit = async (
    input: GuildMemberInput
  ) => {
    if (editingMember) {
      await updateMember(
        editingMember.id,
        input
      );

      setEditingMember(null);
      return;
    }

    await createMember(input);
  };

  const handleDelete = async (
    member: GuildMember
  ) => {
    const confirmed = window.confirm(
      `${member.name} delete?`
    );

    if (!confirmed) {
      return;
    }

    await deleteMember(member.id);

    if (
      editingMember?.id ===
      member.id
    ) {
      setEditingMember(null);
    }
  };

  return (
    <>
      <PageHeader
        description="Manage the guild roster, or sync it directly from the SynTrack_Guild addon."
        eyebrow="GUILD"
        title="Roster"
      />

      <GuildVerificationGate>
        {(error ||
          rosterImport.error) && (
          <StatusMessage type="error">
            {error ??
              rosterImport.error ??
              "Unknown error"}
          </StatusMessage>
        )}

        {rosterImport.result && (
          <StatusMessage type="info">
            Guild roster was imported successfully.
          </StatusMessage>
        )}

        <div className="guild-roster-layout">
          <section className="panel">
            <div className="panel-header">
              <div>
                <p className="eyebrow">
                  {editingMember
                    ? "EDIT"
                    : "NEW MEMBER"}
                </p>

                <h2>
                  {editingMember
                    ? editingMember.name
                    : "Add Guild Member"}
                </h2>
              </div>
            </div>

            <RosterMemberForm
              key={
                editingMember?.id ??
                "new-member"
              }
              member={editingMember}
              onCancel={() =>
                setEditingMember(null)
              }
              onSubmit={handleSubmit}
            />
          </section>

          <section className="panel">
            <div className="panel-header">
              <div>
                <p className="eyebrow">
                  OVERVIEW
                </p>

                <h2>
                  {members.length} Guild Members
                </h2>
              </div>
            </div>

            {isLoading ? (
              <LoadingPanel />
            ) : (
              <RosterTable
                members={members}
                onDelete={(member) => {
                  void handleDelete(
                    member
                  );
                }}
                onEdit={setEditingMember}
              />
            )}
          </section>
        </div>

        <RosterImportPanel
          fileName={
            rosterImport.fileName
          }
          fileSize={
            rosterImport.fileSize
          }
          hasPreview={
            rosterImport.preview !==
            null
          }
          hasSource={
            rosterImport.hasSource
          }
          isImporting={
            rosterImport.isImporting
          }
          isPreviewing={
            rosterImport.isPreviewing
          }
          onFileSelected={
            rosterImport.selectFile
          }
          onImport={
            rosterImport.importSnapshot
          }
          onPreview={
            rosterImport.previewSnapshot
          }
        />

        {rosterImport.preview && (
          <RosterImportPreviewPanel
            preview={
              rosterImport.preview
            }
          />
        )}

        {rosterImport.result && (
          <RosterImportResultPanel
            result={
              rosterImport.result
            }
          />
        )}
      </GuildVerificationGate>
    </>
  );
}
