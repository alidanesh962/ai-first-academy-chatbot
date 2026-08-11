# AI-First Academy Chatbot

Bilingual (Persian / English) course advisor for **آکادمی AI-First**. Visitors explore the course content, complete a short onboarding flow, then chat with an AI advisor that answers questions about the curriculum, learning paths, and concepts.

**Live repo:** [github.com/alidanesh962/ai-first-academy-chatbot](https://github.com/alidanesh962/ai-first-academy-chatbot)

---

## Features

- **Welcome page** — course overview, learning tracks, modules, and FAQ-style accordion content
- **Onboarding** — collects learner profile (phone, job, experience, goals, etc.) before chat
- **AI chat advisor** — webhook-backed assistant with suggested prompts and markdown replies
- **Ask Kheizaran** — escalate unanswered questions to a human via a separate webhook
- **Language toggle** — Persian (RTL) and English, persisted in `localStorage`
- **Responsive UI** — mobile and desktop layouts with Framer Motion transitions

---

## Tech stack

| Layer | Tools |
| --- | --- |
| UI | React 18, TypeScript, Vite |
| Styling | Tailwind CSS, Framer Motion, Lucide icons |
| Routing | React Router |
| State / i18n | Zustand patterns via hooks, custom `LanguageProvider` |
| Chat backend | HTTP webhooks (`src/lib/chat-service.ts`) |
| Deploy | Vercel (`vercel.json` SPA rewrites) |

---

## Pages & routes

| Route | Page | Purpose |
| --- | --- | --- |
| `/` | Welcome | Landing, course content, start chat CTA |
| `/onboarding` | Onboarding | Profile questionnaire (skipped if already completed) |
| `/chat` | Chat | Conversational course advisor |

Flow: **Welcome → Onboarding (first visit) → Chat**

---

## Project structure

```text
├── public/                 # Static assets
├── src/
│   ├── components/
│   │   ├── chat/           # Message bubble, input, typing indicator
│   │   ├── layout/         # Header, page wrapper, container
│   │   └── ui/             # Button, input, accordion, language toggle, etc.
│   ├── hooks/              # useChat, useDevice
│   ├── lib/
│   │   ├── chat-service.ts # Webhook chat + escalation API
│   │   ├── course-data.ts  # Course tracks, modules, intros (FA/EN)
│   │   ├── i18n.tsx        # Language provider + translations
│   │   └── onboarding.ts   # Onboarding types, validation, storage
│   ├── pages/              # Welcome, Onboarding, Chat
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.ts
└── vercel.json
```

---

## Getting started

### Prerequisites

- Node.js 18+ (recommended)
- npm

### Install & run

```bash
# Clone
git clone https://github.com/alidanesh962/ai-first-academy-chatbot.git
cd ai-first-academy-chatbot

# Install dependencies
npm install

# Start development server
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`).

### Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start Vite dev server |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

---

## How chat works

1. Onboarding answers are stored in `localStorage` and sent to the chat webhook when the user finishes the form.
2. Chat messages are `POST`ed as JSON (`message`, `userId`, `timestamp`) to the configured webhook.
3. Responses support several shapes (`output`, `message`, `response`, etc.), including array wrappers.
4. If the bot cannot answer, the UI can offer **Ask Kheizaran**, which posts the question to a separate escalation webhook.

Webhook URLs live in `src/lib/chat-service.ts`. Update them there if you point the app at a different automation backend.

---

## Internationalization

- Default language: **Persian (`fa`)**, RTL
- Toggle switches to **English (`en`)**, LTR
- Preference key: `kheizaran_language`
- Strings: `src/lib/i18n.tsx`
- Course copy: `src/lib/course-data.ts`

---

## Deployment

The project is set up for **Vercel**. `vercel.json` rewrites all routes to `/` so client-side routing works.

```bash
npm run build
# Deploy the `dist/` folder, or connect the GitHub repo to Vercel
```

---

## License

Private course product UI. Share or reuse according to the repository owner's terms.
