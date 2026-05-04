interface Props {
  isOpen: boolean;
  label: string;
  menuId: string;
  onClick: () => void;
}

export default function SeasonResultSelectButton({ isOpen, label, menuId, onClick }: Props) {
  return (
    <button
      aria-controls={menuId}
      aria-expanded={isOpen}
      aria-haspopup="listbox"
      className="game-season-results-select__button"
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
  );
}
