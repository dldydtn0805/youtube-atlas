import './GameTierGuide.css';

const tierGuideItems = [
  {
    title: '하이라이트 점수로 티어가 정해집니다',
    copy: '시즌 티어는 하이라이트 점수 총합으로 결정됩니다. 한 플레이에 여러 전략 태그가 붙으면 태그별 점수가 전부 더해집니다.',
  },
  {
    title: '전략 태그 기준은 이렇습니다',
    copy: '문샷은 낮은 순위에서 산 영상이 20위 안으로 치고 올라오는 대박 플레이예요. 스나이프는 더 바깥 순위에서 가능성을 보고 사서 100위 안에 들어왔을 때 붙습니다.',
  },
  {
    title: '캐시아웃은 수익률 하이라이트입니다',
    copy: '스몰 캐시아웃은 하이라이트 기준 수익률 300% 이상, 빅 캐시아웃은 1000% 이상일 때 기록됩니다. 순위 상승 폭이 작아도 수익률이 크면 캐시아웃으로 티어 점수를 올릴 수 있어요.',
  },
  {
    title: '포지션 배지와 하이라이트 기준은 조금 다릅니다',
    copy: '보유 포지션에서 캐시아웃 노림은 최소 보유 시간을 지난 뒤 수익률 18% 이상이거나 12계단 이상 오른 경우에도 붙을 수 있습니다. 하지만 티어 점수에 들어가는 캐시아웃 하이라이트는 300% 이상부터입니다.',
  },
  {
    title: '점수 계산은 태그별 기본점수 + 보너스입니다',
    copy: '문샷과 빅 캐시아웃은 기본 5,000점, 스나이프와 스몰 캐시아웃은 기본 2,500점입니다. 여기에 순위 상승폭 x 20점, 수익률 x 10점이 더해지고 수익률 보너스는 최대 5,000점까지 반영됩니다.',
  },
  {
    title: '큰 수익은 추가 보너스가 붙습니다',
    copy: '절대 수익금이 5,000P를 넘기면 제곱근 기반 보너스가 붙습니다. 수익금이 커질수록 더 강하게 올라가고 최대 30,000점까지 추가돼 큰 한 방이 티어 점수에도 크게 반영됩니다.',
  },
];

export default function GameTierGuide() {
  return (
    <div className="app-shell__tier-guide" aria-label="하이라이트 티어 설명">
      <ol className="app-shell__tier-guide-list">
        {tierGuideItems.map((item) => (
          <li key={item.title} className="app-shell__tier-guide-item">
            <strong className="app-shell__tier-guide-title">{item.title}</strong>
            <p className="app-shell__tier-guide-copy">{item.copy}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
