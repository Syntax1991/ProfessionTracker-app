import type {
  WeeklyChecklistCharacter,
  WeeklyChecklistTask
} from "../types/weeklyChecklist.types";

type WeeklyTaskListProps = {
  character: WeeklyChecklistCharacter;
  tasks: WeeklyChecklistTask[];
  pendingAction: string | null;
  onToggleTask: (
    taskKey: string,
    completed: boolean
  ) => void;
  onToggleAll: (completed: boolean) => void;
};

export function WeeklyTaskList({
  character,
  tasks,
  pendingAction,
  onToggleTask,
  onToggleAll
}: WeeklyTaskListProps) {
  const completedKeys = new Set(
    character.completedTaskKeys
  );
  const allCompleted =
    tasks.length > 0 &&
    completedKeys.size === tasks.length;

  return (
    <section className="panel weekly-tasks-panel">
      <div className="panel-header weekly-tasks-header">
        <div>
          <p className="eyebrow">
            ACTIVE CHECKLIST
          </p>

          <h2>{character.name}</h2>

          <p>
            {character.className}
            {" · Level "}
            {character.level}
            {" · "}
            {character.realm}
          </p>
        </div>

        <button
          className="button button-secondary"
          disabled={pendingAction !== null}
          onClick={() =>
            onToggleAll(!allCompleted)
          }
          type="button"
        >
          {allCompleted
            ? "Clear character"
            : "Complete all"}
        </button>
      </div>

      <div className="weekly-task-list">
        {tasks.map((task) => {
          const completed =
            completedKeys.has(task.key);
          const actionKey =
            `${character.id}:${task.key}`;
          const isPending =
            pendingAction === actionKey ||
            pendingAction ===
              `${character.id}:all`;

          return (
            <button
              aria-pressed={completed}
              className={
                completed
                  ? "weekly-task-row is-completed"
                  : "weekly-task-row"
              }
              disabled={
                pendingAction !== null
              }
              key={task.key}
              onClick={() =>
                onToggleTask(
                  task.key,
                  !completed
                )
              }
              type="button"
            >
              <span className="weekly-task-check">
                {isPending
                  ? "…"
                  : completed
                    ? "✓"
                    : ""}
              </span>

              <span className="weekly-task-copy">
                <span className="weekly-task-category">
                  {task.category}
                </span>

                <strong>{task.title}</strong>

                <small>
                  {task.description}
                </small>
              </span>

              <span className="weekly-task-state">
                {completed ? "Done" : "Open"}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
