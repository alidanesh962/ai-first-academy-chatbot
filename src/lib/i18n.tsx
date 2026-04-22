import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

export type Language = 'fa' | 'en';

const STORAGE_KEY = 'kheizaran_language';

type Dict = Record<string, string>;

const fa: Dict = {
  // Common
  'common.loadingProcess': 'در حال پردازش...',
  'common.online': 'آنلاین • آماده پاسخگویی',
  'common.online.short': 'آنلاین',

  // Header / nav
  'nav.home': 'خانه',
  'nav.course': 'محتوای دوره',
  'nav.advisor': 'مشاور',
  'nav.brand.title': 'آکادمی AI-First',
  'nav.brand.subtitle': 'مشاور دوره',

  // Language toggle
  'lang.toggle.aria': 'تغییر زبان',
  'lang.fa': 'فارسی',
  'lang.en': 'English',

  // Welcome page
  'welcome.badge': 'مشاور هوشمند دوره',
  'welcome.hero.line1': 'مشاور',
  'welcome.hero.line2': 'دوره',
  'welcome.cta.viewCourse': 'مشاهده محتوای دوره',
  'welcome.cta.startChat': 'شروع گفتگو',
  'welcome.cta.talkAdvisor': 'گفتگو با مشاور',
  'welcome.cta.startChatWithAdvisor': 'شروع گفتگو با مشاور',
  'welcome.features.qa.title': 'پاسخ به سوالات',
  'welcome.features.qa.desc': 'هر سوالی درباره محتوای دوره دارید بپرسید',
  'welcome.features.guide.title': 'راهنمای یادگیری',
  'welcome.features.guide.desc': 'مسیر یادگیری مناسب شما را پیدا کنید',
  'welcome.features.concepts.title': 'توضیح مفاهیم',
  'welcome.features.concepts.desc': 'مفاهیم پیچیده را ساده بفهمید',
  'welcome.stats.tracks': 'مسیر یادگیری',
  'welcome.stats.modules': 'ماژول اصلی',
  'welcome.stats.hours': 'ساعت محتوا',
  'welcome.stats.tracksShort': 'مسیر',
  'welcome.stats.modulesShort': 'ماژول',
  'welcome.stats.numTracks': '۴',
  'welcome.stats.numModules': '۵',
  'welcome.stats.numHours': '+۳',
  'welcome.courseContent.title.prefix': 'محتوای',
  'welcome.courseContent.title.suffix': 'دوره',
  'welcome.content.sidebarBlurb':
    'در بیش از {duration} محتوای آموزشی، یاد می‌گیرید چطور هوش مصنوعی را در کارتان به کار ببرید. جلسات مستقیم، متمرکز و عملی هستند.',
  'welcome.content.haveQuestion': 'سوالی دارید؟',
  'welcome.content.advisorReady': 'مشاور دوره آماده پاسخگویی به سوالات شماست',
  'welcome.tracks.sectionTitle': 'مسیرهای یادگیری',
  'welcome.modules.sectionTitle': '۵ ماژول اصلی دوره',
  'welcome.modules.moreTopics': 'موضوع دیگر',
  'welcome.bottom.ready': 'آماده شروع یادگیری هستید؟',
  'welcome.bottom.readyDesc':
    'اگر سوالی درباره محتوای دوره، مسیر یادگیری یا هر چیز دیگری دارید، با مشاور هوشمند گفتگو کنید.',

  // Chat page
  'chat.header.title': 'مشاور دوره AI-First',
  'chat.header.clear': 'پاک کردن',
  'chat.welcomeTitle': 'خوش آمدید!',
  'chat.welcomeDesc':
    'من مشاور دوره آکادمی AI-First هستم. هر سوالی درباره محتوای دوره، مسیرهای یادگیری یا هوش مصنوعی دارید بپرسید.',
  'chat.input.placeholder': 'پیام خود را بنویسید...',
  'chat.input.helper': 'Shift + Enter برای خط جدید • Enter برای ارسال',
  'chat.suggest.content': 'محتوای دوره چیست؟',
  'chat.suggest.start': 'از کجا شروع کنم؟',
  'chat.suggest.contentShort': 'محتوای دوره',
  'chat.suggest.paths': 'مسیرهای یادگیری',
  'chat.askKheizaran.sent': 'سوالت برای خیزران ارسال شد',
  'chat.askKheizaran.action': 'از خیزران بپرس',
  'chat.error.generic': 'متأسفانه مشکلی پیش آمد. لطفاً دوباره تلاش کنید.',
  'chat.error.network': 'متأسفانه در برقراری ارتباط مشکلی پیش آمد. لطفاً دوباره تلاش کنید.',
  'chat.greeting.howCanIHelp': 'چطور می‌توانم کمکتان کنم؟',
  'chat.onboarding.fallback':
    'به دوره AI-First خوش آمدید! 🎉\n\nاطلاعات شما با موفقیت ثبت شد. من مشاور شخصی شما در این دوره هستم و آماده پاسخگویی به سوالاتتان هستم.',

  // Onboarding
  'onb.step.of': 'مرحله {current} از {total}',
  'onb.prev': 'قبلی',
  'onb.next': 'ادامه',
  'onb.finish': 'شروع گفتگو',
  'onb.backToHome.prefix': 'اگر نمی‌خواهید الان ادامه دهید، می‌توانید به',
  'onb.backToHome.link': 'صفحه اصلی',
  'onb.backToHome.suffix': 'برگردید.',
  'onb.submitting.title': 'در حال آماده‌سازی...',
  'onb.submitting.desc': 'لطفاً صبر کنید، مشاور شخصی شما در حال آماده شدن است.',

  'onb.phone.title': 'شماره تلفن',
  'onb.phone.desc': 'برای ارتباط و پیگیری بهتر، شماره تلفن‌تان را وارد کنید.',
  'onb.phone.label': 'شماره تلفن',
  'onb.phone.placeholder': 'مثلاً 9121234567',
  'onb.phone.hint':
    'کشور را از لیست انتخاب کنید و شماره را وارد کنید (بدون کد کشور). فقط برای شخصی‌سازی مشاوره و پیگیری بهتر استفاده می‌شود.',

  'onb.job.title': 'شغل',
  'onb.job.desc': 'شغل یا حوزه کاری شما چیست؟',
  'onb.job.placeholder': 'مثلاً برنامه‌نویس، مدیر محصول، فروش، دانشجو...',

  'onb.age.title': 'سن',
  'onb.age.desc': 'سن شما چند سال است؟',
  'onb.age.placeholder': 'مثلاً ۲۷',

  'onb.gender.title': 'جنسیت',
  'onb.gender.desc': 'لطفاً انتخاب کنید.',
  'onb.gender.male': 'مرد',
  'onb.gender.female': 'زن',
  'onb.gender.other': 'دیگر',
  'onb.gender.na': 'ترجیح می‌دهم نگویم',

  'onb.edu.title': 'تحصیلات',
  'onb.edu.desc': 'بالاترین سطح تحصیلات شما چیست؟',
  'onb.edu.placeholder': 'مثلاً دیپلم، کارشناسی، کارشناسی ارشد...',

  'onb.level.title': 'سطح (۰ تا ۱۰)',
  'onb.level.desc': 'سطح فعلی‌تان در کار با AI را مشخص کنید.',
  'onb.level.label': 'سطح شما (۰ تا ۱۰)',
  'onb.level.lo': '۰: تازه‌کار',
  'onb.level.hi': '۱۰: خیلی حرفه‌ای',

  'onb.time.title': 'زمان/هفته',
  'onb.time.desc': 'در هفته چقدر وقت می‌گذارید؟',
  'onb.time.2h': '۲ ساعت',
  'onb.time.5h': '۵ ساعت',
  'onb.time.10h': '۱۰ ساعت',

  'onb.pace.title': 'ریتم یادگیری',
  'onb.pace.desc': 'ترجیح می‌دهید سریع پیش بروید یا عمیق؟',
  'onb.pace.fast': 'فست ترک',
  'onb.pace.fastHint': 'سریع و نتیجه‌محور',
  'onb.pace.deep': 'عمیق',
  'onb.pace.deepHint': 'با مثال و تمرین بیشتر',

  'onb.tools.title': 'ابزارها (اختیاری)',
  'onb.tools.desc': 'چه ابزارهای AI استفاده می‌کنید؟',
  'onb.tools.other': 'ابزارهای دیگر (اختیاری)',
  'onb.tools.placeholder': 'مثلاً Midjourney, Notion AI...',

  'onb.week4.title': 'هدف هفته ۴',
  'onb.week4.desc': 'وقتی هفته ۴ تمام می‌شود، بیشتر از همه دوست دارید چه چیزی درست باشد؟',
  'onb.week4.explain': 'می‌تونم AI رو واضح توضیح بدم و اعتمادبه‌نفس داشته باشم.',
  'onb.week4.chatgpt': 'می‌تونم مثل حرفه‌ای‌ها از ChatGPT برای کارهای واقعی استفاده کنم.',
  'onb.week4.mini': 'یک مینی‌ورک‌فلو/اتوماسیونِ قابل‌استفاده برای کارم دارم.',
  'onb.week4.money': 'یک برنامه روشن دارم که AI چطور برام پول می‌سازه.',
  'onb.week4.other': 'سایر',
  'onb.week4.otherLabel': 'هدف شما',
  'onb.week4.otherPlaceholder': 'هدف خودتان را بنویسید...',

  // Errors
  'err.phone.required': 'شماره تلفن را وارد کنید.',
  'err.phone.invalid': 'شماره تلفن معتبر نیست.',
  'err.job.required': 'شغل خود را وارد کنید.',
  'err.age.numeric': 'سن را به‌صورت عدد وارد کنید.',
  'err.age.range': 'لطفاً سن را بین ۱۰ تا ۱۰۰ وارد کنید.',
  'err.gender.required': 'لطفاً یک گزینه انتخاب کنید.',
  'err.edu.required': 'تحصیلات را وارد کنید.',
  'err.level.required': 'سطح را وارد کنید.',
  'err.level.range': 'سطح باید بین ۰ تا ۱۰ باشد.',
  'err.time.required': 'لطفاً زمان هفتگی را انتخاب کنید.',
  'err.pace.required': 'لطفاً یک گزینه انتخاب کنید.',
  'err.week4.required': 'لطفاً یک گزینه انتخاب کنید.',
  'err.week4.otherRequired': 'لطفاً هدف خود را بنویسید.',

  // Phone input
  'phone.countryAria': 'کشور',
};

const en: Dict = {
  'common.loadingProcess': 'Processing...',
  'common.online': 'Online • Ready to help',
  'common.online.short': 'Online',

  'nav.home': 'Home',
  'nav.course': 'Course Content',
  'nav.advisor': 'Advisor',
  'nav.brand.title': 'AI-First Academy',
  'nav.brand.subtitle': 'Course Advisor',

  'lang.toggle.aria': 'Change language',
  'lang.fa': 'فارسی',
  'lang.en': 'English',

  'welcome.badge': 'Smart Course Advisor',
  'welcome.hero.line1': 'Course',
  'welcome.hero.line2': 'Advisor',
  'welcome.cta.viewCourse': 'View Course Content',
  'welcome.cta.startChat': 'Start Chat',
  'welcome.cta.talkAdvisor': 'Chat with Advisor',
  'welcome.cta.startChatWithAdvisor': 'Start chat with advisor',
  'welcome.features.qa.title': 'Answers to Questions',
  'welcome.features.qa.desc': 'Ask anything about the course content',
  'welcome.features.guide.title': 'Learning Guide',
  'welcome.features.guide.desc': 'Find the learning path that fits you',
  'welcome.features.concepts.title': 'Concept Explanations',
  'welcome.features.concepts.desc': 'Understand complex concepts simply',
  'welcome.stats.tracks': 'Learning Tracks',
  'welcome.stats.modules': 'Core Modules',
  'welcome.stats.hours': 'Hours of Content',
  'welcome.stats.tracksShort': 'Tracks',
  'welcome.stats.modulesShort': 'Modules',
  'welcome.stats.numTracks': '4',
  'welcome.stats.numModules': '5',
  'welcome.stats.numHours': '+3',
  'welcome.courseContent.title.prefix': 'Course',
  'welcome.courseContent.title.suffix': 'Content',
  'welcome.content.sidebarBlurb':
    'In over {duration} of training content, you will learn how to put AI to work in your job. Sessions are direct, focused, and practical.',
  'welcome.content.haveQuestion': 'Have a question?',
  'welcome.content.advisorReady': 'The course advisor is ready to answer your questions',
  'welcome.tracks.sectionTitle': 'Learning Tracks',
  'welcome.modules.sectionTitle': '5 Core Course Modules',
  'welcome.modules.moreTopics': 'more topics',
  'welcome.bottom.ready': 'Ready to start learning?',
  'welcome.bottom.readyDesc':
    'If you have any questions about the course content, learning path, or anything else, chat with the smart advisor.',

  'chat.header.title': 'AI-First Course Advisor',
  'chat.header.clear': 'Clear',
  'chat.welcomeTitle': 'Welcome!',
  'chat.welcomeDesc':
    'I am the AI-First Academy course advisor. Ask me anything about the course content, learning paths, or AI in general.',
  'chat.input.placeholder': 'Write your message...',
  'chat.input.helper': 'Shift + Enter for a new line • Enter to send',
  'chat.suggest.content': 'What is the course about?',
  'chat.suggest.start': 'Where should I start?',
  'chat.suggest.contentShort': 'Course content',
  'chat.suggest.paths': 'Learning paths',
  'chat.askKheizaran.sent': 'Your question was sent to Kheizaran',
  'chat.askKheizaran.action': 'Ask Kheizaran',
  'chat.error.generic': 'Sorry, something went wrong. Please try again.',
  'chat.error.network': 'Sorry, there was a connection problem. Please try again.',
  'chat.greeting.howCanIHelp': 'How can I help you?',
  'chat.onboarding.fallback':
    'Welcome to the AI-First course! 🎉\n\nYour information was saved successfully. I am your personal advisor for this course and ready to answer your questions.',

  'onb.step.of': 'Step {current} of {total}',
  'onb.prev': 'Previous',
  'onb.next': 'Continue',
  'onb.finish': 'Start Chat',
  'onb.backToHome.prefix': 'If you do not want to continue now, you can go back to the',
  'onb.backToHome.link': 'home page',
  'onb.backToHome.suffix': '.',
  'onb.submitting.title': 'Preparing...',
  'onb.submitting.desc': 'Please wait, your personal advisor is getting ready.',

  'onb.phone.title': 'Phone Number',
  'onb.phone.desc': 'Enter your phone number so we can stay in touch.',
  'onb.phone.label': 'Phone Number',
  'onb.phone.placeholder': 'e.g. 9121234567',
  'onb.phone.hint':
    'Pick your country from the list and enter the number (without the country code). Used only to personalize advice and follow-up.',

  'onb.job.title': 'Job',
  'onb.job.desc': 'What is your job or field of work?',
  'onb.job.placeholder': 'e.g. Developer, Product Manager, Sales, Student...',

  'onb.age.title': 'Age',
  'onb.age.desc': 'How old are you?',
  'onb.age.placeholder': 'e.g. 27',

  'onb.gender.title': 'Gender',
  'onb.gender.desc': 'Please choose one.',
  'onb.gender.male': 'Male',
  'onb.gender.female': 'Female',
  'onb.gender.other': 'Other',
  'onb.gender.na': 'Prefer not to say',

  'onb.edu.title': 'Education',
  'onb.edu.desc': 'What is your highest level of education?',
  'onb.edu.placeholder': 'e.g. Diploma, Bachelor, Master...',

  'onb.level.title': 'Level (0 to 10)',
  'onb.level.desc': 'Rate your current level working with AI.',
  'onb.level.label': 'Your level (0 to 10)',
  'onb.level.lo': '0: Beginner',
  'onb.level.hi': '10: Expert',

  'onb.time.title': 'Time / Week',
  'onb.time.desc': 'How much time can you spend per week?',
  'onb.time.2h': '2 hours',
  'onb.time.5h': '5 hours',
  'onb.time.10h': '10 hours',

  'onb.pace.title': 'Learning Pace',
  'onb.pace.desc': 'Do you prefer to move fast or go deep?',
  'onb.pace.fast': 'Fast Track',
  'onb.pace.fastHint': 'Quick and results-focused',
  'onb.pace.deep': 'Deep',
  'onb.pace.deepHint': 'With more examples and practice',

  'onb.tools.title': 'Tools (optional)',
  'onb.tools.desc': 'Which AI tools do you use?',
  'onb.tools.other': 'Other tools (optional)',
  'onb.tools.placeholder': 'e.g. Midjourney, Notion AI...',

  'onb.week4.title': 'Week 4 Goal',
  'onb.week4.desc': 'By the end of week 4, what would you most like to be true?',
  'onb.week4.explain': 'I can clearly explain AI and feel confident about it.',
  'onb.week4.chatgpt': 'I can use ChatGPT like a pro for real work.',
  'onb.week4.mini': 'I have a reusable mini-workflow / automation for my job.',
  'onb.week4.money': 'I have a clear plan for how AI will make me money.',
  'onb.week4.other': 'Other',
  'onb.week4.otherLabel': 'Your goal',
  'onb.week4.otherPlaceholder': 'Write your own goal...',

  'err.phone.required': 'Please enter your phone number.',
  'err.phone.invalid': 'The phone number is not valid.',
  'err.job.required': 'Please enter your job.',
  'err.age.numeric': 'Please enter age as a number.',
  'err.age.range': 'Please enter an age between 10 and 100.',
  'err.gender.required': 'Please select an option.',
  'err.edu.required': 'Please enter your education.',
  'err.level.required': 'Please enter a level.',
  'err.level.range': 'Level must be between 0 and 10.',
  'err.time.required': 'Please select your weekly time.',
  'err.pace.required': 'Please select an option.',
  'err.week4.required': 'Please select an option.',
  'err.week4.otherRequired': 'Please write your goal.',

  'phone.countryAria': 'Country',
};

const dictionaries: Record<Language, Dict> = { fa, en };

interface I18nContextValue {
  lang: Language;
  setLang: (l: Language) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
  dir: 'rtl' | 'ltr';
  isRtl: boolean;
}

const I18nContext = createContext<I18nContextValue | null>(null);

function getInitialLang(): Language {
  if (typeof window === 'undefined') return 'fa';
  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (saved === 'fa' || saved === 'en') return saved;
  return 'fa';
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(getInitialLang);

  const dir: 'rtl' | 'ltr' = lang === 'fa' ? 'rtl' : 'ltr';

  useEffect(() => {
    const html = document.documentElement;
    html.lang = lang;
    html.dir = dir;
    document.body.style.direction = dir;
    document.body.setAttribute('data-lang', lang);
    try {
      window.localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // ignore
    }
  }, [lang, dir]);

  const value = useMemo<I18nContextValue>(() => {
    const t = (key: string, vars?: Record<string, string | number>): string => {
      const dict = dictionaries[lang] ?? fa;
      let str = dict[key] ?? fa[key] ?? key;
      if (vars) {
        for (const [k, v] of Object.entries(vars)) {
          str = str.split(`{${k}}`).join(String(v));
        }
      }
      return str;
    };
    const setLang = (l: Language) => setLangState(l);
    return { lang, setLang, t, dir, isRtl: dir === 'rtl' };
  }, [lang, dir]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within LanguageProvider');
  return ctx;
}

export function useT() {
  return useI18n().t;
}
