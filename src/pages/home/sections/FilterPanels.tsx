import SearchBar, { type SearchBarOption } from '../../../components/SearchBar/SearchBar';

interface CategoryOption {
  id: string;
  label: string;
}

interface QuickCategoryButtonsProps {
  categories: CategoryOption[];
  onSelectCategory: (categoryId: string, triggerElement?: HTMLButtonElement) => void;
  selectedCategoryId: string;
}

interface FilterSummaryPanelProps {
  mainVideoCategories: CategoryOption[];
  onOpenFilterModal: () => void;
  onSelectCategory: (categoryId: string, triggerElement?: HTMLButtonElement) => void;
  selectedCategoryId: string;
  selectedCategoryLabel?: string;
  selectedCountryName: string;
}

interface CinematicQuickFiltersProps {
  mainVideoCategories: CategoryOption[];
  onSelectCategory: (categoryId: string, triggerElement?: HTMLButtonElement) => void;
  selectedCategoryId: string;
}

interface FilterModalProps {
  detailCategoryHelperText: string;
  detailCategoryOptions: SearchBarOption[];
  isOpen: boolean;
  isVideoCategoriesError: boolean;
  isVideoCategoriesLoading: boolean;
  mainVideoCategories: CategoryOption[];
  onChangeRegion: (regionCode: string) => void;
  onClose: () => void;
  onComplete: () => void;
  onSelectCategory: (categoryId: string, triggerElement?: HTMLButtonElement) => void;
  regionOptions: SearchBarOption[];
  selectedCategoryId: string;
  selectedCategoryLabel?: string;
  selectedCountryName: string;
  selectedRegionCode: string;
}

function QuickCategoryButtons({
  categories,
  onSelectCategory,
  selectedCategoryId,
}: QuickCategoryButtonsProps) {
  return (
    <>
      {categories.map((category) => (
        <button
          key={category.id}
          className="app-shell__quick-category"
          data-active={category.id === selectedCategoryId}
          onClick={(event) => onSelectCategory(category.id, event.currentTarget)}
          type="button"
        >
          {category.label}
        </button>
      ))}
    </>
  );
}

export function FilterSummaryPanel({
  mainVideoCategories,
  onOpenFilterModal,
  onSelectCategory,
  selectedCategoryId,
  selectedCategoryLabel,
  selectedCountryName,
}: FilterSummaryPanelProps) {
  return (
    <section className="app-shell__panel app-shell__panel--filters">
      <div className="app-shell__section-heading app-shell__section-heading--filters">
        <div className="app-shell__section-heading-copy">
          <p className="app-shell__section-eyebrow">Filters</p>
          <h2 className="app-shell__section-title">필터</h2>
        </div>
        <button className="app-shell__filter-trigger" onClick={onOpenFilterModal} type="button">
          변경
        </button>
      </div>
      <div className="app-shell__filter-summary" aria-label="현재 필터">
        <div className="app-shell__filter-pill-group">
          <span className="app-shell__filter-pill">
            <strong>국가</strong>
            <span>{selectedCountryName}</span>
          </span>
          <span className="app-shell__filter-pill">
            <strong>카테고리</strong>
            <span>{selectedCategoryLabel ?? '선택 중'}</span>
          </span>
        </div>
        <p className="app-shell__filter-summary-text">빠른 카테고리</p>
        <div className="app-shell__quick-category-group" aria-label="메인 카테고리 빠른 선택">
          <QuickCategoryButtons
            categories={mainVideoCategories}
            onSelectCategory={onSelectCategory}
            selectedCategoryId={selectedCategoryId}
          />
        </div>
      </div>
    </section>
  );
}

export function CinematicQuickFilters({
  mainVideoCategories,
  onSelectCategory,
  selectedCategoryId,
}: CinematicQuickFiltersProps) {
  return (
    <section className="app-shell__cinematic-filters" aria-label="시네마틱 메인 필터">
      <div className="app-shell__section-heading">
        <div className="app-shell__section-heading-copy">
          <p className="app-shell__section-eyebrow">Main Filters</p>
          <h2 className="app-shell__section-title">메인 카테고리 빠른 전환</h2>
        </div>
      </div>
      <div className="app-shell__quick-category-group" aria-label="시네마틱 메인 카테고리 빠른 선택">
        <QuickCategoryButtons
          categories={mainVideoCategories}
          onSelectCategory={onSelectCategory}
          selectedCategoryId={selectedCategoryId}
        />
      </div>
    </section>
  );
}

export function FilterModal({
  detailCategoryHelperText,
  detailCategoryOptions,
  isOpen,
  isVideoCategoriesError,
  isVideoCategoriesLoading,
  mainVideoCategories,
  onChangeRegion,
  onClose,
  onComplete,
  onSelectCategory,
  regionOptions,
  selectedCategoryId,
  selectedCategoryLabel,
  selectedCountryName,
  selectedRegionCode,
}: FilterModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="app-shell__modal-backdrop" onClick={onClose} role="presentation">
      <section
        aria-labelledby="filter-modal-title"
        aria-modal="true"
        className="app-shell__modal"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
      >
        <div className="app-shell__modal-header">
          <div className="app-shell__section-heading">
            <p className="app-shell__section-eyebrow">Filters</p>
            <h2 className="app-shell__section-title" id="filter-modal-title">
              필터
            </h2>
          </div>
          <button
            aria-label="필터 모달 닫기"
            className="app-shell__modal-close"
            onClick={onClose}
            type="button"
          >
            닫기
          </button>
        </div>

        <div className="app-shell__modal-body">
          <div className="app-shell__filter-pill-group">
            <span className="app-shell__filter-pill">
              <strong>현재 국가</strong>
              <span>{selectedCountryName}</span>
            </span>
            <span className="app-shell__filter-pill">
              <strong>현재 카테고리</strong>
              <span>{selectedCategoryLabel ?? '선택 중'}</span>
            </span>
          </div>

          <div className="app-shell__modal-fields">
            <div className="app-shell__modal-field">
              <div className="app-shell__section-heading">
                <p className="app-shell__section-eyebrow">Region</p>
                <h3 className="app-shell__modal-field-title">국가</h3>
              </div>
              <SearchBar
                ariaLabel="국가 선택"
                onChange={onChangeRegion}
                options={regionOptions}
                value={selectedRegionCode}
              />
            </div>

            <div className="app-shell__modal-field">
              <div className="app-shell__section-heading">
                <p className="app-shell__section-eyebrow">Main Categories</p>
                <h3 className="app-shell__modal-field-title">빠른 카테고리</h3>
              </div>
              <div className="app-shell__quick-category-group" aria-label="메인 카테고리 목록">
                <QuickCategoryButtons
                  categories={mainVideoCategories}
                  onSelectCategory={onSelectCategory}
                  selectedCategoryId={selectedCategoryId}
                />
              </div>
            </div>

            <div className="app-shell__modal-field">
              <div className="app-shell__section-heading">
                <p className="app-shell__section-eyebrow">Detail Categories</p>
                <h3 className="app-shell__modal-field-title">전체 카테고리</h3>
              </div>
              <SearchBar
                ariaLabel="세부 카테고리 선택"
                disabled={isVideoCategoriesLoading || isVideoCategoriesError || detailCategoryOptions.length === 0}
                emptyLabel={
                  isVideoCategoriesLoading
                    ? '세부 카테고리를 불러오는 중입니다.'
                    : isVideoCategoriesError
                      ? '세부 카테고리를 불러오지 못했습니다.'
                      : '선택 가능한 세부 카테고리가 없습니다.'
                }
                helperText={detailCategoryHelperText}
                onChange={onSelectCategory}
                options={detailCategoryOptions}
                placeholderLabel="카테고리 선택"
                value={selectedCategoryId}
              />
            </div>
          </div>
        </div>

        <div className="app-shell__modal-footer">
          <button className="app-shell__modal-action" onClick={onComplete} type="button">
            적용
          </button>
        </div>
      </section>
    </div>
  );
}
