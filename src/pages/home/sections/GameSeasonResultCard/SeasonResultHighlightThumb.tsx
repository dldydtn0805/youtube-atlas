interface Props {
  src: string;
}

export default function SeasonResultHighlightThumb({ src }: Props) {
  if (!src) {
    return <div className="game-season-result-highlight-card__thumb" aria-hidden="true" />;
  }

  return <img alt="" className="game-season-result-highlight-card__thumb" loading="lazy" src={src} />;
}
