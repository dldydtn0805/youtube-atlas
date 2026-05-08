import type { AchievementTitleGrade } from '../../features/game/types';

const titleStarCountByGrade: Record<AchievementTitleGrade, number> = {
  NORMAL: 0,
  RARE: 1,
  SUPER: 2,
  ULTIMATE: 3,
};

export function getCommentTitleStars(grade: AchievementTitleGrade) {
  return '★'.repeat(titleStarCountByGrade[grade]);
}
