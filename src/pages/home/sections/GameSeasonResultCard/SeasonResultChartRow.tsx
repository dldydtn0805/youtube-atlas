interface Props {
  label: string;
  tone?: 'gain' | 'loss' | 'neutral';
  value: string;
  width: number;
}

export default function SeasonResultChartRow({ label, tone = 'neutral', value, width }: Props) {
  return (
    <div className="game-season-report-chart__row" data-tone={tone}>
      <div className="game-season-report-chart__row-head">
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
      <div className="game-season-report-chart__rail" aria-hidden="true">
        <span style={{ width: `${width}%` }} />
      </div>
    </div>
  );
}
