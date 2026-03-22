import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createComment } from './api';

const { from, insert, single } = vi.hoisted(() => {
  const single = vi.fn();
  const select = vi.fn(() => ({
    single,
  }));
  const insert = vi.fn(() => ({
    select,
  }));
  const from = vi.fn(() => ({
    insert,
  }));

  return {
    from,
    insert,
    single,
  };
});

vi.mock('../../lib/supabase', () => ({
  supabase: {
    from,
  },
}));

describe('createComment', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('normalizes message content before inserting it', async () => {
    single.mockResolvedValueOnce({
      data: {
        author: '익명',
        client_id: 'client-1',
        content: 'hello world',
        created_at: '2026-03-22T00:00:00.000Z',
        id: 1,
        video_id: 'video-1',
      },
      error: null,
    });

    await createComment({
      author: ' ',
      clientId: 'client-1',
      content: '  hello   world  ',
      videoId: 'video-1',
    });

    expect(from).toHaveBeenCalledWith('comments');
    expect(insert).toHaveBeenCalledWith({
      author: '익명',
      client_id: 'client-1',
      content: 'hello world',
      video_id: 'video-1',
    });
  });

  it('maps cooldown database errors into a typed submission error', async () => {
    single.mockResolvedValueOnce({
      data: null,
      error: {
        details: 'retry_after_seconds=4',
        message: 'comment_spam_cooldown',
      },
    });

    await expect(
      createComment({
        author: '',
        clientId: 'client-1',
        content: 'hello world',
        videoId: 'video-1',
      }),
    ).rejects.toMatchObject({
      code: 'cooldown',
      message: '채팅 흐름을 위해 4초 후에 다시 보낼 수 있어요.',
      retryAfterSeconds: 4,
    });
  });

  it('maps duplicate database errors into a typed submission error', async () => {
    single.mockResolvedValueOnce({
      data: null,
      error: {
        details: null,
        message: 'comment_spam_duplicate',
      },
    });

    await expect(
      createComment({
        author: '',
        clientId: 'client-1',
        content: 'hello world',
        videoId: 'video-1',
      }),
    ).rejects.toMatchObject({
      code: 'duplicate',
      message: '같은 메시지는 30초 후에 다시 보낼 수 있어요.',
    });
  });
});
