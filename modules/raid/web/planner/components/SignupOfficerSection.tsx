import { LoadingPanel } from "../../../../../apps/web/src/shared/components/LoadingPanel";
import { SignupOfficerGrid } from "../../signups/components/SignupOfficerGrid";
import type {
  RaidSignupEntry,
  RaidSignupStatus
} from "../../signups/types/signup.types";

type SignupOfficerSectionProps = {
  entries: RaidSignupEntry[];
  isLoading: boolean;
  onSetStatus: (
    memberId: string,
    status: RaidSignupStatus
  ) => void;
  onClear: (
    memberId: string
  ) => void;
};

export function SignupOfficerSection({
  entries,
  isLoading,
  onSetStatus,
  onClear
}: SignupOfficerSectionProps) {
  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">
            OFFICER OVERVIEW
          </p>

          <h2>
            {
              entries.filter(
                (entry) =>
                  entry.status !==
                  null
              ).length
            }{" "}
            of {entries.length} signed
            up
          </h2>
        </div>
      </div>

      {isLoading ? (
        <LoadingPanel />
      ) : (
        <SignupOfficerGrid
          entries={entries}
          onClear={onClear}
          onSetStatus={onSetStatus}
        />
      )}
    </section>
  );
}
