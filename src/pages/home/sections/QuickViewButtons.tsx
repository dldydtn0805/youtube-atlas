import { memo } from 'react';
import type { ViewOption } from './filterPanelTypes';

interface QuickViewButtonsProps {
  options: ViewOption[];
  onSelectView: (viewId: string, triggerElement?: HTMLButtonElement) => void;
  selectedViewId: string;
}

const QuickViewButtons = memo(function QuickViewButtons({
  options,
  onSelectView,
  selectedViewId,
}: QuickViewButtonsProps) {
  return (
    <>
      {options.map((option) => (
        <button
          key={option.id}
          className="app-shell__quick-category"
          data-active={option.id === selectedViewId}
          disabled={option.disabled}
          onClick={(event) => onSelectView(option.id, event.currentTarget)}
          type="button"
        >
          {option.label}
        </button>
      ))}
    </>
  );
});

export default QuickViewButtons;
