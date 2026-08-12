import { Link } from "react-router-dom";
import type {
  ProfessionOverviewItem
} from "../types/professionDetail.types";

type ProfessionOverviewCardProps = {
  profession:
    ProfessionOverviewItem;
};

function getCategoryLabel(
  category: string
): string {
  return category === "GATHERING"
    ? "Gathering profession"
    : "Crafting profession";
}

function formatCaptureDate(
  value: string
): string {
  const date =
    new Date(
      value
    );

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "Captured";
  }

  return new Intl.DateTimeFormat(
    "en-GB",
    {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit"
    }
  ).format(
    date
  );
}

function getCapturePresentation(
  profession:
    ProfessionOverviewItem
): {
  badge: string;
  detail: string;
  className: string;
} {
  switch (
    profession.captureStatus
  ) {
    case "CAPTURED":
      return {
        badge:
          "Captured",
        detail:
          profession.lastCapturedAt
            ? formatCaptureDate(
                profession.lastCapturedAt
              )
            : "Recipe data available",
        className:
          "captured"
      };

    case "NOT_CAPTURED":
      return {
        badge:
          "Capture needed",
        detail:
          "Open once in WoW",
        className:
          "not-captured"
      };

    case "NOT_REQUIRED":
      return {
        badge:
          "No capture needed",
        detail:
          "Gathering profession",
        className:
          "not-required"
      };
  }
}

export function ProfessionOverviewCard({
  profession
}: ProfessionOverviewCardProps) {
  const capture =
    getCapturePresentation(
      profession
    );

  return (
    <Link
      className="profession-overview-card"
      to={
        `/professions/${profession.id}`
      }
    >
      <div className="profession-overview-card-header">
        <div>
          <span>
            {getCategoryLabel(
              profession.category
            )}
          </span>

          <h3>
            {profession.name}
          </h3>
        </div>

        <span className="profession-card-arrow">
          →
        </span>
      </div>

      <div className="profession-overview-card-count">
        <strong>
          {profession.characterCount}
        </strong>

        <span>
          assigned characters
        </span>
      </div>

      <div className="profession-overview-card-meta">
        <span>
          {
            profession
              .trackedCharacterCount
          }
          {" with specialization data"}
        </span>

        <span>
          {profession.activeNodeCount}
          {" active paths/slots"}
        </span>
      </div>

      <div className="profession-overview-capture">
        <span
          className={
            `profession-capture-badge ${capture.className}`
          }
        >
          {capture.badge}
        </span>

        <div>
          <strong>
            {capture.detail}
          </strong>

          {profession.captureStatus ===
            "CAPTURED" && (
            <small>
              Refresh only when profession
              data changes.
            </small>
          )}

          {profession.captureStatus ===
            "NOT_CAPTURED" && (
            <small>
              One initial profession-window
              capture is required.
            </small>
          )}

          {profession.captureStatus ===
            "NOT_REQUIRED" && (
            <small>
              No recipe window needs to be
              opened.
            </small>
          )}
        </div>
      </div>
    </Link>
  );
}