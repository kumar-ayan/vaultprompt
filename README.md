<div align="center">
  <br />
  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
  <h1>EventPilot</h1>
  <p><strong>The AI Copilot for Physical Events</strong></p>
  <p>
    <img src="https://img.shields.io/badge/Status-Beta-purple?style=for-the-badge" alt="Status" />
    <img src="https://img.shields.io/badge/Stack-Next.js%2016-black?style=for-the-badge&logo=next.js" alt="Next.js" />
    <img src="https://img.shields.io/badge/AI-Gemini%201.5%20Pro-blue?style=for-the-badge&logo=google" alt="Gemini" />
    <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License" />
  </p>
</div>

<br />

Conferences, summits, and hackathons are overwhelming. Sessions clash, hallways are chaotic, and networking happens by accident. **EventPilot** is an AI-powered copilot that turns your intent into a structured, real-time action plan — so you stop wandering and start connecting.

Type a natural query like *"I like AI and startups — suggest sessions"* or *"I have 1 hour free, what's worth attending?"* and get a personalized itinerary, session recommendations, and networking icebreakers — powered by Google Gemini, grounded by Google Search, and audited by Google Perspective.

---

## ✨ Features

### 🗺️ Smart Schedule Builder
Stop guessing what to attend. EventPilot generates a time-boxed itinerary tailored to your interests, goals, and free time slots — powered by **Gemini 1.5 Pro**.

### 🔍 Real-time Event Grounding (Google Custom Search)
Enable "Ground with Google Search" and the AI automatically fetches live context from the web — forcing Gemini to base recommendations on real, current event information rather than training data.

### 🤝 Networking Assistant
Every generated plan includes **2 context-aware icebreakers** crafted specifically for attendees or speakers in your domain. No awkward conversations. Just meaningful connections.

### 🛡️ Safety Audit (Google Perspective API)
Powered by **Google Jigsaw's Perspective API** — every event query is scored for toxicity (0–100%) before it reaches the AI. Enterprise-grade trust signals built into your workflow.

### ✨ AI Query Refiner
Hit "Refine Query" and Gemini rewrites your vague intent into a highly specific, actionable event goal — specifying domain, time constraints, and networking targets automatically.

### 🔒 Local-First Architecture
Your event plans are stored entirely in your browser's `localStorage`. Nothing is sent to our servers except stateless LLM API calls.

---

## 🏗️ Architecture

EventPilot uses a decoupled, privacy-first architecture:

| Tier | Technologies | Responsibility |
| --- | --- | --- |
| **Frontend** | Next.js 16 (App Router), React 19, CSS Modules | Event Copilot UI, local plan storage (`localStorage`), dynamic imports |
| **Backend (Stateless Proxy)** | Node.js, Express, Zod | Broker LLM calls securely; no database, no logging |
| **Google Services** | Gemini 1.5 Pro, Custom Search API, Perspective API | Plan generation, real-time grounding, safety auditing |
| **Secondary LLM Judge** | GPT-4o-mini via OpenRouter | Rate itinerary completeness 1–5 |

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v18+
- API keys for your desired providers (see below)

### 1. Set Up the Backend Proxy

```bash
cd server
npm install
cp ../.env.example .env
# Fill in your API keys in .env
npm run server:dev       # Starts on http://localhost:3001
```

### 2. Launch the Frontend

```bash
# From the project root
npm install
npm run dev              # Starts on http://localhost:3000
```

Navigate to [http://localhost:3000](http://localhost:3000) to see the landing page, or click **Plan My Event** to open the Event Copilot.

---

## 🔑 Environment Variables

Copy `.env.example` to `.env` in the project root and fill in:

```env
# LLM Providers
GEMINI_API_KEY=          # https://aistudio.google.com/app/apikey
OPENROUTER_API_KEY=      # https://openrouter.ai/keys (for judge model)

# Google Services
GOOGLE_PERSPECTIVE_API_KEY=   # https://perspectiveapi.com
GOOGLE_SEARCH_API_KEY=        # https://developers.google.com/custom-search
GOOGLE_SEARCH_CX=             # Your Programmable Search Engine ID
```

> **Note:** All Google Service keys are optional. If missing, the backend will gracefully fall back to safe mock responses.

---

## 📁 Project Structure

```
eventpilot/
├── src/                      # Next.js frontend
│   ├── app/
│   │   ├── page.tsx          # Landing page
│   │   ├── vault/            # Event Copilot UI (main app)
│   │   ├── features/         # Features showcase page
│   │   └── demo/             # Interactive demo
│   └── components/           # Navbar, Hero, Features, Footer
│
├── server/                   # Express stateless proxy
│   └── src/
│       ├── services/
│       │   ├── evalService.ts       # Gemini event plan generation
│       │   ├── improvementService.ts # AI query refiner
│       │   ├── safetyService.ts     # Google Perspective API
│       │   └── searchService.ts     # Google Custom Search grounding
│       └── routes/evals.ts          # API endpoints
│
└── .env.example              # Environment variable template
```

---

## 🛡️ Security

- **No Database**: The proxy is entirely stateless. Zero query persistence.
- **DOMPurify Sanitization**: All LLM outputs are sanitized before reaching the client.
- **Rate Limiting**: API routes are protected with `express-rate-limit`.
- **Helmet.js**: Standard HTTP security headers applied to every response.
- **Input Validation**: All request bodies validated with `Zod` schemas.

---

## 🤝 Contributing

Contributions welcome! Areas where help is most impactful:

- Adding real event data sources or calendar integrations
- Expanding the Safety Audit to more Perspective API attributes
- Building mobile-responsive layouts for on-the-go event use
- Writing additional unit tests for the new Google Services

Open an issue or submit a Pull Request!

<br />
<div align="center">
  <i>Built for those who believe the best conference moment isn't planned — it's engineered.</i>
</div>
