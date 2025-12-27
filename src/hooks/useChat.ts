import { create } from 'zustand';
import { Message, sendMessage, createMessage, getGreetingMessage } from '../lib/chat-service';

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

export const useChatStore = create<ChatState>((set, get) => ({
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
      
      // Add assistant message
      const assistantMessage = createMessage('assistant', response.message);
      addMessage(assistantMessage);
      
      // Update suggestions
      if (response.suggestions) {
        setSuggestions(response.suggestions);
      }
    } catch (error) {
      // Handle error
      const errorMessage = createMessage(
        'assistant',
        'متأسفانه مشکلی پیش آمد. لطفاً دوباره تلاش کنید.'
      );
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
    const { messages } = get();
    if (messages.length === 0) {
      const greeting = getGreetingMessage();
      set({ messages: [greeting] });
    }
  },
}));

// Hook for using chat in components
export function useChat() {
  const store = useChatStore();
  return store;
}

export default useChat;

