export function summarizeUnavailableRecipes(rows) {
  const byRecipe = new Map();

  for (const row of rows) {
    let item = byRecipe.get(row.recipeId);

    if (!item) {
      item = {
        recipeId: row.recipeId,
        recipeName: row.recipeName,
        categoryName: row.categoryName,
        parentCategoryName:
          row.parentCategoryName,
        occurrences: 0,
        characters: new Set(),
        professions: new Set()
      };

      byRecipe.set(row.recipeId, item);
    }

    item.occurrences += 1;
    item.characters.add(row.characterKey);
    item.professions.add(row.professionName);
  }

  return [...byRecipe.values()]
    .map((item) => ({
      recipeId: item.recipeId,
      recipeName: item.recipeName,
      categoryName: item.categoryName,
      parentCategoryName:
        item.parentCategoryName,
      occurrences: item.occurrences,
      characters:
        [...item.characters].sort(),
      professions:
        [...item.professions].sort()
    }))
    .sort(
      (left, right) =>
        right.occurrences -
          left.occurrences ||
        left.recipeId -
          right.recipeId
    );
}