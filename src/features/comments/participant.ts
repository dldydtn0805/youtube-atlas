export const CHAT_PARTICIPANT_STORAGE_KEY = 'youtube-atlas-chat-participant-id';
export const CHAT_PARTICIPANT_HEADER = 'x-participant-id';

export function getChatParticipantId() {
  if (typeof window === 'undefined') {
    return 'server-render';
  }

  const storedValue = window.localStorage.getItem(CHAT_PARTICIPANT_STORAGE_KEY);

  if (storedValue) {
    return storedValue;
  }

  const nextValue =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `participant-${Date.now()}`;

  window.localStorage.setItem(CHAT_PARTICIPANT_STORAGE_KEY, nextValue);

  return nextValue;
}
