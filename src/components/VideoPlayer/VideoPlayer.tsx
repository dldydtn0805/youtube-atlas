import './VideoPlayer.css';

const DEFAULT_VIDEO_ID = '61JHONRXhjs';

interface VideoPlayerProps {
  selectedVideoId?: string;
}

function VideoPlayer({ selectedVideoId }: VideoPlayerProps) {
  const videoId = selectedVideoId ?? DEFAULT_VIDEO_ID;
  const embedParams = new URLSearchParams({
    autoplay: '1',
    rel: '0',
  });

  return (
    <section className="video-player">
      <div className="video-player__frame">
        <iframe
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
          key={videoId}
          src={`https://www.youtube.com/embed/${videoId}?${embedParams.toString()}`}
          title="Selected YouTube video"
        />
      </div>
    </section>
  );
}

export default VideoPlayer;
