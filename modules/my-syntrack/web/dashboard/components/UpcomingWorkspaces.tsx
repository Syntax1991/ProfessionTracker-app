const workspaces = [
  {
    title: "Weekly Checklist",
    description:
      "One reset view for every character and recurring task.",
    status: "Next up"
  },
  {
    title: "Vault / M+",
    description:
      "Track reward slots, keys and weekly dungeon progress.",
    status: "Planned"
  },
  {
    title: "Gear Readiness",
    description:
      "Surface missing enchants, gems and upgrade opportunities.",
    status: "Planned"
  }
];

export function UpcomingWorkspaces() {
  return (
    <section className="my-upcoming-section">
      <div className="my-section-heading">
        <div>
          <p className="eyebrow">
            PERSONAL WORKSPACES
          </p>

          <h2>Coming to My SynTrack</h2>
        </div>

        <p>
          Progress appears here only when the
          underlying tracking is real.
        </p>
      </div>

      <div className="my-upcoming-grid">
        {workspaces.map((workspace, index) => (
          <article
            className={
              index === 0
                ? "my-upcoming-card is-next"
                : "my-upcoming-card"
            }
            key={workspace.title}
          >
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
          </article>
        ))}
      </div>
    </section>
  );
}
