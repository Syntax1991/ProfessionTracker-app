import { useState } from "react";
import { LoadingPanel } from "../../../../../apps/web/src/shared/components/LoadingPanel";
import { PageHeader } from "../../../../../apps/web/src/shared/components/PageHeader";
import { StatusMessage } from "../../../../../apps/web/src/shared/components/StatusMessage";
import { useRoster } from "../../roster/hooks/useRoster";
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

  const handleSubmit = async (
    input: GuildRequirementInput
  ) => {
    if (editingRequirement) {
      await updateRequirement(
        editingRequirement.id,
        input
      );

      setEditingRequirement(null);
      return;
    }

    await createRequirement(input);
  };

  const handleDelete = async (
    requirement: GuildRequirement
  ) => {
    const confirmed = window.confirm(
      `${requirement.title} delete?`
    );

    if (!confirmed) {
      return;
    }

    await deleteRequirement(
      requirement.id
    );

    if (
      editingRequirement?.id ===
      requirement.id
    ) {
      setEditingRequirement(null);
    }
  };

  return (
    <>
      <PageHeader
        description="Define what the guild expects from its members — gear, keystones, attendance and more."
        eyebrow="GUILD"
        title="Requirements"
      />

      <GuildVerificationGate>
        {error && (
          <StatusMessage type="error">
            {error}
          </StatusMessage>
        )}

        <div className="guild-roster-layout">
          <section className="panel">
            <div className="panel-header">
              <div>
                <p className="eyebrow">
                  {editingRequirement
                    ? "EDIT"
                    : "NEW REQUIREMENT"}
                </p>

                <h2>
                  {editingRequirement
                    ? editingRequirement.title
                    : "Add Requirement"}
                </h2>
              </div>
            </div>

            <RequirementForm
              key={
                editingRequirement?.id ??
                "new-requirement"
              }
              onCancel={() =>
                setEditingRequirement(
                  null
                )
              }
              onSubmit={
                handleSubmit
              }
              requirement={
                editingRequirement
              }
            />
          </section>

          <section className="panel">
            <div className="panel-header">
              <div>
                <p className="eyebrow">
                  OVERVIEW
                </p>

                <h2>
                  {requirements.length}{" "}
                  Requirements
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
                  setEditingRequirement
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
        </div>
      </GuildVerificationGate>
    </>
  );
}
