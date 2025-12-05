# Tech Stack

## Core Technologies

- **React 19** with TypeScript
- **Vite** for build tooling and dev server
- **Tailwind CSS** (via CDN with custom config in index.html)

## Key Dependencies

- `@google/genai` - Google Gemini AI SDK for code translation and chat
- `lucide-react` - Icon library
- `react-markdown` - Markdown rendering for AI responses
- `jszip` - Multi-file ZIP downloads for Full Ritual mode

## AI Integration

- Uses Gemini 2.5 Flash model (`gemini-2.5-flash`)
- API key loaded via environment variable `GEMINI_API_KEY`
- Vite exposes it as `process.env.API_KEY`

## Environment Setup

Create `.env.local` with:
```
GEMINI_API_KEY=your_api_key_here
```

## Commands

```bash
npm install      # Install dependencies
npm run dev      # Start dev server (port 3000)
npm run build    # Production build
npm run preview  # Preview production build
```

## TypeScript Config

- Target: ES2022
- Module: ESNext
- JSX: react-jsx
- Path alias: `@/*` maps to project root
