import { NavLink } from "react-router-dom";
import {
  getAvailableModuleItems,
  getPlannedModuleItemCount,
  mainModules
} from "../../app/modules/mainModules";
import { BattleNetTopAction } from "../../features/integrations/components/BattleNetTopAction";

export function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="brand">
          <div className="brand-mark">
            ST
          </div>

          <div className="brand-copy">
            <strong>
              SynTrack
            </strong>

            <span>
              Guild & Tracking Platform
            </span>
          </div>
        </div>

        <BattleNetTopAction />
      </div>

      <nav
        aria-label="SynTrack modules"
        className="module-navigation"
      >
        {mainModules.map(
          (module) => {
            const availableItems =
              getAvailableModuleItems(
                module
              );

            const plannedItemCount =
              getPlannedModuleItemCount(
                module
              );

            return (
              <section
                className="module-navigation-group"
                key={module.id}
              >
                <div className="module-navigation-header">
                  <div>
                    <strong>
                      {module.label}
                    </strong>

                    <span>
                      {module.description}
                    </span>
                  </div>

                  <span
                    className={
                      module.status ===
                      "active"
                        ? "module-status module-status-active"
                        : "module-status"
                    }
                  >
                    {module.status ===
                    "active"
                      ? "Active"
                      : "Planned"}
                  </span>
                </div>

                {availableItems.length >
                0 ? (
                  <div className="module-navigation-items">
                    {availableItems.map(
                      (item) => {
                        if (!item.path) {
                          return null;
                        }

                        return (
                          <NavLink
                            className={({
                              isActive
                            }) =>
                              isActive
                                ? "navigation-item active"
                                : "navigation-item"
                            }
                            end={
                              item.end ??
                              false
                            }
                            key={item.path}
                            to={item.path}
                          >
                            <span className="navigation-dot" />

                            {item.label}
                          </NavLink>
                        );
                      }
                    )}
                  </div>
                ) : (
                  <div className="module-navigation-placeholder">
                    Foundation defined
                  </div>
                )}

                {plannedItemCount >
                0 ? (
                  <div className="module-navigation-planned">
                    {plannedItemCount}
                    {" "}
                    planned
                    {plannedItemCount === 1
                      ? " capability"
                      : " capabilities"}
                  </div>
                ) : null}
              </section>
            );
          }
        )}
      </nav>

      <div className="sidebar-footer">
        <span className="online-dot" />
        Platform foundation
      </div>
    </aside>
  );
}