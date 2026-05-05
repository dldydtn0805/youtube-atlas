import type { CommentHighlightMessage as CommentHighlight } from '../../features/comments/highlightTypes';
import type { SelectedAchievementTitle } from '../../features/game/types';
import CommentHighlightAuthor from './CommentHighlightAuthor';

interface CommentHighlightMessageProps {
  availableTitles?: readonly SelectedAchievementTitle[];
  highlight: CommentHighlight;
  formattedDate: string;
}

function CommentHighlightMessage({
  availableTitles,
  formattedDate,
  highlight,
}: CommentHighlightMessageProps) {
  return (
    <article className="comment-message">
      <div className="comment-message__meta">
        <CommentHighlightAuthor availableTitles={availableTitles} highlight={highlight} />
        <time className="comment-message__date" dateTime={highlight.created_at}>
          {formattedDate}
        </time>
      </div>
      <p className="comment-message__bubble">{highlight.content}</p>
    </article>
  );
}

export default CommentHighlightMessage;
