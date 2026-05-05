import type { SelectedAchievementTitle } from '../../features/game/types';
import { getCommentTitleStars } from './commentTitleStars';
import './CommentAuthorTitleBadgeShimmer.css';
import './CommentAuthorTitleText.css';
import './CommentAuthorTitleShimmer.css';

interface CommentAuthorTitleTextProps {
  title: SelectedAchievementTitle;
}

export default function CommentAuthorTitleText({ title }: CommentAuthorTitleTextProps) {
  const titleStars = getCommentTitleStars(title.grade);

  return (
    <>
      <span className="comment-message__title-badge" data-grade={title.grade} title={title.description}>
        <span className="comment-message__title-name" data-grade={title.grade}>
          {title.displayName}
        </span>
        <span className="comment-message__title-star" data-grade={title.grade} aria-hidden="true">
          {titleStars}
        </span>
      </span>
    </>
  );
}
