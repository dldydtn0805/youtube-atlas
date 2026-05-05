import type { CommentHighlightMessage as CommentHighlight } from '../../features/comments/highlightTypes';
import type { SelectedAchievementTitle } from '../../features/game/types';
import CommentAuthorTitleText from './CommentAuthorTitleText';
import { getCommentHighlightIdentity } from './commentHighlightIdentity';

interface Props {
  availableTitles?: readonly SelectedAchievementTitle[];
  highlight: CommentHighlight;
}

export default function CommentHighlightAuthor({ availableTitles, highlight }: Props) {
  const identity = getCommentHighlightIdentity(highlight, availableTitles);
  const author = highlight.author.replace(/^@+/, '').trim() || highlight.author;

  return (
    <span className="comment-message__identity" data-tier-code={identity.tierCode}>
      <strong className="comment-message__author">{author}</strong>
      {identity.title ? <CommentAuthorTitleText title={identity.title} /> : null}
    </span>
  );
}
