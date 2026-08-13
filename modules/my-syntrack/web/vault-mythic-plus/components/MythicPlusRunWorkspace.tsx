import {
  useState,
  type FormEvent
} from "react";
import type {
  MythicPlusRunInput,
  VaultCharacter
} from "../types/vaultMythicPlus.types";

type MythicPlusRunWorkspaceProps = {
  character: VaultCharacter;
  pendingAction: string | null;
  onAddRun: (
    input: MythicPlusRunInput
  ) => Promise<boolean>;
  onDeleteRun: (runId: string) => void;
};

function formatKeyLevel(keyLevel: number) {
  return keyLevel === 0
    ? "M0"
    : `+${keyLevel}`;
}

export function MythicPlusRunWorkspace({
  character,
  pendingAction,
  onAddRun,
  onDeleteRun
}: MythicPlusRunWorkspaceProps) {
  const [dungeonName, setDungeonName] =
    useState("");
  const [keyLevel, setKeyLevel] =
    useState("2");

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const normalizedName =
      dungeonName.trim();
    const input: MythicPlusRunInput =
      normalizedName
        ? {
            dungeonName: normalizedName,
            keyLevel: Number(keyLevel)
          }
        : {
            keyLevel: Number(keyLevel)
          };
    const added = await onAddRun(input);

    if (added) {
      setDungeonName("");
    }
  };

  return (
    <section className="panel vault-runs-panel">
      <div className="panel-header vault-runs-header">
        <div>
          <p className="eyebrow">
            RUN LOG
          </p>

          <h2>{character.name}</h2>

          <p>
            {character.runs.length}
            {" "}
            {character.runs.length === 1
              ? "run"
              : "runs"}
            {" this period"}
          </p>
        </div>

        <form
          className="vault-run-form"
          onSubmit={(event) => {
            void handleSubmit(event);
          }}
        >
          <label>
            <span>Dungeon</span>
            <input
              maxLength={80}
              onChange={(event) =>
                setDungeonName(
                  event.target.value
                )
              }
              placeholder="Optional name"
              value={dungeonName}
            />
          </label>

          <label>
            <span>Key</span>
            <input
              inputMode="numeric"
              max={50}
              min={0}
              onChange={(event) =>
                setKeyLevel(
                  event.target.value
                )
              }
              required
              type="number"
              value={keyLevel}
            />
          </label>

          <button
            className="button button-primary"
            disabled={pendingAction !== null}
            type="submit"
          >
            {pendingAction === "add"
              ? "Adding…"
              : "Add run"}
          </button>
        </form>
      </div>

      {character.runs.length === 0 ? (
        <div className="vault-runs-empty">
          <strong>No runs logged yet</strong>
          <p>
            Add a completed Mythic or
            Mythic+ dungeon to calculate this
            character's Vault slots.
          </p>
        </div>
      ) : (
        <div className="vault-run-list">
          {character.runs.map(
            (run, index) => (
              <article
                className="vault-run-row"
                key={run.id}
              >
                <span className="vault-run-rank">
                  {String(index + 1).padStart(
                    2,
                    "0"
                  )}
                </span>

                <span className="vault-run-level">
                  {formatKeyLevel(run.keyLevel)}
                </span>

                <span className="vault-run-copy">
                  <strong>
                    {run.dungeonName ??
                      "Mythic+ dungeon"}
                  </strong>

                  <small>
                    {new Intl.DateTimeFormat(
                      "en",
                      {
                        day: "2-digit",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit"
                      }
                    ).format(
                      new Date(run.completedAt)
                    )}
                  </small>
                </span>

                <button
                  aria-label={
                    `Remove ${run.dungeonName ?? "dungeon"} ${formatKeyLevel(run.keyLevel)}`
                  }
                  className="vault-run-delete"
                  disabled={
                    pendingAction !== null
                  }
                  onClick={() =>
                    onDeleteRun(run.id)
                  }
                  type="button"
                >
                  ×
                </button>
              </article>
            )
          )}
        </div>
      )}
    </section>
  );
}
