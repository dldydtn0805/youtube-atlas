import type { GameSeasonResult } from '../../../../features/game/types';
import SeasonResultChartRow from './SeasonResultChartRow';
import { getReportChartMetrics } from './reportChartMetrics';

export default function SeasonResultReportChart({ result }: { result: GameSeasonResult }) {
  return (
    <section className="game-season-report-chart" aria-label="시즌 성과 매트릭스">
      <div className="game-season-report-chart__head">
        <span>Performance Matrix</span>
        <strong>Risk / Return View</strong>
      </div>
      <div className="game-season-report-chart__rows">
        {getReportChartMetrics(result).map((row) => (
          <SeasonResultChartRow
            key={row.label}
            label={row.label}
            tone={row.tone}
            value={row.value}
            width={row.width}
          />
        ))}
      </div>
    </section>
  );
}
