<div align="center">
  <br />
  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2l9 4.5v11L12 22l-9-4.5v-11L12 2z" />
    <path d="M8 10l3 3-3 3" />
    <path d="M13 16h3" />
  </svg>
  <h1>VaultPrompt</h1>
  <p><strong>The Enterprise-Grade Prompt Engineering Vault</strong></p>
  <p>
    <img src="https://img.shields.io/badge/Status-Beta-purple?style=for-the-badge" alt="Status" />
    <img src="https://img.shields.io/badge/Stack-Next.js%2015-black?style=for-the-badge&logo=next.js" alt="Next.js" />
    <img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge" alt="License" />
  </p>
</div>

<br />

In high-stakes AI development, **prompts are code**. Yet, they are frequently mismanaged in chaotic spreadsheets, lost in Slack threads, or hardcoded directly into source files without testing. 

**VaultPrompt** is a professional-grade development tool that brings rigor, version control, and multi-model benchmarking to prompt engineering. It provides a secure, **local-first** environment to draft, version, audit, and evaluate prompts across the world's leading LLMs simultaneously—before they ever reach your production codebase.

---

## ✨ Features

### 🔒 Local-First Architecture
Unlike cloud-only tools that capture your confidential prompt data, VaultPrompt operates out of your browser's local storage.
- **Zero-Account Setup**: Clone, boot, and start engineering immediately. No sign-up walls.
- **Absolute Privacy**: Your prompt history, versions, and iterations never leave your machine until you trigger an evaluation via the stateless proxy.
- **Data Portability**: Full JSON export and import capabilities for your entire prompt vault.

### 📊 Multi-Model Parallel Benchmarking
Stop guessing and start measuring. Run a single prompt through a battery of distinct reasoning engines simultaneously:
- Test against `GPT-4o`, `Claude 3.5 Sonnet`, and `Gemini Pro 1.5` with a single click.
- **LLM-as-a-Judge**: Get automated scoring (1-5) and detailed critiques of your prompt's generated output.

### 📈 AI-Powered Readiness Audit
Every prompt you save is subjected to a brutal AI evaluator that scores your prompt across three core pillars:
- **Clarity Core (0-100)**: Is your request fundamentally unambiguous?
- **Constraints (0-100)**: Have you provided negative boundaries to prevent model drift?
- **Output Format (0-100)**: Is the expected response structure clearly defined?
- **Hallucination Risk**: Identifies edge cases where the LLM might fabricate information.

### 💡 Smart Improvement Engine
Hit a roadblock? The "Master Prompt Engineer" model will analyze your prompt instruction and completely rewrite it aligning with established industry best practices, while adhering exactly to your specified persona.

---

## 🏗️ Architecture Stack

VaultPrompt utilizes a decoupled, high-performance architecture:

| Tier | Technologies Used | Responsibility |
| --- | --- | --- |
| **Frontend (The Vault)** | Next.js 16 (App Router), React 19, CSS Modules | Local state persistence (`usePromptManager`), complex UI, and client-side logic. |
| **Backend (Stateless Proxy)** | Node.js, Express, Zod | Securely bridging frontend to upstream LLM APIs. Parses schemas without database tracking. |
| **Integrations** | OpenRouter, Google AI SDK | High-speed multi-model orchestration. |

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/en/) v18 or entirely above.
- Provide API Keys for desired models (e.g. OpenRouter, Google AI Studio).

### 1. Setup the Backend Proxy

The stateless proxy server securely stores credentials and brokers responses.

```bash
# Navigate to the server workspace
cd server

# Install dependencies
npm install

# Initialize your environment variables
cp .env.example .env

# Start the local development server (runs on port 3001)
npm run server:dev
```

> **Note**: Update the `.env` file in the `server` directory with your actual `OPENROUTER_API_KEY` and `GEMINI_API_KEY`.

### 2. Launch the Vault Frontend

In a separate terminal, launch the Next.js application.

```bash
# From the project root
npm install

# Launch Next.js dev server
npm run dev
```

Navigate to [http://localhost:3000](http://localhost:3000) to view the landing page, or hit the **Live Demo** button to enter the Prompt Editor environment.

---

## 🛡️ Security Guarantees

We believe developers should have maximum confidence in their tools:
- **No Persistence**: The Node.js proxy features **no database**. Requests are brokered in-memory entirely statelessly.
- **No Telemetry**: We don't embed tracking logic into the analytics of your prompts.
- **Open Code**: What you see is what runs locally.

---

## 🤝 Contribution Guidelines

Think VaultPrompt could be better? We enthusiastically welcome community enhancements, particularly:
- Expanding support to new local models (e.g., Llama 3 via Ollama).
- Upgrading the `Master Prompt Engineer` evaluation logic.
- Refining frontend accessibility and design systems.

Feel free to open an issue or submit a Pull Request!

<br />
<div align="center">
  <i>Built with precision for those who believe that the prompt is the most important line of code.</i>
</div>
