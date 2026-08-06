import {
  useEffect,
  useState
} from "react";
import { createPortal } from "react-dom";

const sidebarSelectors = [
  "aside",
  "[data-app-sidebar]",
  ".app-sidebar",
  ".sidebar",
  ".side-navigation",
  ".side-nav"
];

function findSidebar():
  HTMLElement | null {
  for (
    const selector of
    sidebarSelectors
  ) {
    const element =
      document.querySelector<HTMLElement>(
        selector
      );

    if (element) {
      return element;
    }
  }

  return null;
}

function isBattleNetPage():
  boolean {
  return window.location.pathname
    .toLowerCase()
    .startsWith(
      "/battlenet"
    );
}

function BattleNetIcon() {
  return (
    <svg
      aria-hidden="true"
      className="battle-net-top-icon"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path d="M7.2 4.6c3.2-1.8 7.3-1 9.4 1.9 2.1 2.8 1.8 6.9-.7 9.4" />

      <path d="M19.4 7.2c1.8 3.2 1 7.3-1.9 9.4-2.8 2.1-6.9 1.8-9.4-.7" />

      <path d="M16.8 19.4c-3.2 1.8-7.3 1-9.4-1.9-2.1-2.8-1.8-6.9.7-9.4" />

      <path d="M4.6 16.8c-1.8-3.2-1-7.3 1.9-9.4 2.8-2.1 6.9-1.8 9.4.7" />

      <circle
        cx="12"
        cy="12"
        r="2.1"
      />
    </svg>
  );
}

export function BattleNetTopAction() {
  const [
    sidebar,
    setSidebar
  ] =
    useState<HTMLElement | null>(
      null
    );

  useEffect(() => {
    let animationFrameId = 0;
    let attempts = 0;

    function resolveSidebar() {
      const resolvedSidebar =
        findSidebar();

      if (resolvedSidebar) {
        setSidebar(
          resolvedSidebar
        );

        return;
      }

      attempts += 1;

      if (attempts < 60) {
        animationFrameId =
          window.requestAnimationFrame(
            resolveSidebar
          );
      }
    }

    resolveSidebar();

    return () => {
      window.cancelAnimationFrame(
        animationFrameId
      );
    };
  }, []);

  const active =
    isBattleNetPage();

  const action = (
    <div
      className={[
        "battle-net-top-action",
        sidebar
          ? ""
          : "battle-net-top-action-fallback"
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <a
        aria-current={
          active
            ? "page"
            : undefined
        }
        aria-label="Battle.net verwalten"
        className={[
          "battle-net-top-link",
          active
            ? "active"
            : ""
        ]
          .filter(Boolean)
          .join(" ")}
        href="/battlenet"
        title="Battle.net verwalten"
      >
        <BattleNetIcon />

        <span
          aria-hidden="true"
          className="battle-net-top-indicator"
        />
      </a>
    </div>
  );

  if (sidebar) {
    return createPortal(
      action,
      sidebar
    );
  }

  return createPortal(
    action,
    document.body
  );
}