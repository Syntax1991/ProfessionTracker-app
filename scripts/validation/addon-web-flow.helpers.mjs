import fs from "node:fs";

export function flattenNodes(
  nodes
) {
  const result = [];

  for (const node of nodes) {
    result.push(node);

    result.push(
      ...flattenNodes(
        node.children ?? []
      )
    );
  }

  return result;
}

export async function fetchJson(
  url
) {
  const response =
    await fetch(url);

  const body =
    await response.text();

  if (!response.ok) {
    throw new Error(
      `${response.status} ${response.statusText}: ${body}`
    );
  }

  return JSON.parse(body);
}

export function verifyFrontendWiring(
  specializationApiPath,
  appRouterPath
) {
  const specializationApi =
    fs.readFileSync(
      specializationApiPath,
      "utf8"
    );

  const appRouter =
    fs.readFileSync(
      appRouterPath,
      "utf8"
    );

  if (
    !specializationApi.includes(
      "/characters/${characterId}/specializations"
    )
  ) {
    throw new Error(
      "Frontend specialization API uses an unexpected endpoint."
    );
  }

  if (
    !appRouter.includes(
      "CharacterSpecializationsPage"
    )
  ) {
    throw new Error(
      "CharacterSpecializationsPage is not registered."
    );
  }

  if (
    !appRouter.includes(
      'path="characters/:characterId"'
    )
  ) {
    throw new Error(
      "Character detail route is missing."
    );
  }
}

function collectAddonNodes(
  overview
) {
  const matches = [];

  for (
    const profession of
    overview.professions ?? []
  ) {
    for (
      const tree of
      profession.trees ?? []
    ) {
      for (
        const node of
        flattenNodes(
          tree.nodes ?? []
        )
      ) {
        if (
          node.source !==
          "ADDON"
        ) {
          continue;
        }

        matches.push({
          profession,
          tree,
          node
        });
      }
    }
  }

  return matches;
}

export async function findAddonCoverage(
  baseUrl,
  characters
) {
  for (
    const character of
    characters
  ) {
    const overview =
      await fetchJson(
        `${baseUrl}/characters/${character.id}/specializations`
      );

    const matches =
      collectAddonNodes(
        overview
      );

    const active =
      matches.filter(
        (match) =>
          match.node.rank > 0
      );

    if (
      active.length > 0
    ) {
      return {
        overview,
        matches,
        active
      };
    }
  }

  return null;
}

export function assertRankBounds(
  matches
) {
  const invalid =
    matches.filter(
      ({
        node
      }) =>
        node.maxRank !== null &&
        node.rank >
          node.maxRank
    );

  if (
    invalid.length === 0
  ) {
    return;
  }

  const details =
    invalid.map(
      ({
        profession,
        tree,
        node
      }) =>
        [
          profession.profession.name,
          tree.name,
          node.name,
          `${node.rank}/${node.maxRank}`
        ].join(" -> ")
    );

  throw new Error(
    `Imported rank exceeds maxRank: ${details.join("; ")}`
  );
}

export function createCoverageSummary(
  result
) {
  const firstProfession =
    result.active[0]
      .profession;

  const activeNodes =
    result.active.map(
      ({
        tree,
        node
      }) => ({
        tree:
          tree.name,
        expansion:
          tree.expansion,
        node:
          node.name,
        rank:
          node.rank,
        maxRank:
          node.maxRank,
        source:
          node.source
      })
    );

  return {
    character: {
      name:
        result
          .overview
          .character
          .name,
      realm:
        result
          .overview
          .character
          .realm
    },
    profession: {
      name:
        firstProfession
          .profession
          .name,
      skill:
        firstProfession
          .skill,
      knowledgePoints:
        firstProfession
          .knowledgePoints
    },
    addonNodes:
      activeNodes.length,
    sample:
      activeNodes.slice(
        0,
        12
      )
  };
}