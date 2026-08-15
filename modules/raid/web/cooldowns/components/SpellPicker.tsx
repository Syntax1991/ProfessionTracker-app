import {
  getSpellById,
  getSpellsForClass,
  type RaidCooldownSpell
} from "../../../shared/catalog/raidCooldownSpellCatalog";

type SpellPickerProps = {
  className: string;
  selectedSpellId: number | null;
  onSelect: (
    spell: RaidCooldownSpell | null
  ) => void;
};

export function SpellPicker({
  className,
  selectedSpellId,
  onSelect
}: SpellPickerProps) {
  const spells =
    getSpellsForClass(className);

  const byCategory = new Map<
    string,
    RaidCooldownSpell[]
  >();

  for (const spell of spells) {
    const group =
      byCategory.get(spell.category) ??
      [];

    group.push(spell);
    byCategory.set(spell.category, group);
  }

  const selectedSpell =
    selectedSpellId !== null
      ? getSpellById(selectedSpellId)
      : null;

  return (
    <div className="cooldown-spell-picker">
      {selectedSpell && (
        <img
          alt=""
          className="cooldown-spell-picker-icon"
          src={selectedSpell.icon}
        />
      )}

      <select
        onChange={(event) => {
          const value =
            event.target.value;

          onSelect(
            value
              ? getSpellById(
                  Number(value)
                )
              : null
          );
        }}
        value={selectedSpellId ?? ""}
      >
        <option value="">
          {spells.length === 0
            ? "No catalogued spells for this class"
            : "Select a spell…"}
        </option>

        {Array.from(
          byCategory.entries()
        ).map(([category, group]) => (
          <optgroup
            key={category}
            label={category}
          >
            {group.map((spell) => (
              <option
                key={spell.spellId}
                value={spell.spellId}
              >
                {spell.name}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
    </div>
  );
}
