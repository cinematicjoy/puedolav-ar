interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = "Cargando datos..." }: LoadingStateProps) {
  return (
    <div className="state-card" role="status" aria-live="polite">
      <div className="spinner" aria-hidden="true" />
      <p>{message}</p>
    </div>
  );
}
