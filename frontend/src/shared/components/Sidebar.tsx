import { NavLink } from "react-router-dom";
import { BattleNetTopAction } from "../../features/integrations/components/BattleNetTopAction";

const navigationItems = [
  {
    label: "Übersicht",
    path: "/"
  },
  {
    label: "Charaktere",
    path: "/characters"
  },
  {
    label: "Berufe",
    path: "/professions"
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
              Profession Tracker
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
        Lokales MVP
      </div>
    </aside>
  );
}