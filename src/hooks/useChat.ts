import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { Message, sendMessage, createMessage, getGreetingMessage, ChatResponse } from '../lib/chat-service';

// Key for storing onboarding response in sessionStorage
const ONBOARDING_RESPONSE_KEY = 'onboarding_response';
const CHAT_STORAGE_KEY = 'kheizaran_chat_state';

interface ChatState {
  messages: Message[];
  isLoading: boolean;
  suggestions: string[];
  addMessage: (message: Message) => void;
  sendUserMessage: (content: string) => Promise<void>;
  setSuggestions: (suggestions: string[]) => void;
  clearChat: () => void;
  initChat: () => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      messages: [],
      isLoading: false,
      suggestions: ['محتوای دوره چیست؟', 'از کجا شروع کنم؟'],

      addMessage: (message) => {
        set((state) => ({
          messages: [...state.messages, message],
        }));
      },

      sendUserMessage: async (content) => {
        const { addMessage, setSuggestions } = get();

        // Add user message
        const userMessage = createMessage('user', content);
        addMessage(userMessage);

        // Set loading state
        set({ isLoading: true, suggestions: [] });

        try {
          // Get AI response
          const response = await sendMessage(content);

          // Check if response contains $NOT_FOUND$ marker
          const NOT_FOUND_MARKER = '$NOT_FOUND$';
          const hasNotFound = response.message.includes(NOT_FOUND_MARKER);

          // Strip the $NOT_FOUND$ marker from the message
          const cleanedMessage = response.message.replace(NOT_FOUND_MARKER, '').trim();

          // Add assistant message with notFoundUserMessage if applicable
          const assistantMessage = createMessage('assistant', cleanedMessage);
          if (hasNotFound) {
            assistantMessage.notFoundUserMessage = content;
          }
          addMessage(assistantMessage);

          // Update suggestions
          if (response.suggestions) {
            setSuggestions(response.suggestions);
          }
        } catch (error) {
          // Handle error
          const errorMessage = createMessage('assistant', 'متأسفانه مشکلی پیش آمد. لطفاً دوباره تلاش کنید.');
          addMessage(errorMessage);
        } finally {
          set({ isLoading: false });
        }
      },

      setSuggestions: (suggestions) => {
        set({ suggestions });
      },

      clearChat: () => {
        set({ messages: [], suggestions: ['محتوای دوره چیست؟', 'از کجا شروع کنم؟'] });
      },

      initChat: () => {
        const { messages, setSuggestions } = get();
        if (messages.length === 0) {
          // Check if there's an onboarding response to display
          const onboardingResponseRaw = sessionStorage.getItem(ONBOARDING_RESPONSE_KEY);

          if (onboardingResponseRaw) {
            try {
              const onboardingResponse: ChatResponse = JSON.parse(onboardingResponseRaw);
              // Clear the stored response so it's only used once
              sessionStorage.removeItem(ONBOARDING_RESPONSE_KEY);

              // Create assistant message from the onboarding response
              const assistantMessage = createMessage('assistant', onboardingResponse.message);
              set({ messages: [assistantMessage] });

              // Set suggestions if available
              if (onboardingResponse.suggestions && onboardingResponse.suggestions.length > 0) {
                setSuggestions(onboardingResponse.suggestions);
              }
            } catch (error) {
              console.error('Error parsing onboarding response:', error);
              // Fall back to default greeting
              const greeting = getGreetingMessage();
              set({ messages: [greeting] });
            }
          } else {
            // No onboarding response, use default greeting
            const greeting = getGreetingMessage();
            set({ messages: [greeting] });
          }
        }
      },
    }),
    {
      name: CHAT_STORAGE_KEY,
      version: 1,
      // Only persist what we want to survive refreshes (never persist loading flags)
      partialize: (state) => ({
        messages: state.messages,
        suggestions: state.suggestions,
      }),
      // Rehydrate Date objects (JSON turns Date into ISO strings)
      storage: createJSONStorage(() => localStorage, {
        reviver: (key, value) => {
          if (key === 'timestamp' && typeof value === 'string') {
            const d = new Date(value);
            return Number.isNaN(d.getTime()) ? value : d;
          }
          return value;
        },
      }),
    }
  )
);

// Hook for using chat in components
export function useChat() {
  const store = useChatStore();
  return store;
}

export default useChat;

