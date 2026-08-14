import { useRaiderLink } from "../../../../guild/web/raider-link/hooks/useRaiderLink";
import { LoadingPanel } from "../../../../../apps/web/src/shared/components/LoadingPanel";
import type {
  RaidSignupEntry,
  RaidSignupStatus
} from "../types/signup.types";

type MySignupCardProps = {
  entries: RaidSignupEntry[];
  isSubmitting: boolean;
  onSetOwnStatus: (
    status: RaidSignupStatus
  ) => void;
};

const statuses: RaidSignupStatus[] =
  [
    "PRESENT",
    "TENTATIVE",
    "ABSENT"
  ];

export function MySignupCard({
  entries,
  isSubmitting,
  onSetOwnStatus
}: MySignupCardProps) {
  const raiderLink = useRaiderLink();

  if (raiderLink.isLoading) {
    return <LoadingPanel />;
  }

  if (
    raiderLink.resolution
      ?.status !== "linked"
  ) {
    return (
      <section className="panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">
              MY SIGNUP
            </p>

            <h2>
              Finish linking your character
            </h2>
          </div>
        </div>

        <p className="muted-text">
          Pick your character under &quot;My Raider Login&quot; in the
          Guild menu to sign up for raids yourself.
        </p>
      </section>
    );
  }

  const linkedMember =
    raiderLink.resolution.member;

  const ownEntry = entries.find(
    (entry) =>
      entry.member.id ===
      linkedMember.id
  );

  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">
            MY SIGNUP
          </p>

          <h2>
            {linkedMember.name}
          </h2>
        </div>
      </div>

      <div className="attendance-status-buttons">
        {statuses.map((status) => (
          <button
            className={
              ownEntry?.status ===
              status
                ? "attendance-status-button selected"
                : "attendance-status-button"
            }
            disabled={isSubmitting}
            key={status}
            onClick={() =>
              onSetOwnStatus(status)
            }
            type="button"
          >
            {status}
          </button>
        ))}
      </div>
    </section>
  );
}
