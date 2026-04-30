import type { ChatMessage } from '../../features/comments/types';
import type { SelectedAchievementTitle } from '../../features/game/types';

type Title = SelectedAchievementTitle;

const validGrades: Title['grade'][] = ['NORMAL', 'RARE', 'SUPER', 'ULTIMATE'];

export function getChatAuthorTitle(message: ChatMessage, fallbackTitle?: Title | null) {
  const value =
    message.selectedAchievementTitle ??
    message.selectedTitle ??
    message.selected_achievement_title ??
    message.selected_title ??
    fallbackTitle;

  if (!value || typeof value !== 'object') {
    return null;
  }

  const title = value as Partial<Title>;
  const isValid =
    typeof title.code === 'string' &&
    typeof title.displayName === 'string' &&
    typeof title.shortName === 'string' &&
    validGrades.includes(title.grade as Title['grade']) &&
    typeof title.description === 'string';

  return isValid ? (title as Title) : null;
}
