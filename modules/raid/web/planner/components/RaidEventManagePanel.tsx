import type { GuildTeam } from "../../../../guild/web/teams/types/team.types";
import { RaidEventForm } from "./RaidEventForm";
import type {
  RaidEvent,
  RaidEventInput
} from "../types/raidEvent.types";

type RaidEventManagePanelProps = {
  event: RaidEvent;
  isEditing: boolean;
  teams: GuildTeam[];
  onStartEdit: () => void;
  onCancelEdit: () => void;
  onDelete: () => void;
  onSubmit: (
    input: RaidEventInput
  ) => Promise<void>;
};

export function RaidEventManagePanel({
  event,
  isEditing,
  teams,
  onStartEdit,
  onCancelEdit,
  onDelete,
  onSubmit
}: RaidEventManagePanelProps) {
  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">
            {isEditing
              ? "EDIT"
              : "MANAGE"}
          </p>

          <h2>{event.title}</h2>
        </div>

        {!isEditing && (
          <div className="table-actions">
            <button
              className="text-button"
              onClick={onStartEdit}
              type="button"
            >
              Edit
            </button>

            <button
              className="text-button danger"
              onClick={onDelete}
              type="button"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {isEditing && (
        <RaidEventForm
          event={event}
          onCancel={onCancelEdit}
          onSubmit={onSubmit}
          prefillDate={null}
          teams={teams}
        />
      )}
    </section>
  );
}
