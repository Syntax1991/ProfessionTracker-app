type LoadingPanelProps = {
  label?: string;
};

export function LoadingPanel({
  label = "Daten werden geladen…"
}: LoadingPanelProps) {
  return (
    <div className="loading-panel">
      {label}
    </div>
  );
}