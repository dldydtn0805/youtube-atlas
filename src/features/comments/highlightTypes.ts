export interface CommentHighlightMessage {
  id: string;
  video_id: string;
  message_type: 'COMMENT_HIGHLIGHT' | string;
  source: 'YOUTUBE_COMMENT' | string;
  label: string;
  author: string;
  content: string;
  client_id: string;
  like_count: number;
  ephemeral: boolean;
  created_at: string;
}
