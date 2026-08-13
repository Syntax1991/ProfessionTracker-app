import type { SpecializationTree } from "../types/specialization.types";
import { SpecializationNodeEditor } from "./SpecializationNodeEditor";

type SpecializationTreeCardProps = {
  tree: SpecializationTree;
  ranks: Record<string, number>;
  onRankChange: (
    nodeId: string,
    rank: number
  ) => void;
};

export function SpecializationTreeCard({
  tree,
  ranks,
  onRankChange
}: SpecializationTreeCardProps) {
  return (
    <article className="specialization-tree-card">
      <header>
        <div>
          <span className="category-badge">
            {tree.expansion}
          </span>

          <h3>
            {tree.name}
          </h3>
        </div>
      </header>

      {tree.description && (
        <p className="specialization-tree-description">
          {tree.description}
        </p>
      )}

      <div className="specialization-node-list">
        {tree.nodes.map(
          (node) => (
            <SpecializationNodeEditor
              childRanks={
                ranks
              }
              key={
                node.id
              }
              node={
                node
              }
              onRankChange={
                onRankChange
              }
              rank={
                ranks[
                  node.id
                ] ?? 0
              }
            />
          )
        )}
      </div>
    </article>
  );
}