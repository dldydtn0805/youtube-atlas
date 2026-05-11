import type { ViewOptionTone } from '../filterPanelTypes';

const iconPaths: Partial<Record<ViewOptionTone, string>> = {
  top200: 'M6 8l3 3 3-6 3 6 3-3-1.5 9h-9L6 8zM8 20h8',
  buy: 'M12 4c4.4 0 8 1.8 8 4s-3.6 4-8 4-8-1.8-8-4 3.6-4 8-4zm-8 8c0 2.2 3.6 4 8 4s8-1.8 8-4m-16 4c0 2.2 3.6 4 8 4s8-1.8 8-4',
  fav: 'M12 20s-7-4.4-7-10a4 4 0 017-2.6A4 4 0 0119 10c0 5.6-7 10-7 10z',
  new: 'M13 2L4 14h7l-1 8 10-13h-7l0-7z',
  music: 'M4 13a8 8 0 1116 0v5a2 2 0 01-2 2h-2v-7h4M4 13h4v7H6a2 2 0 01-2-2v-5z',
};

interface QuickViewIconProps {
  live?: boolean;
  tone?: ViewOptionTone;
}

export default function QuickViewIcon({ live, tone }: QuickViewIconProps) {
  if (live) {
    return <span aria-hidden="true" className="app-shell__quick-category-live-dot" />;
  }

  const path = tone ? iconPaths[tone] : undefined;

  if (!path) {
    return null;
  }

  return (
    <svg aria-hidden="true" className="app-shell__quick-category-icon" viewBox="0 0 24 24">
      <path d={path} />
    </svg>
  );
}
