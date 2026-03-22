import { describe, expect, it } from 'vitest';
import {
  COMMENT_COOLDOWN_MS,
  COMMENT_DUPLICATE_WINDOW_MS,
  getLocalSpamViolation,
  getRemainingDurationMs,
  isDuplicateMessage,
  normalizeMessageContent,
} from './spam';

describe('comment spam helpers', () => {
  it('normalizes message content by trimming and collapsing whitespace', () => {
    expect(normalizeMessageContent('  hello   world \n again  ')).toBe('hello world again');
  });

  it('returns the remaining cooldown time until a deadline', () => {
    expect(getRemainingDurationMs(10_000, 6_500)).toBe(3_500);
    expect(getRemainingDurationMs(10_000, 10_500)).toBe(0);
  });

  it('detects duplicate messages after cooldown but inside the duplicate window', () => {
    const recentMessages = [
      {
        normalizedContent: 'hello world',
        sentAt: 10_000,
      },
    ];

    expect(getLocalSpamViolation(recentMessages, 'hello   world', 10_000 + COMMENT_COOLDOWN_MS + 1))
      .toEqual({
        code: 'duplicate',
      });
  });

  it('prefers cooldown over duplicate blocking for rapid consecutive sends', () => {
    const recentMessages = [
      {
        normalizedContent: 'hello world',
        sentAt: 10_000,
      },
    ];

    expect(getLocalSpamViolation(recentMessages, 'hello world', 12_000)).toEqual({
      code: 'cooldown',
      retryAfterSeconds: 3,
    });
  });

  it('stops treating a message as duplicate once the duplicate window expires', () => {
    const recentMessages = [
      {
        normalizedContent: 'hello world',
        sentAt: 10_000,
      },
    ];

    expect(
      getLocalSpamViolation(recentMessages, 'hello world', 10_000 + COMMENT_DUPLICATE_WINDOW_MS + 1),
    ).toBeNull();
    expect(isDuplicateMessage('hello world', 'hello  world')).toBe(true);
  });
});
