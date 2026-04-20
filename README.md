# VaultPrompt - LLM Prompt Version Control (Demo)

VaultPrompt is a specialized version control system for LLM prompts. This demo version focuses on a **local-first** experience, storing your prompt history directly in your browser's `localStorage` while utilizing powerful LLMs for analysis and evaluation.

## 🚀 Features

- **Local History**: Your prompts and versions are saved locally in your browser. No account required.
- **Multi-model Evaluation**: Run the same prompt through GPT-4o, Claude 3.5 Sonnet, and Gemini Pro simultaneously to compare results.
- **Smart Analysis**: Get a "Readiness Score" based on Clarity, Constraints, and Output Format.
- **AI Improvement**: Automatically refine your prompts using specialized "Master Prompt Engineer" models.
- **Version Tags**: Label versions as STABLE, EXPERIMENTAL, or DEPRECATED.

## 📁 Project Structure

```
vaultprompt/
├── server/             # Backend Express server (LLM Proxy & Evals)
├── src/                # Frontend Next.js application
├── README.md           # This file
└── .env.example        # Environment variables template
```

## 🔧 Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn
- OpenRouter API key (for LLM access)

### 1. Backend Setup

The backend serves as a secure proxy for LLM calls and evaluation orchestration.

1. From the `server/` directory, install dependencies:
   ```bash
   cd server
   npm install
   ```
2. Create a `.env` file by copying `.env.example`:
   ```bash
   cp .env.example .env
   ```
3. Fill in your environment variables in `.env`:
   - `OPENROUTER_API_KEY`: Your OpenRouter API key.
   - `PORT`: Server port (default: 3001).
4. Run the backend server:
   ```bash
   npm run dev
   ```

### 2. Frontend Setup

1. From the root directory, install dependencies:
   ```bash
   npm install
   ```
2. Run the frontend development server:
   ```bash
   npm run dev
   ```
3. Open [http://localhost:3000/demo](http://localhost:3000/demo) to start managing prompts.

## 💻 Tech Stack

### Backend
- **Node.js** with **Express**
- **TypeScript**
- **OpenRouter API** for LLM access
- **Zod** for validation

### Frontend
- **Next.js 15** (App Router)
- **React 19**
- **Vanilla CSS** for styling
- **Browser LocalStorage** for history persistence

---

*Built for the AI engineering community*
