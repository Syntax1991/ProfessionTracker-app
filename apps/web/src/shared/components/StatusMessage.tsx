type StatusMessageProps = {
  type: "error" | "info";
  children: string;
};

export function StatusMessage({
  type,
  children
}: StatusMessageProps) {
  return (
    <div
      className={`status-message status-message-${type}`}
    >
      {children}
    </div>
  );
}