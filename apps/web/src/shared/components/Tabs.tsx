type TabDefinition<TabId extends string> = {
  id: TabId;
  label: string;
  count?: number;
};

type TabsProps<TabId extends string> = {
  ariaLabel: string;
  tabs: TabDefinition<TabId>[];
  activeTab: TabId;
  onChange: (tabId: TabId) => void;
};

export function Tabs<TabId extends string>({
  ariaLabel,
  tabs,
  activeTab,
  onChange
}: TabsProps<TabId>) {
  return (
    <nav
      aria-label={ariaLabel}
      className="panel app-tabs"
      role="tablist"
    >
      {tabs.map((tab) => (
        <button
          aria-selected={
            activeTab === tab.id
          }
          className={
            activeTab === tab.id
              ? "app-tab active"
              : "app-tab"
          }
          key={tab.id}
          onClick={() =>
            onChange(tab.id)
          }
          role="tab"
          type="button"
        >
          <span>{tab.label}</span>

          {tab.count !== undefined && (
            <strong>{tab.count}</strong>
          )}
        </button>
      ))}
    </nav>
  );
}
