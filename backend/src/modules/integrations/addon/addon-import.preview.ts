import type {
  AddonImportPreview,
  AddonSnapshot
} from "./addon-import.types.js";

export function createAddonImportPreview(
  snapshot: AddonSnapshot
): AddonImportPreview {
  const catalogs =
    snapshot.catalogs.map(
      (catalog) => ({
        skillLineId:
          catalog.skillLineId,
        displayName:
          catalog.displayName,
        expansionName:
          catalog.expansionName,
        trees:
          catalog.trees.length,
        specializationNodes:
          catalog.trees.reduce(
            (
              total,
              tree
            ) =>
              total +
              tree.nodes.length,
            0
          )
      })
    );

  const characters =
    snapshot.characters.map(
      (character) => ({
        key:
          character.key,
        name:
          character.name,
        realm:
          character.realm,
        region:
          character.region,
        className:
          character.className,
        level:
          character.level,
        professions:
          character.professions.map(
            (profession) => ({
              name:
                profession.name,
              professionKey:
                profession
                  .professionKey,
              skillLevel:
                profession
                  .skillLevel,
              maxSkillLevel:
                profession
                  .maxSkillLevel,
              expansions:
                profession
                  .expansions
                  .length,
              investedKnowledge:
                profession
                  .expansions
                  .reduce(
                    (
                      total,
                      expansion
                    ) =>
                      total +
                      expansion
                        .investedKnowledge,
                    0
                  )
            })
          )
      })
    );

  let professionAssignments = 0;
  let expansions = 0;
  let investedNodes = 0;
  let investedKnowledge = 0;

  for (
    const character of
    snapshot.characters
  ) {
    professionAssignments +=
      character
        .professions
        .length;

    for (
      const profession of
      character.professions
    ) {
      expansions +=
        profession
          .expansions
          .length;

      for (
        const expansion of
        profession.expansions
      ) {
        investedNodes +=
          expansion
            .progress
            .length;

        investedKnowledge +=
          expansion
            .investedKnowledge;
      }
    }
  }

  return {
    addonVersion:
      snapshot.addonVersion,
    schemaVersion:
      snapshot.schemaVersion,
    client:
      snapshot.client,
    catalogs,
    characters,
    totals: {
      characters:
        snapshot
          .characters
          .length,
      professionAssignments,
      expansions,
      trees:
        catalogs.reduce(
          (
            total,
            catalog
          ) =>
            total +
            catalog.trees,
          0
        ),
      specializationNodes:
        catalogs.reduce(
          (
            total,
            catalog
          ) =>
            total +
            catalog
              .specializationNodes,
          0
        ),
      investedNodes,
      investedKnowledge
    }
  };
}