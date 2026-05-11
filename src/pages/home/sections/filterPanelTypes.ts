export type ViewOptionTone = 'top200' | 'buy' | 'fav' | 'surge' | 'new' | 'music';

export interface ViewOption {
  badge?: string;
  badgeTone?: 'danger' | 'info';
  id: string;
  label: string;
  disabled?: boolean;
  live?: boolean;
  startsGroup?: boolean;
  tone?: ViewOptionTone;
}
