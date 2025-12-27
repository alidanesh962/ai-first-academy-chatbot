import { chatbotIntro } from './course-data';
import { loadOnboarding } from './onboarding';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ChatResponse {
  message: string;
  suggestions?: string[];
}

// Webhook URL for chat messages
const WEBHOOK_URL = 'https://seoul.aiautomation.bar/webhook/7319e205-80b1-4fc1-b5eb-4160e8473a84';

// Storage key for user ID
const USER_ID_KEY = 'kheizaran_user_id';

// Generate unique ID
const generateId = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

// Get or create a persistent user ID
function getUserId(): string {
  let userId = localStorage.getItem(USER_ID_KEY);
  if (!userId) {
    userId = `user_${generateId()}`;
    localStorage.setItem(USER_ID_KEY, userId);
  }
  return userId;
}

// Main chat function - sends message to webhook and returns response
export async function sendMessage(content: string): Promise<ChatResponse> {
  try {
    const userId = getUserId();
    const onboarding = loadOnboarding();
    
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: content,
        userId: userId,
        onboarding,
        timestamp: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Try to parse as JSON first
    const text = await response.text();
    
    try {
      const data = JSON.parse(text);
      
      // Handle array response format: [{ "output": "..." }]
      if (Array.isArray(data) && data.length > 0) {
        const firstItem = data[0];
        return {
          message: firstItem.output || firstItem.message || firstItem.response || firstItem.text || firstItem.content || JSON.stringify(firstItem),
          suggestions: firstItem.suggestions || [],
        };
      }
      
      // Handle object response format: { "message": "..." }
      return {
        message: data.message || data.response || data.output || data.text || data.content || text,
        suggestions: data.suggestions || [],
      };
    } catch {
      // If not JSON, treat the raw text as the message
      return {
        message: text,
        suggestions: [],
      };
    }
  } catch (error) {
    console.error('Error sending message to webhook:', error);
    // Return a fallback error message
    return {
      message: `متأسفانه در برقراری ارتباط مشکلی پیش آمد. لطفاً دوباره تلاش کنید.\n\n${chatbotIntro.capabilities.map(c => `• ${c}`).join('\n')}`,
      suggestions: ['محتوای دوره', 'مسیرهای یادگیری'],
    };
  }
}

// Create a new message object
export function createMessage(role: 'user' | 'assistant', content: string): Message {
  return {
    id: generateId(),
    role,
    content,
    timestamp: new Date(),
  };
}

// Get initial greeting message
export function getGreetingMessage(): Message {
  return createMessage('assistant', `${chatbotIntro.greeting}\n\n${chatbotIntro.description}\n\nچطور می‌توانم کمکتان کنم؟`);
}

