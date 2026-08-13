type LoadingPanelProps = {
  label?: string;
};

export function LoadingPanel({
  label = "Loading data…"
}: LoadingPanelProps) {
  return (
    <div className="loading-panel">
      {label}
    </div>
  );
}