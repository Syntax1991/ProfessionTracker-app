import { NavLink } from "react-router-dom";
import type {
  MainModuleDefinition
} from "../../app/modules/mainModules";
import { ModuleIcon } from "./ModuleIcon";

type SidebarModuleGroupProps = {
  module: MainModuleDefinition;
  current: boolean;
  expanded: boolean;
  onNavigate: () => void;
  onToggle: () => void;
};

export function SidebarModuleGroup({
  module,
  current,
  expanded,
  onNavigate,
  onToggle
}: SidebarModuleGroupProps) {
  const panelId =
    `sidebar-module-${module.id}`;

  return (
    <section
      className={
        current
          ? "sidebar-module-group current"
          : "sidebar-module-group"
      }
    >
      <button
        aria-controls={panelId}
        aria-expanded={expanded}
        className="sidebar-module-toggle"
        onClick={onToggle}
        type="button"
      >
        <span className="sidebar-module-icon">
          <ModuleIcon
            moduleId={module.id}
          />
        </span>

        <span className="sidebar-module-label">
          {module.label}
        </span>

        {module.status === "planned" ? (
          <span className="sidebar-module-badge">
            Soon
          </span>
        ) : null}

        <span
          aria-hidden="true"
          className="sidebar-module-chevron"
        />
      </button>

      <div
        aria-hidden={!expanded}
        className={
          expanded
            ? "sidebar-module-panel expanded"
            : "sidebar-module-panel"
        }
        id={panelId}
      >
        <div className="sidebar-module-items">
          {module.items.map(
            (item) => {
              if (
                item.status ===
                  "available" &&
                item.path
              ) {
                return (
                  <NavLink
                    className={({
                      isActive
                    }) =>
                      isActive
                        ? "sidebar-subitem active"
                        : "sidebar-subitem"
                    }
                    end={
                      item.end ?? false
                    }
                    key={item.label}
                    onClick={onNavigate}
                    to={item.path}
                  >
                    <span className="sidebar-subitem-dot" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              }

              return (
                <span
                  aria-disabled="true"
                  className="sidebar-subitem planned"
                  key={item.label}
                >
                  <span className="sidebar-subitem-dot" />
                  <span>{item.label}</span>
                  <small>Soon</small>
                </span>
              );
            }
          )}
        </div>
      </div>
    </section>
  );
}
