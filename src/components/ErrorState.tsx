interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="state-card error-card" role="alert">
      <p>{message}</p>
      {onRetry ? <button className="primary-button" type="button" onClick={onRetry}>Reintentar</button> : null}
    </div>
  );
}
