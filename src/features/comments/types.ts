interface ChatMessageTier {
  tierCode?: string | null;
  tier_code?: string | null;
}

export interface ChatMessage {
  id: number;
  video_id: string;
  message_type?: string;
  system_event_type?: 'TRADE' | 'LOGIN' | 'TIER' | string | null;
  author: string;
  content: string;
  client_id: string;
  user_id?: number | null;
  currentTier?: ChatMessageTier | null;
  currentTierCode?: string | null;
  current_tier_code?: string | null;
  tier?: ChatMessageTier | null;
  tierCode?: string | null;
  tier_code?: string | null;
  created_at: string;
}

export interface ChatPresence {
  active_count: number;
  participants?: ChatPresenceParticipant[];
}

export interface ChatPresenceParticipant {
  participant_id: string;
  display_name: string;
}

export interface SendMessageInput {
  videoId: string;
  author: string;
  content: string;
  clientId: string;
  regionCode?: string | null;
}
