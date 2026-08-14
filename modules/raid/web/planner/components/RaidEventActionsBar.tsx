import type { GuildTeam } from "../../../../guild/web/teams/types/team.types";
import { RaidEventForm } from "./RaidEventForm";
import type {
  RaidEvent,
  RaidEventInput
} from "../types/raidEvent.types";

type RaidEventActionsBarProps = {
  event: RaidEvent;
  isEditing: boolean;
  teams: GuildTeam[];
  onToggleEdit: () => void;
  onDelete: () => void;
  onSubmit: (
    input: RaidEventInput
  ) => Promise<void>;
};

export function RaidEventActionsBar({
  event,
  isEditing,
  teams,
  onToggleEdit,
  onDelete,
  onSubmit
}: RaidEventActionsBarProps) {
  return (
    <>
      <div className="raid-detail-actions">
        <button
          className="button button-secondary"
          onClick={onToggleEdit}
          type="button"
        >
          {isEditing
            ? "Cancel"
            : "Edit"}
        </button>

        <button
          className="button button-secondary"
          onClick={onDelete}
          type="button"
        >
          Delete
        </button>
      </div>

      {isEditing && (
        <section className="panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">
                EDIT
              </p>

              <h2>
                {event.title}
              </h2>
            </div>
          </div>

          <RaidEventForm
            event={event}
            onCancel={onToggleEdit}
            onSubmit={onSubmit}
            prefillDate={null}
            teams={teams}
          />
        </section>
      )}
    </>
  );
}
