import type {
  CharacterProfessionSpecialization,
  SpecializationNode
} from "../types/specialization.types";

export function flattenSpecializationNodes(
  nodes: SpecializationNode[]
): SpecializationNode[] {
  const flattened:
    SpecializationNode[] = [];

  for (const node of nodes) {
    flattened.push(node);

    flattened.push(
      ...flattenSpecializationNodes(
        node.children
      )
    );
  }

  return flattened;
}

export function getProfessionNodeIds(
  profession:
    CharacterProfessionSpecialization
): string[] {
  return profession.trees.flatMap(
    (tree) =>
      flattenSpecializationNodes(
        tree.nodes
      ).map(
        (node) =>
          node.id
      )
  );
}