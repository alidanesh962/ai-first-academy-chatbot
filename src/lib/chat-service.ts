import { chatbotIntro, chatbotIntroEn } from './course-data';
import { loadOnboarding } from './onboarding';

// Lightweight language resolver for non-React modules.
// The LanguageProvider persists the selected language to localStorage under this key.
const LANG_KEY = 'kheizaran_language';
function currentLang(): 'fa' | 'en' {
  try {
    const v = localStorage.getItem(LANG_KEY);
    return v === 'en' ? 'en' : 'fa';
  } catch {
    return 'fa';
  }
}
function getIntro() {
  return currentLang() === 'en' ? chatbotIntroEn : chatbotIntro;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  /**
   * Optional: when the assistant could not find an answer and wants to offer
   * escalating the user's question to Kheizaran via a webhook.
   */
  notFoundUserMessage?: string;
}

export interface ChatResponse {
  message: string;
  suggestions?: string[];
}

// Webhook URL for chat messages
const WEBHOOK_URL = 'https://seoul.aiautomation.bar/webhook/7319e205-80b1-4fc1-b5eb-4160e8473a84';

// Webhook URL for "Ask Kheizaran" escalations (when bot doesn't know the answer)
const ASK_KHEIZARAN_WEBHOOK_URL = 'https://seoul.aiautomation.bar/webhook/a23cc996-5836-4081-b4f9-8b088e4922d0';

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

/**
 * Detect whether a user message is written in English or Persian
 * based on the script used in the text (not the UI language toggle).
 */
function detectMessageLanguage(text: string): 'English' | 'Persian' {
  const persianCount = (text.match(/[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/g) || []).length;
  const latinCount = (text.match(/[A-Za-z]/g) || []).length;

  if (persianCount > latinCount) return 'Persian';
  if (latinCount > persianCount) return 'English';
  return currentLang() === 'en' ? 'English' : 'Persian';
}

// Main chat function - sends message to webhook and returns response
export async function sendMessage(content: string): Promise<ChatResponse> {
  try {
    const userId = getUserId();
    
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: content,
        language: detectMessageLanguage(content),
        userId: userId,
        language: currentLang(),
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
    const intro = getIntro();
    const lang = currentLang();
    return {
      message:
        (lang === 'en'
          ? 'Sorry, there was a connection problem. Please try again.'
          : 'متأسفانه در برقراری ارتباط مشکلی پیش آمد. لطفاً دوباره تلاش کنید.') +
        `\n\n${intro.capabilities.map((c) => `• ${c}`).join('\n')}`,
      suggestions:
        lang === 'en' ? ['Course content', 'Learning paths'] : ['محتوای دوره', 'مسیرهای یادگیری'],
    };
  }
}

/**
 * Format onboarding data as a Persian message with all questions and answers.
 */
function formatOnboardingMessagePersian(data: ReturnType<typeof loadOnboarding>): string {
  if (!data) return '';
  
  const genderLabels: Record<string, string> = {
    male: 'مرد',
    female: 'زن',
    other: 'دیگر',
    na: 'ترجیح می‌دهم نگویم',
  };
  
  const timeLabels: Record<string, string> = {
    '2h': '۲ ساعت',
    '5h': '۵ ساعت',
    '10h': '۱۰ ساعت',
  };
  
  const paceLabels: Record<string, string> = {
    fast: 'فست ترک (سریع و نتیجه‌محور)',
    deep: 'عمیق (با مثال و تمرین بیشتر)',
  };
  
  const week4Labels: Record<string, string> = {
    explain_ai_confident: 'می‌تونم AI رو واضح توضیح بدم و اعتمادبه‌نفس داشته باشم.',
    use_chatgpt_pro: 'می‌تونم مثل حرفه‌ای‌ها از ChatGPT برای کارهای واقعی استفاده کنم.',
    mini_workflow: 'یک مینی‌ورک‌فلو/اتوماسیونِ قابل‌استفاده برای کارم دارم.',
    money_plan: 'یک برنامه روشن دارم که AI چطور برام پول می‌سازه.',
    other: 'سایر',
  };

  const lines: string[] = [
    `سوالات آنبوردینگ:`,
    ``,
    `۱. شماره تلفن: ${data.phone}`,
    `۲. شغل: ${data.job}`,
    `۳. سن: ${data.age}`,
    `۴. جنسیت: ${genderLabels[data.gender] || data.gender}`,
    `۵. تحصیلات: ${data.education}`,
    `۶. سطح فعلی در کار با AI (۰ تا ۱۰): ${data.level0to10}`,
    `۷. زمان در هفته: ${timeLabels[data.timePerWeek] || data.timePerWeek}`,
    `۸. ریتم یادگیری: ${paceLabels[data.pace] || data.pace}`,
    `۹. ابزارهای AI: ${(data.tools && data.tools.length > 0) ? data.tools.join('، ') : 'هیچکدام'}`,
    `۱۰. هدف هفته ۴: ${week4Labels[data.week4GoalChoice] || data.week4GoalChoice}`,
  ];
  
  if (data.week4GoalChoice === 'other' && data.week4GoalOtherText) {
    lines.push(`    توضیحات: ${data.week4GoalOtherText}`);
  }
  
  return lines.join('\n');
}

/**
 * Send onboarding data to webhook after completing the onboarding flow.
 * Returns the assistant's response to display in the chat.
 */
export async function sendOnboardingWebhook(): Promise<ChatResponse> {
  try {
    const userId = getUserId();
    const onboarding = loadOnboarding();
    const messagePersian = formatOnboardingMessagePersian(onboarding);
    
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        onboarding: true,
        message: messagePersian,
        userId: userId,
        onboardingData: onboarding,
        language: currentLang(),
        timestamp: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

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
    console.error('Error sending onboarding webhook:', error);
    const lang = currentLang();
    return {
      message:
        lang === 'en'
          ? `Welcome to the AI-First course! 🎉\n\nYour information was saved successfully. I am your personal advisor for this course and ready to answer your questions.`
          : `به دوره AI-First خوش آمدید! 🎉\n\nاطلاعات شما با موفقیت ثبت شد. من مشاور شخصی شما در این دوره هستم و آماده پاسخگویی به سوالاتتان هستم.`,
      suggestions:
        lang === 'en'
          ? ['What is the course about?', 'Where should I start?']
          : ['محتوای دوره چیست؟', 'از کجا شروع کنم؟'],
    };
  }
}

/**
 * Send a user's question to an escalation webhook ("Ask Kheizaran").
 * This is intentionally fire-and-forget from the UI perspective; errors are surfaced via rejection.
 */
export async function sendAskKheizaranWebhook(question: string): Promise<void> {
  const userId = getUserId();
  const onboarding = loadOnboarding();

  const response = await fetch(ASK_KHEIZARAN_WEBHOOK_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      type: 'ask_kheizaran',
      message: question,
      userId,
      onboarding,
      timestamp: new Date().toISOString(),
    }),
  });

  if (!response.ok) {
    throw new Error(`AskKheizaran webhook failed: ${response.status}`);
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

// Get initial greeting message (language-aware)
export function getGreetingMessage(): Message {
  const intro = getIntro();
  const lang = currentLang();
  const tail = lang === 'en' ? 'How can I help you?' : 'چطور می‌توانم کمکتان کنم؟';
  return createMessage('assistant', `${intro.greeting}\n\n${intro.description}\n\n${tail}`);
}

