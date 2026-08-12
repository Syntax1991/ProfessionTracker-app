import { NavLink } from "react-router-dom";
import { BattleNetTopAction } from "../../features/integrations/components/BattleNetTopAction";

const navigationItems = [
  {
    label: "Overview",
    path: "/"
  },
  {
    label: "Characters",
    path: "/characters"
  },
  {
    label: "Professions",
    path: "/professions"
  },
  {
    label: "Addon-Sync",
    path: "/addon"
  }
];

export function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="brand">
          <div className="brand-mark">
            PT
          </div>

          <div className="brand-copy">
            <strong>
              SynTrack
            </strong>

            <span>
              Midnight Crafting
            </span>
          </div>
        </div>

        <BattleNetTopAction />
      </div>

      <nav className="main-navigation">
        {navigationItems.map(
          (item) => (
            <NavLink
              className={({
                isActive
              }) =>
                isActive
                  ? "navigation-item active"
                  : "navigation-item"
              }
              end={
                item.path === "/"
              }
              key={item.path}
              to={item.path}
            >
              <span className="navigation-dot" />

              {item.label}
            </NavLink>
          )
        )}
      </nav>

      <div className="sidebar-footer">
        <span className="online-dot" />
        Local MVP
      </div>
    </aside>
  );
}