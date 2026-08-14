import { useState } from "react";
import { LoadingPanel } from "../../../../../apps/web/src/shared/components/LoadingPanel";
import { PageHeader } from "../../../../../apps/web/src/shared/components/PageHeader";
import { StatusMessage } from "../../../../../apps/web/src/shared/components/StatusMessage";
import { useRoster } from "../../roster/hooks/useRoster";
import { GuildEditorModal } from "../../shared/components/GuildEditorModal";
import { GuildVerificationGate } from "../../verification/components/GuildVerificationGate";
import { RequirementForm } from "../components/RequirementForm";
import { RequirementList } from "../components/RequirementList";
import { useRequirements } from "../hooks/useRequirements";
import type {
  GuildRequirement,
  GuildRequirementInput
} from "../types/requirement.types";

export function RequirementsPage() {
  const [
    editingRequirement,
    setEditingRequirement
  ] =
    useState<GuildRequirement | null>(
      null
    );

  const [
    isEditorOpen,
    setIsEditorOpen
  ] = useState(false);

  const {
    requirements,
    isLoading,
    error,
    createRequirement,
    updateRequirement,
    deleteRequirement
  } = useRequirements();

  const {
    members: rosterMembers
  } = useRoster();

  const closeEditor = () => {
    setIsEditorOpen(false);
    setEditingRequirement(null);
  };

  const openCreateEditor = () => {
    setEditingRequirement(null);
    setIsEditorOpen(true);
  };

  const openEditEditor = (
    requirement: GuildRequirement
  ) => {
    setEditingRequirement(
      requirement
    );

    setIsEditorOpen(true);
  };

  const handleSubmit = async (
    input: GuildRequirementInput
  ) => {
    if (editingRequirement) {
      await updateRequirement(
        editingRequirement.id,
        input
      );
    }
    else {
      await createRequirement(input);
    }

    closeEditor();
  };

  const handleDelete = async (
    requirement: GuildRequirement
  ) => {
    if (
      !window.confirm(
        `${requirement.title} delete?`
      )
    ) {
      return;
    }

    await deleteRequirement(
      requirement.id
    );

    if (
      editingRequirement?.id ===
      requirement.id
    ) {
      closeEditor();
    }
  };

  return (
    <div className="guild-page">
      <PageHeader
        description="Define preparation, gear and activity rules for the roster."
        eyebrow="GUILD"
        title="Requirements"
      />

      <GuildVerificationGate>
        {error && (
          <StatusMessage type="error">
            {error}
          </StatusMessage>
        )}

        <div className="guild-section-toolbar">
          <div>
            <span className="eyebrow">
              REQUIREMENTS
            </span>

            <h2>
              {requirements.length}{" "}
              Defined
            </h2>
          </div>

          <button
            className="button button-primary"
            onClick={openCreateEditor}
            type="button"
          >
            + Add Requirement
          </button>
        </div>

        <section className="panel guild-content-panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">
                RULES
              </p>

              <h2>
                Guild Requirements
              </h2>
            </div>
          </div>

          {isLoading ? (
            <LoadingPanel />
          ) : (
            <RequirementList
              onDelete={(
                requirement
              ) => {
                void handleDelete(
                  requirement
                );
              }}
              onEdit={
                openEditEditor
              }
              requirements={
                requirements
              }
              rosterMembers={
                rosterMembers
              }
            />
          )}
        </section>

        <GuildEditorModal
          description="Define a preparation or readiness rule."
          eyebrow={
            editingRequirement
              ? "EDIT REQUIREMENT"
              : "NEW REQUIREMENT"
          }
          isOpen={isEditorOpen}
          onClose={closeEditor}
          title={
            editingRequirement
              ? editingRequirement.title
              : "Add Requirement"
          }
        >
          <RequirementForm
            key={
              editingRequirement?.id ??
              "new-requirement"
            }
            onCancel={closeEditor}
            onSubmit={handleSubmit}
            requirement={
              editingRequirement
            }
          />
        </GuildEditorModal>
      </GuildVerificationGate>
    </div>
  );
}