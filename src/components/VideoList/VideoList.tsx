import { YouTubeCategorySection } from '../../features/youtube/types';
import './VideoList.css';

interface VideoListProps {
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
  sections: YouTubeCategorySection[];
  selectedVideoId?: string;
  onSelectVideo: (videoId: string, triggerElement?: HTMLButtonElement) => void;
}

function VideoList({
  isLoading,
  isError,
  errorMessage,
  sections,
  selectedVideoId,
  onSelectVideo,
}: VideoListProps) {
  if (isLoading) {
    return <p className="video-list__status">영상을 불러오는 중입니다.</p>;
  }

  if (isError) {
    return <p className="video-list__status">불러오기에 실패했습니다. {errorMessage}</p>;
  }

  if (sections.length === 0) {
    return <p className="video-list__status">표시할 영상이 없습니다.</p>;
  }

  return (
    <div className="video-list" aria-label="카테고리별 인기 영상 목록">
      {sections.map((section) => (
        <section
          key={section.categoryId}
          className="video-list__section"
          aria-label={`${section.label} 인기 영상`}
        >
          <header className="video-list__section-header">
            <div>
              <p className="video-list__section-eyebrow">Category Ranking</p>
              <h3 className="video-list__section-title">{section.label}</h3>
            </div>
            <p className="video-list__section-description">{section.description}</p>
          </header>
          <div className="video-list__grid">
            {section.items.map((item, index) => (
              <button
                key={`${section.categoryId}-${item.id}`}
                className="video-card"
                data-active={selectedVideoId === item.id}
                onClick={(event) => onSelectVideo(item.id, event.currentTarget)}
                type="button"
              >
                <span className="video-card__rank">
                  {section.label} #{index + 1}
                </span>
                <img
                  className="video-card__thumbnail"
                  src={item.snippet.thumbnails.high.url}
                  alt={item.snippet.title}
                />
                <strong className="video-card__title">{item.snippet.title}</strong>
                <span className="video-card__channel">{item.snippet.channelTitle}</span>
              </button>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

export default VideoList;
