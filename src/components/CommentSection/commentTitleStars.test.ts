import { describe, expect, it } from 'vitest';
import { getCommentTitleStars } from './commentTitleStars';

describe('getCommentTitleStars', () => {
  it('starts stars from rare titles', () => {
    expect(getCommentTitleStars('NORMAL')).toBe('');
    expect(getCommentTitleStars('RARE')).toBe('★');
    expect(getCommentTitleStars('SUPER')).toBe('★★');
    expect(getCommentTitleStars('ULTIMATE')).toBe('★★★');
  });
});
