import { createPortal } from 'react-dom';
import type { GameDividendOverview } from '../../../features/game/types';
import {
  formatGameQuantity,
  formatHoldCountdown,
  formatMaybePoints,
  formatPercent,
  formatPoints,
  formatRank,
} from '../gameHelpers';
import { getFullscreenElement } from '../utils';
import './GameDividendModal.css';

interface GameDividendModalProps {
  isOpen: boolean;
  onClose: () => void;
  overview?: GameDividendOverview;
}

export default function GameDividendModal({ isOpen, onClose, overview }: GameDividendModalProps) {
  if (!isOpen || typeof document === 'undefined' || !overview) {
    return null;
  }

  const portalTarget = getFullscreenElement();
  const container = portalTarget instanceof HTMLElement ? portalTarget : document.body;
  const maxDividendRatePercent = Math.max(...overview.ranks.map((rank) => rank.dividendRatePercent), 1);

  return createPortal(
    <div className="app-shell__modal-backdrop" onClick={onClose} role="presentation">
      <section
        aria-labelledby="game-dividend-modal-title"
        aria-modal="true"
        className="app-shell__modal app-shell__modal--dividend"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
      >
        <div className="app-shell__modal-header">
          <div className="app-shell__section-heading">
            <p className="app-shell__section-eyebrow">Dividend Table</p>
            <h2 className="app-shell__section-title" id="game-dividend-modal-title">
              배당 표
            </h2>
          </div>
          <button
            aria-label="배당 표 모달 닫기"
            className="app-shell__modal-close"
            onClick={onClose}
            type="button"
          >
            닫기
          </button>
        </div>

        <div className="app-shell__modal-body">
          <div className="app-shell__modal-fields">
            <section className="app-shell__modal-field">
              <div className="app-shell__section-heading">
                <p className="app-shell__section-eyebrow">Overview</p>
                <h3 className="app-shell__modal-field-title">내 배당 요약</h3>
              </div>
              <p className="app-shell__modal-field-copy">
                현재 평가금액 기준 예상 배당입니다. 최소 {formatHoldCountdown(overview.minimumHoldSeconds)} 보유한
                포지션만 반영돼요.
              </p>
              <div className="app-shell__game-dividend-metrics" aria-label="배당 요약">
                <span className="app-shell__game-dividend-metric">
                  <span className="app-shell__game-dividend-metric-label">내 예상 배당</span>
                  <strong className="app-shell__game-dividend-metric-value">
                    {formatPoints(overview.myEstimatedDividendPoints)}
                  </strong>
                </span>
                <span className="app-shell__game-dividend-metric">
                  <span className="app-shell__game-dividend-metric-label">배당 대상</span>
                  <strong className="app-shell__game-dividend-metric-value">{overview.myEligiblePositionCount}개</strong>
                </span>
                <span className="app-shell__game-dividend-metric">
                  <span className="app-shell__game-dividend-metric-label">대기 중</span>
                  <strong className="app-shell__game-dividend-metric-value">{overview.myWarmingUpPositionCount}개</strong>
                </span>
              </div>
            </section>

            <section className="app-shell__modal-field">
              <div className="app-shell__section-heading">
                <p className="app-shell__section-eyebrow">Rates</p>
                <h3 className="app-shell__modal-field-title">1위~20위 고정 배당률</h3>
              </div>
              <div className="app-shell__game-dividend-rate-chart" aria-label="배당률 그래프">
                {overview.ranks.map((rank) => (
                  <div key={rank.rank} className="app-shell__game-dividend-rate-row">
                    <span className="app-shell__game-dividend-rate-rank">{rank.rank}위</span>
                    <div className="app-shell__game-dividend-rate-bar-track">
                      <div
                        className="app-shell__game-dividend-rate-bar-fill"
                        style={{
                          width: `${(rank.dividendRatePercent / maxDividendRatePercent) * 100}%`,
                        }}
                      />
                    </div>
                    <strong className="app-shell__game-dividend-rate-value">
                      {formatPercent(rank.dividendRatePercent)}
                    </strong>
                  </div>
                ))}
              </div>
              <div className="app-shell__game-dividend-rate-table-wrap">
                <table className="app-shell__game-dividend-rate-table">
                  <thead>
                    <tr>
                      <th scope="col">랭크</th>
                      <th scope="col">고정 배당률</th>
                      <th scope="col">10만P 기준</th>
                    </tr>
                  </thead>
                  <tbody>
                    {overview.ranks.map((rank) => (
                      <tr key={`table-${rank.rank}`}>
                        <th scope="row">{rank.rank}위</th>
                        <td>{formatPercent(rank.dividendRatePercent)}</td>
                        <td>{formatPoints(Math.round(100_000 * rank.dividendRatePercent / 100))}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="app-shell__modal-field">
              <div className="app-shell__section-heading">
                <p className="app-shell__section-eyebrow">My Positions</p>
                <h3 className="app-shell__modal-field-title">내 배당 대상 포지션</h3>
              </div>
              {overview.positions.length > 0 ? (
                <ul className="app-shell__game-dividend-positions">
                  {overview.positions.map((position) => (
                    <li key={position.positionId} className="app-shell__game-dividend-position">
                      <img
                        alt=""
                        className="app-shell__game-dividend-position-thumb"
                        loading="lazy"
                        src={position.thumbnailUrl}
                      />
                      <div className="app-shell__game-dividend-position-copy">
                        <p className="app-shell__game-dividend-position-title">{position.title}</p>
                        <p className="app-shell__game-dividend-position-meta">
                          현재 <span className="app-shell__game-rank-emphasis">{formatRank(position.currentRank)}</span> ·
                          평가 {formatMaybePoints(position.currentValuePoints)} · 수량 {formatGameQuantity(position.quantity)}
                        </p>
                        <p className="app-shell__game-dividend-position-meta">
                          {position.holdEligible
                            ? `예상 배당 ${formatPoints(position.estimatedDividendPoints)}`
                            : position.nextEligibleInSeconds !== null
                              ? `${formatHoldCountdown(position.nextEligibleInSeconds)} 뒤 배당 반영`
                              : '배당 대기 중'}
                          {' · '}배당률 {formatPercent(position.dividendRatePercent)}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="app-shell__modal-field-copy">
                  현재 Top {overview.eligibleRankCutoff} 안에 든 내 보유 포지션이 없습니다.
                </p>
              )}
            </section>
          </div>
        </div>
      </section>
    </div>,
    container,
  );
}
