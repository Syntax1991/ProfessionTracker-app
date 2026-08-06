type BattleNetCharacterFiltersProps = {
  search: string;
  realm: string;
  className: string;
  minimumLevel: number;
  realms: string[];
  classes: string[];
  onSearchChange: (
    value: string
  ) => void;
  onRealmChange: (
    value: string
  ) => void;
  onClassChange: (
    value: string
  ) => void;
  onMinimumLevelChange: (
    value: number
  ) => void;
};

export function BattleNetCharacterFilters({
  search,
  realm,
  className,
  minimumLevel,
  realms,
  classes,
  onSearchChange,
  onRealmChange,
  onClassChange,
  onMinimumLevelChange
}: BattleNetCharacterFiltersProps) {
  return (
    <div className="battlenet-filter-grid">
      <label>
        <span>Suche</span>

        <input
          onChange={(event) =>
            onSearchChange(
              event.target.value
            )
          }
          placeholder="Name, Realm oder Klasse"
          type="search"
          value={search}
        />
      </label>

      <label>
        <span>Realm</span>

        <select
          onChange={(event) =>
            onRealmChange(
              event.target.value
            )
          }
          value={realm}
        >
          <option value="ALL">
            Alle Realms
          </option>

          {realms.map(
            (realmOption) => (
              <option
                key={realmOption}
                value={realmOption}
              >
                {realmOption}
              </option>
            )
          )}
        </select>
      </label>

      <label>
        <span>Klasse</span>

        <select
          onChange={(event) =>
            onClassChange(
              event.target.value
            )
          }
          value={className}
        >
          <option value="ALL">
            Alle Klassen
          </option>

          {classes.map(
            (classOption) => (
              <option
                key={classOption}
                value={classOption}
              >
                {classOption}
              </option>
            )
          )}
        </select>
      </label>

      <label>
        <span>Mindestlevel</span>

        <input
          max={100}
          min={1}
          onChange={(event) =>
            onMinimumLevelChange(
              Number(
                event.target.value
              )
            )
          }
          type="number"
          value={minimumLevel}
        />
      </label>
    </div>
  );
}