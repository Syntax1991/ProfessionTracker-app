import type {
  PersonalRaidTask,
  RaidTaskCharacter,
  RaidTaskFilter
} from "../types/raidTask.types";

type RaidTaskBoardProps = {
  character: RaidTaskCharacter;
  filter: RaidTaskFilter;
  pendingAction: string | null;
  onFilterChange: (
    filter: RaidTaskFilter
  ) => void;
  onToggle: (
    taskId: string,
    completed: boolean
  ) => void;
  onDelete: (taskId: string) => void;
};

const categoryLabels = {
  PREPARATION: "Preparation",
  ASSIGNMENT: "Assignment",
  STRATEGY: "Strategy",
  CONSUMABLES: "Consumables"
};

function getDueState(task: PersonalRaidTask) {
  if (!task.dueAt || task.completedAt) {
    return null;
  }

  const dueAt = new Date(task.dueAt);
  const difference =
    dueAt.getTime() - Date.now();
  const urgent =
    difference <= 48 * 60 * 60 * 1000;

  return {
    label: difference < 0
      ? `Overdue - ${formatDate(dueAt)}`
      : `Due ${formatDate(dueAt)}`,
    urgent
  };
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat(
    "en",
    {
      weekday: "short",
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit"
    }
  ).format(date);
}

function getVisibleTasks(
  character: RaidTaskCharacter,
  filter: RaidTaskFilter
) {
  if (filter === "open") {
    return character.tasks.filter(
      (task) => !task.completedAt
    );
  }

  if (filter === "completed") {
    return character.tasks.filter(
      (task) => Boolean(task.completedAt)
    );
  }

  return character.tasks;
}

export function RaidTaskBoard({
  character,
  filter,
  pendingAction,
  onFilterChange,
  onToggle,
  onDelete
}: RaidTaskBoardProps) {
  const visibleTasks = getVisibleTasks(
    character,
    filter
  );

  return (
    <section className="panel raid-task-board">
      <div className="panel-header raid-task-board-header">
        <div>
          <p className="eyebrow">
            READINESS BOARD
          </p>

          <h2>{character.name}</h2>

          <p>
            {character.openTaskCount}
            {" open - "}
            {character.completedTaskCount}
            {" complete"}
          </p>
        </div>

        <div
          aria-label="Task filter"
          className="raid-task-filters"
          role="group"
        >
          {(["open", "completed", "all"] as const)
            .map((filterOption) => (
              <button
                aria-pressed={
                  filter === filterOption
                }
                className={
                  filter === filterOption
                    ? "is-active"
                    : ""
                }
                key={filterOption}
                onClick={() =>
                  onFilterChange(filterOption)
                }
                type="button"
              >
                {filterOption}
              </button>
            ))}
        </div>
      </div>

      {visibleTasks.length === 0 ? (
        <div className="raid-task-empty">
          <span className="raid-task-empty-mark">
            {filter === "open" ? "OK" : "--"}
          </span>

          <strong>
            {filter === "open"
              ? "No open raid tasks"
              : `No ${filter} tasks`}
          </strong>

          <p>
            {filter === "open"
              ? "This character has no remaining personal raid preparation."
              : "Change the filter or add a new raid task."}
          </p>
        </div>
      ) : (
        <div className="raid-task-list">
          {visibleTasks.map((task) => {
            const dueState =
              getDueState(task);
            const isPending =
              pendingAction === task.id;

            return (
              <article
                className={
                  task.completedAt
                    ? "raid-task-card is-completed"
                    : `raid-task-card priority-${task.priority.toLowerCase()}`
                }
                key={task.id}
              >
                <button
                  aria-label={
                    task.completedAt
                      ? `Reopen ${task.title}`
                      : `Complete ${task.title}`
                  }
                  className="raid-task-complete"
                  disabled={
                    pendingAction !== null
                  }
                  onClick={() =>
                    onToggle(
                      task.id,
                      !task.completedAt
                    )
                  }
                  type="button"
                >
                  {task.completedAt ? "OK" : ""}
                </button>

                <div className="raid-task-card-copy">
                  <div className="raid-task-card-labels">
                    <span>
                      {categoryLabels[task.category]}
                    </span>

                    <span
                      className={`raid-task-priority priority-${task.priority.toLowerCase()}`}
                    >
                      {task.priority}
                    </span>
                  </div>

                  <h3>{task.title}</h3>

                  {task.description && (
                    <p>{task.description}</p>
                  )}

                  <div className="raid-task-meta">
                    {task.raidName && (
                      <span>{task.raidName}</span>
                    )}

                    {dueState && (
                      <span
                        className={
                          dueState.urgent
                            ? "is-urgent"
                            : ""
                        }
                      >
                        {dueState.label}
                      </span>
                    )}

                    {task.completedAt && (
                      <span className="is-complete">
                        Completed {formatDate(
                          new Date(
                            task.completedAt
                          )
                        )}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  aria-label={`Delete ${task.title}`}
                  className="raid-task-delete"
                  disabled={
                    pendingAction !== null
                  }
                  onClick={() =>
                    onDelete(task.id)
                  }
                  type="button"
                >
                  {isPending ? "..." : "Delete"}
                </button>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
