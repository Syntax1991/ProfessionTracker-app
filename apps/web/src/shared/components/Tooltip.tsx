import {
  useState,
  type CSSProperties,
  type ReactNode
} from "react";

type TooltipProps = {
  content: ReactNode;
  disabled?: boolean;
  children: ReactNode;
  /**
   * Extra class/style applied to the anchor `<span>` itself, not a
   * wrapper around it — needed when the child relies on being
   * positioned (e.g. `position: absolute; left: X%`) relative to a
   * specific ancestor. Passing that positioning here keeps the
   * marker's own layout unchanged instead of nesting it one level
   * deeper inside a fresh positioning context.
   */
  anchorClassName?: string;
  anchorStyle?: CSSProperties;
};

/**
 * Compact hover popover, not a native `title` tooltip. `disabled`
 * forces it hidden regardless of hover state — used to suppress it
 * while a timeline marker is being dragged, so it never fights the
 * drag for pointer attention.
 */
export function Tooltip({
  content,
  disabled,
  children,
  anchorClassName,
  anchorStyle
}: TooltipProps) {
  const [isHovered, setIsHovered] =
    useState(false);

  const isVisible =
    isHovered && !disabled;

  const className = anchorClassName
    ? `tooltip-anchor ${anchorClassName}`
    : "tooltip-anchor";

  return (
    <span
      className={className}
      onMouseEnter={() =>
        setIsHovered(true)
      }
      onMouseLeave={() =>
        setIsHovered(false)
      }
      style={anchorStyle}
    >
      {children}

      {isVisible && (
        <span
          className="tooltip-popover"
          role="tooltip"
        >
          {content}
        </span>
      )}
    </span>
  );
}
