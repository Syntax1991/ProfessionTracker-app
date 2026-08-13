import type {
  GuildRosterImportPreview
} from "../types/rosterImport.types";

type RosterImportPreviewPanelProps = {
  preview: GuildRosterImportPreview;
};

export function RosterImportPreviewPanel({
  preview
}: RosterImportPreviewPanelProps) {
  return (
    <section className="panel addon-preview-panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">
            PREVIEW
          </p>

          <h2>
            {preview.guildName}
          </h2>
        </div>

        <span className="integration-badge configured">
          Schema {preview.schemaVersion}
        </span>
      </div>

      <div className="addon-summary-grid">
        <div>
          <span>
            Members
          </span>

          <strong>
            {preview.totalMembers}
          </strong>
        </div>

        <div>
          <span>
            Realm
          </span>

          <strong>
            {preview.realm}
          </strong>
        </div>

        <div>
          <span>
            Region
          </span>

          <strong>
            {preview.region.toUpperCase()}
          </strong>
        </div>
      </div>

      <div className="addon-preview-meta">
        <span>
          Addon: {preview.addonVersion}
        </span>

        <span>
          Captured: {preview.capturedAt ?? "unknown"}
        </span>
      </div>

      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Member</th>
              <th>Class</th>
              <th>Level</th>
              <th>Rank</th>
            </tr>
          </thead>

          <tbody>
            {preview.members.map(
              (member) => (
                <tr
                  key={
                    `${member.name}-${member.rank}`
                  }
                >
                  <td>
                    {member.name}
                  </td>

                  <td>
                    {member.className}
                  </td>

                  <td>
                    {member.level}
                  </td>

                  <td>
                    {member.rank}
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
