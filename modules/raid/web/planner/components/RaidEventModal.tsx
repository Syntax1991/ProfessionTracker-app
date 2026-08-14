import {
  useEffect
} from "react";
import type { GuildTeam } from "../../../../guild/web/teams/types/team.types";
import { RaidEventForm } from "./RaidEventForm";
import type {
  RaidEventInput
} from "../types/raidEvent.types";

type RaidEventModalProps = {
  isOpen: boolean;
  prefillDate: Date | null;
  teams: GuildTeam[];
  onClose: () => void;
  onSubmit: (
    input: RaidEventInput
  ) => Promise<void>;
};

export function RaidEventModal({
  isOpen,
  prefillDate,
  teams,
  onClose,
  onSubmit
}: RaidEventModalProps) {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    const handleKeyDown = (
      event: KeyboardEvent
    ) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.body.style.overflow =
        previousOverflow;

      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="raid-event-modal-backdrop"
      onMouseDown={(event) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          onClose();
        }
      }}
      role="presentation"
    >
      <section
        aria-labelledby="raid-event-modal-title"
        aria-modal="true"
        className="raid-event-modal"
        role="dialog"
      >
        <div className="raid-event-modal-header">
          <div>
            <p className="eyebrow">
              NEW RAID
            </p>

            <h2 id="raid-event-modal-title">
              Schedule Raid
            </h2>

            <p>
              Create a raid event from the
              active Midnight content
              catalog.
            </p>
          </div>

          <button
            aria-label="Close"
            className="raid-event-modal-close"
            onClick={onClose}
            type="button"
          >
            ×
          </button>
        </div>

        <div className="raid-event-modal-body">
          <RaidEventForm
            event={null}
            key={
              prefillDate?.toISOString() ??
              "new-raid-event"
            }
            onCancel={onClose}
            onSubmit={onSubmit}
            prefillDate={prefillDate}
            teams={teams}
          />
        </div>
      </section>
    </div>
  );
}