import { raidSeasons } from "../../../shared/catalog/raidCatalog";

export type AttendanceSeasonFilterValue =
  | number
  | "all";

type AttendanceSeasonFilterProps = {
  value: AttendanceSeasonFilterValue;
  onChange: (
    value: AttendanceSeasonFilterValue
  ) => void;
};

export function AttendanceSeasonFilter({
  value,
  onChange
}: AttendanceSeasonFilterProps) {
  return (
    <select
      onChange={(event) =>
        onChange(
          event.target.value ===
            "all"
            ? "all"
            : Number(
                event.target.value
              )
        )
      }
      value={value}
    >
      {[...raidSeasons]
        .reverse()
        .map((season) => (
          <option
            key={season.season}
            value={season.season}
          >
            {season.label}
          </option>
        ))}

      <option value="all">
        All time
      </option>
    </select>
  );
}
