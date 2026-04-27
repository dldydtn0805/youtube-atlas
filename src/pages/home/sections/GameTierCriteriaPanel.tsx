import GameTierGuide from './GameTierGuide';

export default function GameTierCriteriaPanel() {
  return (
    <div className="app-shell__modal-fields">
      <section className="app-shell__modal-field">
        <div className="app-shell__section-heading">
          <p className="app-shell__section-eyebrow">티어 설명</p>
          <h3 className="app-shell__modal-field-title">하이라이트 티어 기준</h3>
        </div>
        <GameTierGuide />
      </section>
    </div>
  );
}
