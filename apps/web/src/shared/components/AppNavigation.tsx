import {
  useEffect,
  useRef
} from "react";
import {
  NavLink,
  useLocation
} from "react-router-dom";
import {
  getAvailableModuleItems,
  getPlannedModuleItemCount,
  mainModules
} from "../../app/modules/mainModules";
import { BattleNetTopAction } from "../../../../../modules/data-platform/web/integrations/components/BattleNetTopAction";
import { isModuleCurrent } from "./appNavigation.helpers";
import { ModuleIcon } from "./ModuleIcon";

export function AppNavigation() {
  const { pathname } =
    useLocation();

  const roadmapMenuRef =
    useRef<HTMLDetailsElement>(
      null
    );

  useEffect(
    () => {
      function closeRoadmapMenu(
        event: PointerEvent
      ) {
        const menu =
          roadmapMenuRef.current;

        if (
          !menu ||
          menu.contains(
            event.target as Node
          )
        ) {
          return;
        }

        menu.open = false;
      }

      document.addEventListener(
        "pointerdown",
        closeRoadmapMenu
      );

      return () => {
        document.removeEventListener(
          "pointerdown",
          closeRoadmapMenu
        );
      };
    },
    []
  );

  const activeModules =
    mainModules.filter(
      (module) =>
        module.status === "active"
    );

  const plannedModules =
    mainModules.filter(
      (module) =>
        module.status === "planned"
    );

  const currentModule =
    activeModules.find(
      (module) =>
        isModuleCurrent(
          module,
          pathname
        )
    ) ?? activeModules[0];

  const currentItems =
    currentModule
      ? getAvailableModuleItems(
          currentModule
        )
      : [];

  return (
    <header className="app-navigation">
      <div className="app-navigation-main">
        <NavLink
          aria-label="SynTrack home"
          className="app-brand"
          to="/"
        >
          <span className="brand-mark">
            ST
          </span>

          <span className="brand-copy">
            <strong>
              SynTrack
            </strong>

            <small>
              Guild Platform
            </small>
          </span>
        </NavLink>

        <nav
          aria-label="Main modules"
          className="main-module-tabs"
        >
          {activeModules.map(
            (module) => {
              const landingPath =
                getAvailableModuleItems(
                  module
                )[0]?.path;

              const current =
                isModuleCurrent(
                  module,
                  pathname
                );

              if (!landingPath) {
                return null;
              }

              return (
                <NavLink
                  aria-current={
                    current
                      ? "page"
                      : undefined
                  }
                  className={
                    current
                      ? "main-module-tab active"
                      : "main-module-tab"
                  }
                  key={module.id}
                  to={landingPath}
                >
                  <ModuleIcon
                    moduleId={module.id}
                  />

                  <span>
                    {module.label}
                  </span>
                </NavLink>
              );
            }
          )}
        </nav>

        <div className="app-navigation-actions">
          <details
            className="roadmap-menu"
            ref={roadmapMenuRef}
          >
            <summary>
              <span>
                Roadmap
              </span>

              <span className="roadmap-count">
                {plannedModules.length}
              </span>

              <span
                aria-hidden="true"
                className="roadmap-chevron"
              >
                ▾
              </span>
            </summary>

            <div className="roadmap-popover">
              <div className="roadmap-popover-header">
                <strong>
                  Platform roadmap
                </strong>

                <span>
                  Defined, but not available yet
                </span>
              </div>

              <div className="roadmap-module-list">
                {plannedModules.map(
                  (module) => (
                    <div
                      className="roadmap-module-row"
                      key={module.id}
                    >
                      <span className="roadmap-module-icon">
                        <ModuleIcon
                          moduleId={module.id}
                        />
                      </span>

                      <span className="roadmap-module-copy">
                        <strong>
                          {module.label}
                        </strong>

                        <small>
                          {module.description}
                        </small>
                      </span>

                      <span className="roadmap-capability-count">
                        {getPlannedModuleItemCount(
                          module
                        )}
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>
          </details>

          <BattleNetTopAction />
        </div>
      </div>

      {currentModule ? (
        <div className="module-context-bar">
          <div className="module-context-identity">
            <ModuleIcon
              moduleId={currentModule.id}
            />

            <strong>
              {currentModule.label}
            </strong>
          </div>

          <nav
            aria-label={`${currentModule.label} pages`}
            className="module-page-tabs"
          >
            {currentItems.map(
              (item) => (
                <NavLink
                  className={({
                    isActive
                  }) =>
                    isActive
                      ? "module-page-tab active"
                      : "module-page-tab"
                  }
                  end={
                    item.end ??
                    false
                  }
                  key={item.path}
                  to={item.path ?? "/"}
                >
                  {item.label}
                </NavLink>
              )
            )}
          </nav>

          <span className="module-context-status">
            <span />
            Live
          </span>
        </div>
      ) : null}
    </header>
  );
}
