import type {
  RaidSignupEntry,
  RaidSignupStatus
} from "../types/signup.types";

type SignupOfficerGridProps = {
  entries: RaidSignupEntry[];
  onSetStatus: (
    memberId: string,
    status: RaidSignupStatus
  ) => void;
  onClear: (
    memberId: string
  ) => void;
};

const statuses: RaidSignupStatus[] =
  [
    "PRESENT",
    "TENTATIVE",
    "ABSENT"
  ];

export function SignupOfficerGrid({
  entries,
  onSetStatus,
  onClear
}: SignupOfficerGridProps) {
  if (entries.length === 0) {
    return (
      <div className="empty-state">
        No guild members yet.
      </div>
    );
  }

  return (
    <div className="table-scroll">
      <table>
        <thead>
          <tr>
            <th>Member</th>
            <th>Status</th>
            <th aria-label="Actions" />
          </tr>
        </thead>

        <tbody>
          {entries.map((entry) => (
            <tr key={entry.member.id}>
              <td>
                {entry.member.name}
              </td>

              <td>
                <div className="attendance-status-buttons">
                  {statuses.map(
                    (status) => (
                      <button
                        className={
                          entry.status ===
                          status
                            ? "attendance-status-button selected"
                            : "attendance-status-button"
                        }
                        key={status}
                        onClick={() =>
                          onSetStatus(
                            entry.member
                              .id,
                            status
                          )
                        }
                        type="button"
                      >
                        {status}
                      </button>
                    )
                  )}
                </div>
              </td>

              <td>
                {entry.status && (
                  <button
                    className="text-button"
                    onClick={() =>
                      onClear(
                        entry.member
                          .id
                      )
                    }
                    type="button"
                  >
                    Clear
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
