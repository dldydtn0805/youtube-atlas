import type { GameSeasonResult } from '../../../../features/game/types';
import SeasonResultHeader from './SeasonResultHeader';
import SeasonResultStats from './SeasonResultStats';
import SeasonResultTierCard from './SeasonResultTierCard';
import SeasonResultReportChart from './SeasonResultReportChart';
import SeasonResultHighlights from './SeasonResultHighlights';
import './layout.css';
import './seasonReportBase.css';
import './seasonResultPalette.css';
import './typography.css';
import './header.css';
import './tierCard.css';
import './tierCardText.css';
import './profileAvatar.css';
import './profileBadge.css';
import './stats.css';
import './statsShimmer.css';
import './statsShimmerMotion.css';
import './reportChart.css';
import './reportChartBars.css';
import './highlights.css';
import './highlightCard.css';
import './highlightMeta.css';
import './highlightTags.css';
import './responsive.css';
import './mobileLayout.css';
import './mobileMetrics.css';
import './mobileMedia.css';

interface GameSeasonResultCardProps {
  label?: string;
  onOpenRecords?: () => void;
  profileImageUrl?: string | null;
  profileLabel?: string | null;
  recordCount?: number;
  result?: GameSeasonResult | null;
}

export default function GameSeasonResultCard({
  label = '지난 시즌 결과',
  onOpenRecords,
  profileImageUrl,
  profileLabel,
  recordCount,
  result,
}: GameSeasonResultCardProps) {
  if (!result) {
    return null;
  }

  return (
    <section
      className="game-season-result"
      aria-label={label}
      data-tier-code={result.finalTierCode ?? undefined}
    >
      <SeasonResultHeader
        label={label}
        onOpenRecords={onOpenRecords}
        recordCount={recordCount}
        result={result}
      />
      <SeasonResultTierCard
        profileImageUrl={profileImageUrl}
        profileLabel={profileLabel}
        result={result}
      />
      <SeasonResultStats result={result} />
      <SeasonResultReportChart result={result} />
      <SeasonResultHighlights result={result} />
    </section>
  );
}
