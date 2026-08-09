function scalarKey(present, value) {
  if (!present) {
    return "__ABSENT__";
  }

  return `${typeof value}:${JSON.stringify(value)}`;
}

function collectMetricKeys(rows) {
  const keys = new Set();

  for (const row of rows) {
    for (const key of Object.keys(row.metrics)) {
      keys.add(key);
    }
  }

  return [...keys].sort();
}

function compareMetricKey(rows, key) {
  const observations = rows.map((row) => {
    const present = Object.prototype.hasOwnProperty.call(
      row.metrics,
      key
    );

    return {
      characterKey: row.characterKey,
      present,
      value: present ? row.metrics[key] : null
    };
  });

  const distinctValues = new Set(
    observations.map(
      (observation) =>
        scalarKey(
          observation.present,
          observation.value
        )
    )
  );

  return {
    key,
    differs: distinctValues.size > 1,
    observations
  };
}

export function compareRecipeMetricValues(rows) {
  const comparedKeys = [];
  const differingKeys = [];
  const values = {};

  for (const key of collectMetricKeys(rows)) {
    const comparison = compareMetricKey(rows, key);

    comparedKeys.push(key);

    if (!comparison.differs) {
      continue;
    }

    differingKeys.push(key);
    values[key] = comparison.observations;
  }

  return {
    comparedKeys,
    differingKeys,
    values
  };
}