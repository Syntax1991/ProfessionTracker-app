import {
  useMemo,
  useState
} from "react";
import type {
  ProfessionRecipeCraftStatus
} from "../types/professionRecipe.types";
import {
  ProfessionCrafterRecipeTable
} from "./ProfessionCrafterRecipeTable";
import {
  ProfessionCrafterSummaryHeader
} from "./ProfessionCrafterSummaryHeader";
import {
  getCrafterGroups,
  matchesCrafterRecipeQuery
} from "./professionCrafterView.helpers";
import type {
  ProfessionCrafterSummary
} from "./professionCrafterView.helpers";

type StatusFilter =
  | "ALL"
  | ProfessionRecipeCraftStatus;

export function ProfessionCrafterCharacterPanel({
  summary
}: {
  summary:
    ProfessionCrafterSummary;
}) {
  const [
    query,
    setQuery
  ] =
    useState(
      ""
    );

  const [
    statusFilter,
    setStatusFilter
  ] =
    useState<StatusFilter>(
      "ALL"
    );

  const [
    groupFilter,
    setGroupFilter
  ] =
    useState(
      "ALL"
    );

  const entries =
    summary.entries;

  const groups =
    useMemo(
      () =>
        getCrafterGroups(
          entries
        ),
      [
        entries
      ]
    );

  const activeGroup =
    groupFilter === "ALL" ||
    groups.includes(
      groupFilter
    )
      ? groupFilter
      : "ALL";

  const filteredEntries =
    useMemo(
      () =>
        entries.filter(
          (entry) =>
            (
              activeGroup ===
                "ALL" ||
              entry.group ===
                activeGroup
            ) &&
            (
              statusFilter ===
                "ALL" ||
              entry.crafter
                .craftStatus ===
                statusFilter
            ) &&
            matchesCrafterRecipeQuery(
              entry,
              query
            )
        ),
      [
        activeGroup,
        entries,
        query,
        statusFilter
      ]
    );

  return (
    <>
      <ProfessionCrafterSummaryHeader
        summary={
          summary
        }
      />

      <section className="panel profession-crafter-toolbar">
        <label>
          <span>
            Rezept suchen
          </span>

          <input
            onChange={
              (event) =>
                setQuery(
                  event.target.value
                )
            }
            placeholder="Rezept oder Kategorie..."
            type="search"
            value={query}
          />
        </label>

        <label>
          <span>
            Status
          </span>

          <select
            onChange={
              (event) =>
                setStatusFilter(
                  event.target
                    .value as
                    StatusFilter
                )
            }
            value={statusFilter}
          >
            <option value="ALL">
              Alle
            </option>

            <option value="SAFE">
              Safe
            </option>

            <option value="CONCENTRATION">
              Konzentration
            </option>

            <option value="NOT_SAFE">
              Nicht safe
            </option>

            <option value="UNKNOWN">
              Unbekannt
            </option>
          </select>
        </label>
      </section>

      <div className="profession-crafter-groups">
        <button
          className={
            activeGroup ===
            "ALL"
              ? "active"
              : ""
          }
          onClick={
            () =>
              setGroupFilter(
                "ALL"
              )
          }
          type="button"
        >
          Alle

          <span>
            {entries.length}
          </span>
        </button>

        {groups.map(
          (group) => {
            const count =
              entries.filter(
                (entry) =>
                  entry.group ===
                  group
              ).length;

            return (
              <button
                className={
                  activeGroup ===
                  group
                    ? "active"
                    : ""
                }
                key={group}
                onClick={
                  () =>
                    setGroupFilter(
                      group
                    )
                }
                type="button"
              >
                {group}

                <span>
                  {count}
                </span>
              </button>
            );
          }
        )}
      </div>

      <div className="profession-crafter-result-count">
        <strong>
          {
            filteredEntries
              .length
          }
        </strong>

        <span>
          {" passende Rezepte"}
        </span>
      </div>

      <ProfessionCrafterRecipeTable
        entries={
          filteredEntries
        }
      />
    </>
  );
}