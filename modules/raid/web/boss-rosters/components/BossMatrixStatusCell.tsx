import type { RaidBossRosterStatus } from "../types/bossRoster.types";

const cellLabel: Record<
  RaidBossRosterStatus,
  string
> = {
  CONFIRMED: "✓",
  TENTATIVE: "?",
  BENCH: "B"
};

const cellBarClass: Record<
  RaidBossRosterStatus,
  string
> = {
  CONFIRMED:
    "boss-matrix-bar confirmed",
  TENTATIVE:
    "boss-matrix-bar tentative",
  BENCH: "boss-matrix-bar bench"
};

type BossMatrixStatusCellProps = {
  displayStatus:
    | RaidBossRosterStatus
    | null;
  isSuggested: boolean;
  onClick: () => void;
};

export function BossMatrixStatusCell({
  displayStatus,
  isSuggested,
  onClick
}: BossMatrixStatusCellProps) {
  return (
    <td
      className="boss-matrix-cell"
      onClick={onClick}
      role="button"
      tabIndex={0}
    >
      <div
        className={
          displayStatus
            ? `${cellBarClass[displayStatus]}${isSuggested ? " suggested" : ""}`
            : "boss-matrix-bar empty"
        }
        title={
          isSuggested
            ? "Signed up present - not yet confirmed for this boss"
            : undefined
        }
      >
        {displayStatus
          ? cellLabel[displayStatus]
          : ""}
      </div>
    </td>
  );
}
