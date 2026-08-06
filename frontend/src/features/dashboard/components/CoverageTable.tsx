import type { ProfessionCoverage } from "../types/dashboard.types";

type CoverageTableProps = {
  coverage: ProfessionCoverage[];
};

export function CoverageTable({
  coverage
}: CoverageTableProps) {
  return (
    <div className="table-scroll">
      <table>
        <thead>
          <tr>
            <th>Beruf</th>
            <th>Kategorie</th>
            <th>Charaktere</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {coverage.map((profession) => (
            <tr key={profession.id}>
              <td>
                <strong>
                  {profession.name}
                </strong>
              </td>

              <td>
                {profession.category ===
                "GATHERING"
                  ? "Sammeln"
                  : "Herstellung"}
              </td>

              <td>
                {profession.assignmentCount}
              </td>

              <td>
                <span
                  className={
                    profession.assignmentCount >
                    0
                      ? "coverage-badge covered"
                      : "coverage-badge missing"
                  }
                >
                  {profession.assignmentCount >
                  0
                    ? "Abgedeckt"
                    : "Fehlt"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}