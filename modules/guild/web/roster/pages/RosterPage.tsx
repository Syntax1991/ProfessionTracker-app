import { useState } from "react";
import { LoadingPanel } from "../../../../../apps/web/src/shared/components/LoadingPanel";
import { PageHeader } from "../../../../../apps/web/src/shared/components/PageHeader";
import { StatusMessage } from "../../../../../apps/web/src/shared/components/StatusMessage";
import { GuildEditorModal } from "../../shared/components/GuildEditorModal";
import { GuildVerificationGate } from "../../verification/components/GuildVerificationGate";
import { RosterImportPanel } from "../components/RosterImportPanel";
import { RosterImportPreviewPanel } from "../components/RosterImportPreviewPanel";
import { RosterImportResultPanel } from "../components/RosterImportResultPanel";
import { RosterMemberForm } from "../components/RosterMemberForm";
import { RosterRoleGroups } from "../components/RosterRoleGroups";
import { RosterSummarySidebar } from "../components/RosterSummarySidebar";
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
  ] = useState<GuildMember | null>(
    null
  );

  const [
    isEditorOpen,
    setIsEditorOpen
  ] = useState(false);

  const [
    showImport,
    setShowImport
  ] = useState(false);

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

  const closeEditor = () => {
    setIsEditorOpen(false);
    setEditingMember(null);
  };

  const openCreateEditor = () => {
    setEditingMember(null);
    setIsEditorOpen(true);
  };

  const openEditEditor = (
    member: GuildMember
  ) => {
    setEditingMember(member);
    setIsEditorOpen(true);
  };

  const handleSubmit = async (
    input: GuildMemberInput
  ) => {
    if (editingMember) {
      await updateMember(
        editingMember.id,
        input
      );
    }
    else {
      await createMember(input);
    }

    closeEditor();
  };

  const handleDelete = async (
    member: GuildMember
  ) => {
    if (
      !window.confirm(
        `${member.name} delete?`
      )
    ) {
      return;
    }

    await deleteMember(member.id);

    if (
      editingMember?.id ===
      member.id
    ) {
      closeEditor();
    }
  };

  const showImportWorkspace =
    showImport ||
    rosterImport.preview !== null ||
    rosterImport.result !== null;

  return (
    <div className="guild-page">
      <PageHeader
        description="Maintain the active guild roster, roles and audit coverage."
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

        <div className="guild-section-toolbar">
          <div>
            <span className="eyebrow">
              ROSTER
            </span>

            <h2>
              {members.length} Members
            </h2>
          </div>

          <div className="guild-toolbar-actions">
            <button
              className="button button-secondary"
              onClick={() =>
                setShowImport(
                  (current) =>
                    !current
                )
              }
              type="button"
            >
              {showImport
                ? "Hide Import"
                : "Import Addon Data"}
            </button>

            <button
              className="button button-primary"
              onClick={openCreateEditor}
              type="button"
            >
              + Add Member
            </button>
          </div>
        </div>

        <div className="guild-roster-workspace">
          <section className="panel guild-content-panel">
            <div className="panel-header">
              <div>
                <p className="eyebrow">
                  SETUP
                </p>

                <h2>
                  Raid Composition
                </h2>
              </div>
            </div>

            {isLoading ? (
              <LoadingPanel />
            ) : (
              <RosterRoleGroups
                members={members}
                onDelete={(member) => {
                  void handleDelete(
                    member
                  );
                }}
                onEdit={
                  openEditEditor
                }
              />
            )}
          </section>

          {!isLoading && (
            <RosterSummarySidebar
              members={members}
            />
          )}
        </div>

        {showImportWorkspace && (
          <div className="guild-import-workspace">
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
          </div>
        )}

        <GuildEditorModal
          description="Add or edit a manually managed roster entry."
          eyebrow={
            editingMember
              ? "EDIT MEMBER"
              : "NEW MEMBER"
          }
          isOpen={isEditorOpen}
          onClose={closeEditor}
          title={
            editingMember
              ? editingMember.name
              : "Add Guild Member"
          }
        >
          <RosterMemberForm
            key={
              editingMember?.id ??
              "new-member"
            }
            member={editingMember}
            onCancel={closeEditor}
            onSubmit={handleSubmit}
          />
        </GuildEditorModal>
      </GuildVerificationGate>
    </div>
  );
}