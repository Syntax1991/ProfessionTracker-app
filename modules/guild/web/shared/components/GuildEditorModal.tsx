import {
  useEffect,
  type ReactNode
} from "react";

type GuildEditorModalProps = {
  isOpen: boolean;
  eyebrow: string;
  title: string;
  description?: string;
  children: ReactNode;
  onClose: () => void;
};

export function GuildEditorModal({
  isOpen,
  eyebrow,
  title,
  description,
  children,
  onClose
}: GuildEditorModalProps) {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    const handleKeyDown = (
      event: KeyboardEvent
    ) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.body.style.overflow =
        previousOverflow;

      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="guild-modal-backdrop"
      onMouseDown={(event) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          onClose();
        }
      }}
      role="presentation"
    >
      <section
        aria-labelledby="guild-editor-modal-title"
        aria-modal="true"
        className="guild-editor-modal"
        role="dialog"
      >
        <header className="guild-editor-modal-header">
          <div>
            <p className="eyebrow">
              {eyebrow}
            </p>

            <h2 id="guild-editor-modal-title">
              {title}
            </h2>

            {description && (
              <p>{description}</p>
            )}
          </div>

          <button
            aria-label="Close"
            className="guild-editor-modal-close"
            onClick={onClose}
            type="button"
          >
            ×
          </button>
        </header>

        <div className="guild-editor-modal-body">
          {children}
        </div>
      </section>
    </div>
  );
}