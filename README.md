# 🛡️ VaultPrompt: The Enterprise-Grade Prompt Engineering Vault

VaultPrompt is a professional-grade development tool designed to bring **rigor, version control, and multi-model benchmarking** to the world of prompt engineering.

In high-stakes AI engineering, prompts are code. Yet, they are often managed haphazardly in spreadsheets or Slack threads. VaultPrompt provides a secure, **local-first environment** where you can draft, version, analyze, and evaluate prompts across the world's leading LLMs simultaneously before you ever integrate them into your production codebase.

---

## 🚀 Strategic Features

### 1. Local-First Version Control
Unlike cloud-only tools, VaultPrompt prioritizes your privacy. Your prompt history, version iterations, and metadata are stored directly in your browser's `localStorage`. 
- **Zero-Account Setup**: Start engineering immediately with no sign-up required.
- **Atomic Commits**: Every "Save" creates a new version with a timestamp and readiness metadata.
- **Version Tagging**: Mark specific iterations as `STABLE`, `EXPERIMENTAL`, or `DEPRECATED`.

### 2. Multi-Model Benchmarking (Parallel Eval)
Stop guessing which model handles your prompt best. VaultPrompt allows you to run a single prompt through a parallel battery of tests:
- **Simultaneous Execution**: Trigger `GPT-4o`, `Claude 3.5 Sonnet`, and `Gemini Pro 1.5` with one click.
- **LLM-as-a-Judge**: A specialized judge model automatically scores each output on a scale of 1-5, providing detailed reasoning for the comparison.
- **Direct Gemini Integration**: Utilizes the Google Generative AI SDK for ultra-low latency testing of Gemini models.

### 3. AI-Powered Readiness Audit
Every prompt undergoes a brutal "Readiness Audit" across three core pillars:
- **Clarity (0-100)**: Is the task unambiguous?
- **Constraints (0-100)**: Are there clear negative constraints and boundaries?
- **Output Format (0-100)**: Is the structure (JSON, Markdown, Tone) explicitly defined?
- **Hallucination Risk**: Automated assessment of how likely the prompt is to cause model drift.

### 4. Smart Improvement Engine
One-click optimization. Our "Master Prompt Engineer" model analyzes your draft and rewrites it to follow industry best practices while strictly preserving your intended persona and tone.

### 5. Portable History (JSON Import/Export)
Maintain full control over your data.
- **Backups**: Export your entire vault as a structured JSON file.
- **Portability**: Import history into different browsers or share prompt collections with team members for local review.

---

## 🏗️ Architecture & Tech Stack

VaultPrompt uses a split-tier architecture to ensure security and performance.

### **Frontend (The Vault)**
- **Framework**: Next.js 15 (App Router) & React 19.
- **State**: Custom hooks (`usePromptManager`) managing `localStorage` persistence.
- **Animations**: Framer Motion & CSS keyframes for high-fidelity loading states and transitions.
- **Styling**: Pure Vanilla CSS Modules for zero-overhead, highly performant UI.

### **Backend (Stateless Proxy)**
- **Platform**: Node.js & Express.
- **Orchestration**: Statelessly proxies requests to LLM providers. It does *not* store your prompts, acting only as a secure bridge.
- **Providers**: 
  - **OpenRouter**: Access to GPT and Claude.
  - **Google Generative AI SDK**: Native Gemini support.
  - **Groq**: High-speed fallback for Llama-based evaluations.

---

## 🔧 Installation & Setup

### Prerequisites
- Node.js (v18+)
- npm or yarn

### 1. Obtain LLM API Keys
You will need at least one of the following:
- [OpenRouter API Key](https://openrouter.ai/keys) (Recommended for GPT/Claude)
- [Google AI Studio Key](https://aistudio.google.com/app/apikey) (For Gemini)

### 2. Configure the Proxy Server
```bash
cd server
npm install
cp .env.example .env
# Add your keys to .env
npm run dev
```

### 3. Launch the Workbench
```bash
# In the root directory
npm install
npm run dev
```
Navigate to `http://localhost:3000/demo` to begin.

---

## 🛡️ Security & Privacy Philosophy

1. **Your Data Stays Yours**: Prompts are stored in *your* browser. The backend proxy only sees the prompt for the duration of the API call.
2. **Stateless Operations**: The server does not utilize a database. Once a response is sent to your browser, it is purged from server memory.
3. **No Tracking**: We do not track prompt content or user behavior.

---

## 🤝 Contributing

VaultPrompt is built for the AI engineering community. We welcome contributions that add new evaluator types, UI enhancements, or support for additional LLM providers.

---

*Built with precision for those who believe that the prompt is the most important line of code in an AI application.*
