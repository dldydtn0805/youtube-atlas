import type { ChatMessage } from '../../features/comments/types';

export function getChatAuthorTierCode(message: ChatMessage, fallbackTierCode?: string | null) {
  return normalizeTierCode(
    message.current_tier_code ??
      message.currentTierCode ??
      message.tier_code ??
      message.tierCode ??
      message.currentTier?.tierCode ??
      message.currentTier?.tier_code ??
      message.tier?.tierCode ??
      message.tier?.tier_code ??
      fallbackTierCode,
  );
}

function normalizeTierCode(tierCode?: string | null) {
  const normalizedTierCode = tierCode?.trim().toUpperCase();

  return normalizedTierCode || undefined;
}
