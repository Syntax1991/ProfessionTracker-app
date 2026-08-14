import type { CSSProperties } from "react";
import { resolveClassColor } from "../../../../guild/web/roster/utils/classColors";

type BossMatrixMemberCellProps = {
  name: string;
  className: string;
};

export function BossMatrixMemberCell({
  name,
  className
}: BossMatrixMemberCellProps) {
  return (
    <div className="boss-matrix-member">
      <div
        className="boss-matrix-member-avatar"
        style={
          {
            "--avatar-ring":
              resolveClassColor(
                className
              )
          } as CSSProperties
        }
      >
        {name
          .slice(0, 2)
          .toUpperCase()}
      </div>

      <strong>{name}</strong>
    </div>
  );
}
