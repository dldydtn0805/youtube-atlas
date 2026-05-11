import { memo } from 'react';
import type { ViewOption } from '../filterPanelTypes';
import QuickViewIcon from './Icon';
import './QuickViewButtons.css';

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
      {options.map((option) => {
        const isActive = option.id === selectedViewId;

        return (
          <span key={option.id} className="app-shell__quick-category-slot">
            {option.startsGroup ? <span aria-hidden="true" className="app-shell__quick-category-divider" /> : null}
            <button
              aria-pressed={isActive}
              className="app-shell__quick-category"
              data-active={isActive}
              data-tone={option.tone}
              disabled={option.disabled}
              onClick={(event) => onSelectView(option.id, event.currentTarget)}
              type="button"
            >
              <QuickViewIcon live={option.live} tone={option.tone} />
              <span>{option.label}</span>
              {option.badge ? (
                <span className="app-shell__quick-category-badge" data-tone={option.badgeTone}>
                  {option.badge}
                </span>
              ) : null}
            </button>
          </span>
        );
      })}
    </>
  );
});

export default QuickViewButtons;
