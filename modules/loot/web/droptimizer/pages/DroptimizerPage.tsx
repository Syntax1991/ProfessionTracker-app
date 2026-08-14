import { useState } from "react";
import { LoadingPanel } from "../../../../../apps/web/src/shared/components/LoadingPanel";
import { PageHeader } from "../../../../../apps/web/src/shared/components/PageHeader";
import { StatusMessage } from "../../../../../apps/web/src/shared/components/StatusMessage";
import { useMyDroptimizerReport } from "../hooks/useMyDroptimizerReport";

const slotLabels: Record<string, string> = {
  HEAD: "Head",
  NECK: "Neck",
  SHOULDER: "Shoulder",
  CLOAK: "Cloak",
  CHEST: "Chest",
  WRIST: "Wrist",
  HAND: "Hands",
  WAIST: "Waist",
  LEGS: "Legs",
  FEET: "Feet",
  FINGER: "Ring",
  TRINKET: "Trinket",
  HOLDABLE: "Off Hand",
  SHIELD: "Shield",
  WEAPON: "Weapon",
  WEAPONMAINHAND: "Main Hand",
  RANGEDRIGHT: "Ranged",
  TWOHWEAPON: "Two-Hand Weapon"
};

export function DroptimizerPage() {
  const {
    report,
    isLoading,
    error,
    submitReportUrl,
    clearReport
  } = useMyDroptimizerReport();

  const [reportUrl, setReportUrl] =
    useState("");

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const handleSubmit = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    if (!reportUrl.trim()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await submitReportUrl(
        reportUrl.trim()
      );
      setReportUrl("");
    }
    catch {
      // error already surfaced via StatusMessage
    }
    finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <PageHeader
        description="Paste your Raidbots Droptimizer report to see your best real upgrades from this raid."
        eyebrow="LOOT"
        title="Droptimizer"
      />

      {error && (
        <StatusMessage type="error">
          {error}
        </StatusMessage>
      )}

      <section className="panel">
        <form
          className="boss-add-form"
          onSubmit={handleSubmit}
        >
          <input
            onChange={(event) =>
              setReportUrl(
                event.target.value
              )
            }
            placeholder="https://www.raidbots.com/simbot/report/..."
            type="text"
            value={reportUrl}
          />

          <button
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting
              ? "Loading…"
              : "Load report"}
          </button>
        </form>
      </section>

      {isLoading ? (
        <LoadingPanel />
      ) : report ? (
        <section className="panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">
                {report.charClass}
                {" — "}
                {report.spec}
              </p>

              <h2>
                {report.publicTitle}
              </h2>

              <p className="page-description">
                Baseline DPS:{" "}
                {Math.round(
                  report.baselineDps
                ).toLocaleString()}
              </p>
            </div>

            <button
              onClick={() =>
                void clearReport()
              }
              type="button"
            >
              Remove report
            </button>
          </div>

          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Slot</th>
                  <th>Boss</th>
                  <th>Ilvl</th>
                  <th>DPS Gain</th>
                  <th>Gain %</th>
                </tr>
              </thead>

              <tbody>
                {report.upgrades.map(
                  (upgrade) => (
                    <tr
                      key={
                        upgrade.itemId
                      }
                    >
                      <td>
                        {upgrade.name}
                      </td>

                      <td>
                        {slotLabels[
                          upgrade.slot
                        ] ??
                          upgrade.slot}
                      </td>

                      <td>
                        {
                          upgrade.bossName
                        }
                      </td>

                      <td>
                        {
                          upgrade.itemLevel
                        }
                      </td>

                      <td>
                        +
                        {Math.round(
                          upgrade.dpsGain
                        ).toLocaleString()}
                      </td>

                      <td>
                        +
                        {upgrade.dpsGainPct.toFixed(
                          2
                        )}
                        %
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}
    </div>
  );
}
