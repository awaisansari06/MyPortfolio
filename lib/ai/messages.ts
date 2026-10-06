export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export const MAX_CHAT_MESSAGES = 10;
export const MAX_CHAT_BODY_BYTES = 64 * 1024;
const MAX_USER_CHARACTERS = 500;
const MAX_ASSISTANT_CHARACTERS = 8000;
const MAX_TOTAL_CHARACTERS = 20000;

export function validateChatMessages(payload: unknown):
  | { messages: ChatMessage[] }
  | { error: string } {
  if (!payload || typeof payload !== 'object' || !('messages' in payload)) {
    return { error: 'Invalid message payload. An array of messages is required.' };
  }

  const { messages } = payload;
  if (!Array.isArray(messages) || messages.length === 0 || messages.length > MAX_CHAT_MESSAGES) {
    return { error: `Please provide between 1 and ${MAX_CHAT_MESSAGES} messages.` };
  }

  let totalCharacters = 0;
  const validated: ChatMessage[] = [];
  for (const message of messages) {
    if (!message || typeof message !== 'object' ||
      (message.role !== 'user' && message.role !== 'assistant') ||
      typeof message.content !== 'string' || !message.content.trim()) {
      return { error: 'Every message must have a valid role and non-empty text content.' };
    }

    const limit = message.role === 'user' ? MAX_USER_CHARACTERS : MAX_ASSISTANT_CHARACTERS;
    if (message.content.length > limit) {
      return { error: `Each ${message.role} message must be at most ${limit} characters.` };
    }
    totalCharacters += message.content.length;
    if (totalCharacters > MAX_TOTAL_CHARACTERS) {
      return { error: 'Conversation is too long. Please reset the conversation.' };
    }
    validated.push({ role: message.role, content: message.content });
  }

  if (validated[validated.length - 1].role !== 'user') {
    return { error: 'Latest message must be from user with text content.' };
  }
  return { messages: validated };
}
