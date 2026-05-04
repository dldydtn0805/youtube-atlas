interface Props {
  imageUrl?: string | null;
  label?: string | null;
  tierName?: string | null;
}

function getInitial(label?: string | null) {
  return (label?.trim() || 'A').slice(0, 1).toUpperCase();
}

export default function SeasonResultProfileAvatar({ imageUrl, label, tierName }: Props) {
  return (
    <div className="game-season-result-profile" aria-label={`${label ?? '내'} 프로필`}>
      {imageUrl ? (
        <img alt="" className="game-season-result-profile__image" src={imageUrl} />
      ) : (
        <span className="game-season-result-profile__fallback">{getInitial(label)}</span>
      )}
      {tierName ? <span className="game-season-result-profile__badge">{tierName}</span> : null}
    </div>
  );
}
