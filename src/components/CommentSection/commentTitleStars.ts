import type { AchievementTitleGrade } from '../../features/game/types';

const titleStarCountByGrade: Record<AchievementTitleGrade, number> = {
  NORMAL: 1,
  RARE: 2,
  SUPER: 3,
  ULTIMATE: 4,
};

export function getCommentTitleStars(grade: AchievementTitleGrade) {
  return '★'.repeat(titleStarCountByGrade[grade]);
}
