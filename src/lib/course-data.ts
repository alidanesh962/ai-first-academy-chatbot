export interface Track {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  lessons: string[];
}

export interface Module {
  id: string;
  number: number;
  title: string;
  description: string;
  topics: string[];
}

export const courseInfo = {
  name: 'آکادمی AI-First',
  tagline: 'تعریف دوباره‌ی شیوه‌ی کار کردن، فکر کردن و رهبری در عصر هوش مصنوعی',
  description: `آموزشی که به حرفه‌ای‌های کسب‌وکار و سازمان کمک می‌کند کارشان را دوباره طراحی کنند- اینبار با هوش مصنوعی در مرکزِ همه‌چیز`,
  duration: '+۳ ساعت',
  price: {
    original: '۱۰,۹۰۰,۰۰۰ تومان',
    discounted: '۲,۹۰۰,۰۰۰ تومان',
  },
};

export const tracks: Track[] = [
  {
    id: 'intro',
    title: 'مقدمه: شروع کار',
    subtitle: 'آشنایی با رویکرد AI-First',
    description: 'با یک نمای کلی از رویکرد AI-First شروع کنید، اهداف یادگیری خود را تعیین کنید و نکات عملی برای بهره‌مندی حداکثری از این دوره دریافت کنید.',
    lessons: [
      'آشنایی با AI-First',
      'تعیین اهداف یادگیری',
      'راهنمای استفاده از دوره',
    ],
  },
  {
    id: 'basics',
    title: 'مسیر ۱: مفاهیم پایه هوش مصنوعی',
    subtitle: 'ابزارها و مفاهیم پایه را یاد بگیرید',
    description: 'سواد پایه‌ای می‌سازید. زبان هوش مصنوعی، مفاهیم اصلی، کار با ابزارها و حریم خصوصی داده را یاد می‌گیرید. پایه‌ای برای مهارت‌های آینده با شفافیت، اعتمادبه‌نفس و ذهنیت AI-First.',
    lessons: [
      'زبان و اصطلاحات هوش مصنوعی',
      'مفاهیم اصلی LLM‌ها',
      'آشنایی با ابزارهای اصلی',
      'حریم خصوصی و امنیت داده',
      'ذهنیت AI-First',
    ],
  },
  {
    id: 'beginner',
    title: 'مسیر ۲: هوش مصنوعی سطح مبتدی',
    subtitle: 'پرامپت صحیح و حرفه‌ای بنویسید',
    description: 'یاد می‌گیرید چطور با تکنیک‌های مختلف پرامپت نویسی، سریع و با کیفیت از کارتان نتیجه بگیرید. پرامپت ساختاریافته، ورودی چندحالته (متن/تصویر/صدا) و کاربردهای واقعی را استفاده می‌کنید.',
    lessons: [
      'اصول پرامپت‌نویسی',
      'تکنیک‌های ساختاریافته',
      'ورودی چندحالته (متن/تصویر/صدا)',
      'کاربردهای عملی در نوشتن',
      'تحقیق و ارتباط تصویری',
    ],
  },
  {
    id: 'intermediate',
    title: 'مسیر ۳: هوش مصنوعی سطح متوسط',
    subtitle: 'دستیارهای سفارشی بسازید',
    description: 'به سمت GPT سفارشی، کانتکست‌های قابل استفاده مجدد، تحقیق عمیق، همکاری لحظه‌ای و تست ایده‌ها با پرسوناهای مصنوعی می‌روید. یاد می‌گیرید ابزارها را زنجیره کنید.',
    lessons: [
      'ساخت GPT سفارشی',
      'مدیریت کانتکست',
      'تحقیق عمیق با AI',
      'همکاری لحظه‌ای',
      'پرسوناهای مصنوعی',
    ],
  },
  {
    id: 'advanced',
    title: 'مسیر ۴: هوش مصنوعی سطح پیشرفته',
    subtitle: 'اتوماسیون و ایجنت‌ها',
    description: 'نمونه‌کارهای AI-محور می‌سازید، اپ بدون کدنویسی می‌سازید، فرایندهای چندمرحله‌ای را اتومات می‌کنید و منطق سیستم‌های ایجنت را می‌بینید.',
    lessons: [
      'ساخت اپلیکیشن بدون کد',
      'اتوماسیون فرایندها',
      'معرفی ایجنت‌ها',
      'مولتی‌ایجنت',
      'ریسک و پیاده‌سازی مسئولانه',
    ],
  },
];

export const modules: Module[] = [
  {
    id: 'module-1',
    number: 1,
    title: 'ذهنیت و پایه‌های هوش مصنوعی',
    description: 'چرا ۹۰٪ افراد نمی‌توانند از هوش مصنوعی نتیجه بگیرند؟ چون ذهنیت درست ندارند.',
    topics: [
      'چطور مثل یک مهندس هوش مصنوعی فکر کنید',
      '۳ مهارت نرم که بدون آنها پرامپت‌نویسی بی‌فایده است',
      'آینده شغل شما با هوش مصنوعی',
      'مدل‌های زبانی چگونه کار می‌کنند',
      'امنیت و حریم خصوصی',
    ],
  },
  {
    id: 'module-2',
    number: 2,
    title: 'مهندسی پرامپت حرفه‌ای',
    description: 'اینجا می‌فهمید چرا بعضی‌ها با یک پرامپت ساده، خروجی‌های فوق‌العاده می‌گیرند.',
    topics: [
      'چارچوب ۷ مرحله‌ای نوشتن پرامپت',
      'تکنیک‌های پیشرفته مهندسی پرامپت',
      '۱۰ ترفند طلایی برای بهبود پرامپت',
      'راز ثبات در خروجی',
      '۳ مدل پرامپت سیستمی',
    ],
  },
  {
    id: 'module-3',
    number: 3,
    title: 'ساخت سیستم‌های هوش مصنوعی',
    description: 'از "کاربر" به "معمار فرآیندهای کاری خود" تبدیل می‌شوید.',
    topics: [
      'ساخت Mini GPT اختصاصی',
      'ساخت GPT Stack',
      'مهندسی زمینه',
      'انتخاب مدل مناسب',
      'هوش مصنوعی چندوجهی',
      'معرفی +۱۰ ابزار حرفه‌ای',
    ],
  },
  {
    id: 'module-4',
    number: 4,
    title: 'اتوماسیون و ایجنت‌ها',
    description: 'کسب‌وکارهایی که از ایجنت استفاده نکنند، در ۲ سال آینده از رقابت خارج می‌شوند.',
    topics: [
      'ایجنت چیست و چطور فکر می‌کند',
      'ساخت داشبورد تعاملی بدون کد',
      'ساخت اپلیکیشن با Lovable و Google AI Studio',
      'کار با ایجنت‌های آماده',
      'مولتی‌ایجنت',
      'اتوماسیون در ChatGPT',
    ],
  },
  {
    id: 'module-5',
    number: 5,
    title: 'درآمدزایی واقعی',
    description: 'همه چیز یاد گرفتید، حالا وقت پول‌سازی است.',
    topics: [
      '۷ مدل درآمدی مبتنی بر هوش مصنوعی',
      'راه‌های درآمد دلاری',
      'کسب درآمد در ایران',
      'انتخاب مسیر شغلی',
      'اصول شروع کسب‌وکار با AI',
    ],
  },
];

export const chatbotIntro = {
  name: 'مشاور دوره AI-First',
  greeting: 'سلام! 👋 من مشاور دوره آکادمی AI-First هستم.',
  description: 'می‌توانم در مورد محتوای دوره، مسیرهای یادگیری، ماژول‌ها و هر سوالی که درباره هوش مصنوعی دارید کمکتان کنم.',
  capabilities: [
    'پاسخ به سوالات درباره محتوای دوره',
    'راهنمایی در انتخاب مسیر یادگیری',
    'توضیح مفاهیم هوش مصنوعی',
    'معرفی ابزارها و تکنیک‌ها',
  ],
};

// ---------------- English versions ----------------

export const courseInfoEn = {
  name: 'AI-First Academy',
  tagline: 'Redefining how we work, think and lead in the age of AI',
  description: `Training that helps business professionals and organizations redesign their work — this time with AI at the center of everything.`,
  duration: '+3 hours',
  price: {
    original: '10,900,000 Toman',
    discounted: '2,900,000 Toman',
  },
};

export const tracksEn: Track[] = [
  {
    id: 'intro',
    title: 'Intro: Getting Started',
    subtitle: 'Getting familiar with the AI-First approach',
    description:
      'Start with an overview of the AI-First approach, set your learning goals, and get practical tips to get the most out of this course.',
    lessons: [
      'Introduction to AI-First',
      'Setting learning goals',
      'How to use this course',
    ],
  },
  {
    id: 'basics',
    title: 'Track 1: AI Fundamentals',
    subtitle: 'Learn the core tools and concepts',
    description:
      'Build baseline literacy. Learn the language of AI, core concepts, working with tools, and data privacy. A foundation for future skills with clarity, confidence, and an AI-First mindset.',
    lessons: [
      'Language and terminology of AI',
      'Core concepts of LLMs',
      'Introduction to the main tools',
      'Data privacy and security',
      'The AI-First mindset',
    ],
  },
  {
    id: 'beginner',
    title: 'Track 2: Beginner AI',
    subtitle: 'Write correct, professional prompts',
    description:
      'Learn how to get fast, high-quality results from your work with different prompting techniques. Use structured prompts, multimodal input (text/image/voice), and real-world applications.',
    lessons: [
      'Principles of prompt writing',
      'Structured techniques',
      'Multimodal input (text/image/voice)',
      'Practical applications in writing',
      'Research and visual communication',
    ],
  },
  {
    id: 'intermediate',
    title: 'Track 3: Intermediate AI',
    subtitle: 'Build custom assistants',
    description:
      'Move toward custom GPTs, reusable contexts, deep research, real-time collaboration, and testing ideas with synthetic personas. Learn to chain tools together.',
    lessons: [
      'Building a custom GPT',
      'Managing context',
      'Deep research with AI',
      'Real-time collaboration',
      'Synthetic personas',
    ],
  },
  {
    id: 'advanced',
    title: 'Track 4: Advanced AI',
    subtitle: 'Automation and agents',
    description:
      'Build AI-powered portfolio pieces, no-code apps, automate multi-step processes, and see the logic of agent systems.',
    lessons: [
      'Building no-code applications',
      'Automating processes',
      'Introduction to agents',
      'Multi-agent systems',
      'Risk and responsible implementation',
    ],
  },
];

export const modulesEn: Module[] = [
  {
    id: 'module-1',
    number: 1,
    title: 'Mindset and Foundations of AI',
    description: "Why can't 90% of people get results from AI? Because they don't have the right mindset.",
    topics: [
      'How to think like an AI engineer',
      '3 soft skills without which prompt writing is useless',
      'The future of your career with AI',
      'How language models work',
      'Security and privacy',
    ],
  },
  {
    id: 'module-2',
    number: 2,
    title: 'Professional Prompt Engineering',
    description: 'Here you understand why some people get amazing outputs from a simple prompt.',
    topics: [
      '7-step framework for writing prompts',
      'Advanced prompt engineering techniques',
      '10 golden tricks to improve prompts',
      'The secret of consistent output',
      '3 system prompt models',
    ],
  },
  {
    id: 'module-3',
    number: 3,
    title: 'Building AI Systems',
    description: 'You move from "user" to "architect of your own workflows".',
    topics: [
      'Building your own Mini GPT',
      'Building a GPT Stack',
      'Context engineering',
      'Choosing the right model',
      'Multimodal AI',
      'Introducing +10 professional tools',
    ],
  },
  {
    id: 'module-4',
    number: 4,
    title: 'Automation and Agents',
    description: 'Businesses that do not use agents will be out of the competition in 2 years.',
    topics: [
      'What an agent is and how it thinks',
      'Building an interactive no-code dashboard',
      'Building an app with Lovable and Google AI Studio',
      'Working with ready-made agents',
      'Multi-agent systems',
      'Automation inside ChatGPT',
    ],
  },
  {
    id: 'module-5',
    number: 5,
    title: 'Real Monetization',
    description: "You've learned everything, now it's time to make money.",
    topics: [
      '7 AI-based income models',
      'Ways to earn in USD',
      'Earning income inside Iran',
      'Choosing a career path',
      'Principles of starting a business with AI',
    ],
  },
];

export const chatbotIntroEn = {
  name: 'AI-First Course Advisor',
  greeting: 'Hi! 👋 I am the AI-First Academy course advisor.',
  description:
    'I can help you with the course content, learning paths, modules, and any question you have about AI.',
  capabilities: [
    'Answers to questions about the course content',
    'Guidance on choosing a learning path',
    'Explaining AI concepts',
    'Introducing tools and techniques',
  ],
};

export type Lang = 'fa' | 'en';

export function getCourseInfo(lang: Lang) {
  return lang === 'en' ? courseInfoEn : courseInfo;
}

export function getTracks(lang: Lang): Track[] {
  return lang === 'en' ? tracksEn : tracks;
}

export function getModules(lang: Lang): Module[] {
  return lang === 'en' ? modulesEn : modules;
}

export function getChatbotIntro(lang: Lang) {
  return lang === 'en' ? chatbotIntroEn : chatbotIntro;
}

