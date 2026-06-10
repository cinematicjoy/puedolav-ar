import type { WashItem, WashRecommendation } from "../types/wash";

interface WashItemDetailProps {
  item: WashItem;
  recommendation: WashRecommendation;
}

export function WashItemDetail({ item, recommendation }: WashItemDetailProps) {
  return (
    <article className={`wash-detail status-${recommendation.status}`}>
      <div className="detail-title-row">
        <span className="wash-icon" aria-hidden="true">{item.icon}</span>
        <div>
          <p className="eyebrow">Detalle</p>
          <h3>{recommendation.title}</h3>
        </div>
      </div>

      <div className="detail-score-row">
        <span className="score-pill large">{recommendation.score}/100</span>
        <span className={`label-chip status-${recommendation.status}`}>{recommendation.label}</span>
      </div>

      <div className="detail-columns">
        <div>
          <h4>Motivos principales</h4>
          <ul>
            {recommendation.reasons.map((reason) => <li key={reason}>{reason}</li>)}
          </ul>
        </div>
        <div>
          <h4>Variables que más influyen</h4>
          {recommendation.variables.length ? (
            <div className="chips-row">
              {recommendation.variables.map((variable) => <span key={variable} className="mini-chip">{variable}</span>)}
            </div>
          ) : (
            <p className="muted">Condiciones bastante parejas.</p>
          )}
          {recommendation.dryingTime ? <p><strong>Secado estimado:</strong> {recommendation.dryingTime}</p> : null}
        </div>
      </div>

      <div className="recommendation-box">
        <h4>Recomendación práctica</h4>
        <p>{recommendation.recommendation}</p>
      </div>

      {recommendation.warnings.length > 0 ? (
        <div className="warning-box">
          <h4>Advertencias</h4>
          <ul>
            {recommendation.warnings.map((warning) => <li key={warning}>{warning}</li>)}
          </ul>
        </div>
      ) : null}
    </article>
  );
}
