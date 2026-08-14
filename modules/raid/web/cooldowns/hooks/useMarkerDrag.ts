import {
  useCallback,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type RefObject
} from "react";

const dragThresholdPx = 4;

function computeSeconds(
  clientX: number,
  trackRef: RefObject<HTMLDivElement | null>,
  fightDurationSeconds: number
): number {
  const rect =
    trackRef.current?.getBoundingClientRect();

  if (!rect || rect.width === 0) {
    return 0;
  }

  const ratio = Math.min(
    1,
    Math.max(
      0,
      (clientX - rect.left) /
        rect.width
    )
  );

  return Math.round(
    ratio * fightDurationSeconds
  );
}

export function useMarkerDrag(params: {
  trackRef: RefObject<HTMLDivElement | null>;
  fightDurationSeconds: number;
  onDrop: (seconds: number) => void;
  onClick: () => void;
}) {
  const {
    trackRef,
    fightDurationSeconds,
    onDrop,
    onClick
  } = params;

  const [isDragging, setIsDragging] =
    useState(false);

  const [previewSeconds, setPreviewSeconds] =
    useState<number | null>(null);

  const startXRef = useRef(0);
  const draggedRef = useRef(false);

  const onMouseDown = useCallback(
    (
      event: ReactMouseEvent<HTMLButtonElement>
    ) => {
      event.stopPropagation();
      event.preventDefault();

      startXRef.current = event.clientX;
      draggedRef.current = false;

      const handleMouseMove = (
        moveEvent: MouseEvent
      ) => {
        if (
          !draggedRef.current &&
          Math.abs(
            moveEvent.clientX -
              startXRef.current
          ) > dragThresholdPx
        ) {
          draggedRef.current = true;
          setIsDragging(true);
        }

        if (draggedRef.current) {
          setPreviewSeconds(
            computeSeconds(
              moveEvent.clientX,
              trackRef,
              fightDurationSeconds
            )
          );
        }
      };

      const handleMouseUp = (
        upEvent: MouseEvent
      ) => {
        document.removeEventListener(
          "mousemove",
          handleMouseMove
        );
        document.removeEventListener(
          "mouseup",
          handleMouseUp
        );

        if (draggedRef.current) {
          onDrop(
            computeSeconds(
              upEvent.clientX,
              trackRef,
              fightDurationSeconds
            )
          );
        }
        else {
          onClick();
        }

        setIsDragging(false);
        setPreviewSeconds(null);
      };

      document.addEventListener(
        "mousemove",
        handleMouseMove
      );
      document.addEventListener(
        "mouseup",
        handleMouseUp
      );
    },
    [
      trackRef,
      fightDurationSeconds,
      onDrop,
      onClick
    ]
  );

  return {
    onMouseDown,
    isDragging,
    previewSeconds
  };
}
