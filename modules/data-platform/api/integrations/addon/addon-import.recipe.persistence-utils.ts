export function createRecipeMapKey(
  skillLineId: number,
  gameRecipeId: number
): string {
  return [
    skillLineId,
    gameRecipeId
  ].join(":");
}