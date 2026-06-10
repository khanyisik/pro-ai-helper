# WorkMind AI

A modern, responsive web application that helps professionals automate workplace tasks using AI. Built with a focus on practical AI implementation, strong prompt engineering, and responsible AI usage.

## Features

### 1. AI Chatbot Interface
- Interactive conversational assistant powered by AI
- Real-time streaming responses for brainstorming, planning, and quick answers
- Natural language understanding for workplace queries

### 2. AI Research Assistant
- Summarize topics and articles with adjustable depth (quick, standard, deep)
- Generate structured markdown briefings with key insights and recommendations
- Evidence-aware analysis that calls out uncertainty and avoids fabricated sources
- Actionable recommendations with a "Things to Verify" section

### 3. Smart Email Generator
- Generate professional emails in seconds
- Support for multiple tones: formal, friendly, persuasive, apologetic, concise
- Adjustable length controls (short, medium, long)
- Clean, ready-to-use email formatting with subject lines

### Additional Highlights
- **Responsive Design**: Fully mobile and desktop optimized
- **Modern UI/UX**: Elegant gradient themes, smooth animations, and accessible components
- **Responsible AI Disclaimer**: Clear notices about AI limitations and privacy considerations
- **Dashboard Layout**: Centralized hub with sidebar navigation and feature overview

## Tools Used

| Category | Technology |
|----------|-----------|
| Framework | [TanStack Start](https://tanstack.com/start) (React 19, SSR/SSG, file-based routing) |
| AI Backend | [Lovable AI Gateway](https://docs.lovable.dev) via AI SDK |
| LLM Model | `google/gemini-3-flash-preview` |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) with custom OKLCH design tokens |
| UI Components | [shadcn/ui](https://ui.shadcn.com) (Radix UI primitives) |
| State & Data | [TanStack Query](https://tanstack.com/query) |
| Streaming | [AI SDK](https://sdk.vercel.ai/docs) with `useChat` hook |
| Build Tool | [Vite 7](https://vitejs.dev) |
| Language | TypeScript (strict mode) |
| Package Manager | [Bun](https://bun.sh) |

### Key Libraries
- `ai` — Vercel AI SDK for streaming and text generation
- `@ai-sdk/openai-compatible` — OpenAI-compatible provider for AI Gateway
- `zod` — Schema validation for server function inputs
- `lucide-react` — Icon library
- `@tanstack/react-router` — Type-safe routing
- `@tanstack/react-query` — Server state management

## Setup Instructions

### Prerequisites
- [Bun](https://bun.sh/docs/installation) installed on your machine
- A [Lovable](https://lovable.dev) account with an API key

### 1. Clone the Repository
```bash
git clone <repository-url>
cd <project-directory>
```

### 2. Install Dependencies
```bash
bun install
```

### 3. Configure Environment Variables
Create a `.env` file in the project root:

```env
# Required: Lovable AI Gateway API key
LOVABLE_API_KEY=your_lovable_api_key_here

# Supabase (if using Lovable Cloud features)
SUPABASE_URL=your_supabase_url
SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

> **Note:** The `LOVABLE_API_KEY` is required for all AI features (chat, research, email). You can get one from your Lovable project dashboard.

### 4. Start the Development Server
```bash
bun run dev
```

The app will be available at `http://localhost:3000` (or the port shown in your terminal).

### 5. Build for Production
```bash
bun run build
```

### 6. Run Type Checking
```bash
bun run typecheck
```

## Project Structure

```text
src/
├── components/          # Reusable UI components
│   ├── app-shell.tsx    # Main layout with sidebar
│   ├── markdown.tsx     # Markdown renderer for AI output
│   └── ui/              # shadcn/ui components
├── lib/                 # Utilities and server functions
│   ├── ai-gateway.server.ts  # AI Gateway provider setup
│   ├── ai.functions.ts       # Server functions (research, email)
│   └── utils.ts              # Helper utilities
├── routes/              # File-based routes (TanStack Router)
│   ├── __root.tsx       # Root layout
│   ├── index.tsx        # Dashboard
│   ├── chat.tsx         # AI Chatbot
│   ├── research.tsx     # Research Assistant
│   ├── email.tsx        # Email Generator
│   └── api/
│       └── chat.ts      # Streaming chat API endpoint
├── styles.css           # Global styles & design tokens
└── start.ts             # App entry point
```

## Responsible AI Usage

WorkMind AI generates content using large language models. Please keep the following in mind:

- **Review before acting**: Always verify AI-generated content before sending, sharing, or acting on it.
- **No confidential data**: Don't paste confidential or personal data you wouldn't share with a third-party service.
- **Accuracy**: AI output may contain inaccuracies, outdated information, or biased reasoning.
- **Verification**: The research assistant includes a "Things to Verify" section to help you fact-check.

## License

MIT
