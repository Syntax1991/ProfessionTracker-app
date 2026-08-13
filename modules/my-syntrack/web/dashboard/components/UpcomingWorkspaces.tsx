import { Link } from "react-router-dom";

const workspaces = [
  {
    title: "Weekly Checklist",
    description:
      "One reset view for every character and recurring task.",
    status: "Available",
    path: "/weekly-checklist"
  },
  {
    title: "Vault / M+",
    description:
      "Track reward slots, keys and weekly dungeon progress.",
    status: "Available",
    path: "/vault-mythic-plus"
  },
  {
    title: "Gear Readiness",
    description:
      "Surface missing enchants, gems and upgrade opportunities.",
    status: "Planned",
    path: null
  }
];

type Workspace =
  (typeof workspaces)[number];

function WorkspaceCardContent({
  workspace,
  index
}: {
  workspace: Workspace;
  index: number;
}) {
  return (
    <>
      <span className="my-upcoming-index">
        0{index + 1}
      </span>

      <div>
        <span className="my-upcoming-status">
          {workspace.status}
        </span>

        <h3>{workspace.title}</h3>

        <p>{workspace.description}</p>
      </div>

      {workspace.path && (
        <span
          aria-hidden="true"
          className="my-upcoming-arrow"
        >
          →
        </span>
      )}
    </>
  );
}

export function UpcomingWorkspaces() {
  return (
    <section className="my-upcoming-section">
      <div className="my-section-heading">
        <div>
          <p className="eyebrow">
            PERSONAL WORKSPACES
          </p>

          <h2>My SynTrack workspaces</h2>
        </div>

        <p>
          Progress appears here only when the
          underlying tracking is real.
        </p>
      </div>

      <div className="my-upcoming-grid">
        {workspaces.map((workspace, index) =>
          workspace.path ? (
            <Link
              className="my-upcoming-card is-available"
              key={workspace.title}
              to={workspace.path}
            >
              <WorkspaceCardContent
                index={index}
                workspace={workspace}
              />
            </Link>
          ) : (
            <article
              className="my-upcoming-card"
              key={workspace.title}
            >
              <WorkspaceCardContent
                index={index}
                workspace={workspace}
              />
            </article>
          )
        )}
      </div>
    </section>
  );
}
