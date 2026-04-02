export interface PlaybackProgress {
  videoId: string;
  videoTitle: string | null;
  channelTitle: string | null;
  thumbnailUrl: string | null;
  positionSeconds: number;
  updatedAt: string;
}

export interface UpsertPlaybackProgressInput {
  videoId: string;
  videoTitle: string | null;
  channelTitle: string | null;
  thumbnailUrl: string | null;
  positionSeconds: number;
}
