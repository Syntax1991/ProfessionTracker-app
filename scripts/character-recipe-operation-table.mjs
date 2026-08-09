export function isLuaTable(value) {
  return typeof value === "object" && value !== null;
}

function numericKey(value) {
  const number = Number(value);

  return Number.isFinite(number) &&
    String(number) === value
      ? number
      : null;
}

function compareLuaKeys([left], [right]) {
  const leftNumber = numericKey(left);
  const rightNumber = numericKey(right);

  if (leftNumber !== null && rightNumber !== null) {
    return leftNumber - rightNumber;
  }

  if (leftNumber !== null) {
    return -1;
  }

  if (rightNumber !== null) {
    return 1;
  }

  return left.localeCompare(right);
}

export function luaEntries(value) {
  if (!isLuaTable(value)) {
    return [];
  }

  return Object.entries(value).sort(compareLuaKeys);
}

export function luaValues(value) {
  return luaEntries(value).map(([, entry]) => entry);
}

export function numberOrNull(value) {
  return typeof value === "number" && Number.isFinite(value)
    ? value
    : null;
}

export function stringOrNull(value) {
  return typeof value === "string"
    ? value
    : null;
}

export function scalarObject(value) {
  if (!isLuaTable(value)) {
    return {};
  }

  const result = {};

  for (const [key, entry] of Object.entries(value)) {
    if (
      typeof entry === "string" ||
      typeof entry === "number" ||
      typeof entry === "boolean"
    ) {
      result[key] = entry;
    }
  }

  return result;
}