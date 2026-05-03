import type { CommentHighlightMessage as CommentHighlight } from '../../features/comments/highlightTypes';
import './CommentHighlightMessage.css';

interface CommentHighlightMessageProps {
  highlight: CommentHighlight;
  formattedDate: string;
}

function CommentHighlightMessage({ formattedDate, highlight }: CommentHighlightMessageProps) {
  return (
    <article className="comment-highlight-message">
      <div className="comment-highlight-message__meta">
        <span className="comment-highlight-message__author">{highlight.author}</span>
        <span className="comment-highlight-message__badge">{highlight.label || '인기 댓글'}</span>
        <time className="comment-highlight-message__date" dateTime={highlight.created_at}>
          {formattedDate}
        </time>
      </div>
      <p className="comment-highlight-message__bubble">{highlight.content}</p>
    </article>
  );
}

export default CommentHighlightMessage;
