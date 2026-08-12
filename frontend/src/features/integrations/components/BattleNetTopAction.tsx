import {
  useCallback,
  useEffect,
  useState
} from "react";
import {
  NavLink,
  useLocation
} from "react-router-dom";
import {
  getBattleNetStatus
} from "../api/battlenetApi";

type ConnectionState =
  | "loading"
  | "connected"
  | "disconnected"
  | "unavailable";

type BattleNetActionState = {
  connectionState:
    ConnectionState;
  battleTag:
    string | null;
  importedCharacterCount:
    number;
};

const initialState:
  BattleNetActionState = {
    connectionState:
      "loading",
    battleTag:
      null,
    importedCharacterCount:
      0
  };

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

function getActionTitle(
  state:
    BattleNetActionState
): string {
  switch (
    state.connectionState
  ) {
    case "connected":
      return state.battleTag
        ? `${state.battleTag} · ${state.importedCharacterCount} imported characters`
        : `Battle.net connected · ${state.importedCharacterCount} imported characters`;

    case "disconnected":
      return "Connect Battle.net";

    case "unavailable":
      return "Battle.net status unavailable";

    default:
      return "Loading Battle.net status";
  }
}

export function BattleNetTopAction() {
  const location =
    useLocation();

  const [
    state,
    setState
  ] =
    useState<BattleNetActionState>(
      initialState
    );

  const loadStatus =
    useCallback(
      async () => {
        try {
          const status =
            await getBattleNetStatus();

          setState({
            connectionState:
              status.connected
                ? "connected"
                : "disconnected",

            battleTag:
              status.battleTag,

            importedCharacterCount:
              status
                .importedCharacterCount
          });
        }
        catch {
          setState({
            connectionState:
              "unavailable",

            battleTag:
              null,

            importedCharacterCount:
              0
          });
        }
      },
      []
    );

  useEffect(() => {
    void loadStatus();
  }, [
    loadStatus,
    location.pathname,
    location.search
  ]);

  useEffect(() => {
    const handleWindowFocus =
      () => {
        void loadStatus();
      };

    window.addEventListener(
      "focus",
      handleWindowFocus
    );

    return () => {
      window.removeEventListener(
        "focus",
        handleWindowFocus
      );
    };
  }, [loadStatus]);

  const title =
    getActionTitle(
      state
    );

  return (
    <div className="battle-net-top-action">
      <NavLink
        aria-label={title}
        className={({
          isActive
        }) =>
          [
            "battle-net-top-link",
            `connection-${state.connectionState}`,
            isActive
              ? "active"
              : ""
          ]
            .filter(Boolean)
            .join(" ")
        }
        title={title}
        to="/battlenet"
      >
        <BattleNetIcon />

        <span
          aria-hidden="true"
          className="battle-net-top-indicator"
        />

        {state.importedCharacterCount >
          0 && (
          <span
            aria-hidden="true"
            className="battle-net-character-count"
          >
            {
              state
                .importedCharacterCount
            }
          </span>
        )}
      </NavLink>
    </div>
  );
}