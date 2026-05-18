import { createPortal } from 'react-dom';
import { useEffect, useId, useMemo, useRef, useState } from 'react';

export interface ExploreCountryOption {
  code: string;
  name: string;
}

interface ExploreCountryDropdownProps {
  onSelectRegion: (regionCode: string) => void;
  options: ExploreCountryOption[];
  selectedCountryName: string;
  selectedRegionCode: string;
}

function getFlagEmoji(regionCode: string) {
  return regionCode
    .toUpperCase()
    .replace(/./g, (character) => String.fromCodePoint(127397 + character.charCodeAt(0)));
}

export default function ExploreCountryDropdown({
  onSelectRegion,
  options,
  selectedCountryName,
  selectedRegionCode,
}: ExploreCountryDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [menuStyle, setMenuStyle] = useState<{
    left: number;
    minWidth: number;
    top: number;
  } | null>(null);
  const buttonId = useId();
  const listboxId = useId();
  const selectedOption = useMemo(
    () => options.find((option) => option.code === selectedRegionCode),
    [options, selectedRegionCode],
  );
  const visibleCountryName = selectedOption?.name ?? selectedCountryName;
  const visibleFlag = getFlagEmoji(selectedOption?.code ?? selectedRegionCode);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function updateMenuPosition() {
      const triggerElement = triggerRef.current;

      if (!triggerElement) {
        return;
      }

      const rect = triggerElement.getBoundingClientRect();
      const minWidth = Math.max(200, Math.round(rect.width));
      const viewportWidth = window.innerWidth;
      const nextLeft = Math.min(
        Math.max(12, Math.round(rect.right - minWidth)),
        Math.max(12, viewportWidth - minWidth - 12),
      );

      setMenuStyle({
        left: nextLeft,
        minWidth,
        top: Math.round(rect.bottom + 8),
      });
    }

    function handlePointerDown(event: MouseEvent) {
      const target = event.target as Node;

      if (!containerRef.current?.contains(target) && !menuRef.current?.contains(target)) {
        setIsOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    updateMenuPosition();
    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleEscape);
    window.addEventListener('resize', updateMenuPosition);
    window.addEventListener('scroll', updateMenuPosition, true);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleEscape);
      window.removeEventListener('resize', updateMenuPosition);
      window.removeEventListener('scroll', updateMenuPosition, true);
    };
  }, [isOpen]);

  return (
    <div className="app-shell__country-dropdown" data-open={isOpen ? 'true' : 'false'} ref={containerRef}>
      <button
        aria-controls={listboxId}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        className="app-shell__country-dropdown-trigger"
        id={buttonId}
        onClick={() => setIsOpen((currentValue) => !currentValue)}
        ref={triggerRef}
        type="button"
      >
        <span aria-hidden="true" className="app-shell__country-dropdown-flag">
          {visibleFlag}
        </span>
        <span className="app-shell__country-dropdown-label">{visibleCountryName}</span>
        <span aria-hidden="true" className="app-shell__country-dropdown-chevron">
          <svg viewBox="0 0 12 12" fill="none">
            <path
              d="M3 4.5 6 7.5l3-3"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
            />
          </svg>
        </span>
      </button>
      {isOpen && menuStyle && typeof document !== 'undefined'
        ? createPortal(
            <div
              aria-labelledby={buttonId}
              className="app-shell__country-dropdown-menu app-shell__country-dropdown-menu--portal"
              data-open="true"
              id={listboxId}
              ref={menuRef}
              role="listbox"
              style={menuStyle}
            >
              {options.map((option) => {
                const isSelected = option.code === selectedRegionCode;

                return (
                  <button
                    aria-selected={isSelected}
                    className="app-shell__country-dropdown-option"
                    data-selected={isSelected ? 'true' : 'false'}
                    key={option.code}
                    onClick={() => {
                      onSelectRegion(option.code);
                      setIsOpen(false);
                    }}
                    role="option"
                    type="button"
                  >
                    <span aria-hidden="true" className="app-shell__country-dropdown-check">
                      {isSelected ? '✓' : ''}
                    </span>
                    <span className="app-shell__country-dropdown-option-name">
                      {option.name}
                    </span>
                    <span className="app-shell__country-dropdown-option-code">{option.code}</span>
                  </button>
                );
              })}
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
