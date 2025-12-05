# Necromancer Code Resurrector

A horror-themed legacy code translation tool powered by Google Gemini AI. Transform "dead" legacy code into modern languages through an immersive occult experience.

## Features

- **Code Resurrection** - Translate legacy code (COBOL, Fortran, Assembly, BASIC) to modern languages (TypeScript, Rust, Go, Python)
- **Autopsy Mode** - Analyze and explain legacy code's logic and flaws
- **Curse Removal** - Security fixes, refactoring, and optimization
- **Soul Binding** - Generate documentation and unit tests
- **Full Ritual** - Complete pipeline combining all modes
- **Spirit Medium** - AI chat interface for code Q&A
- **Graveyard** - History of past translations (localStorage)

## Tech Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS
- Google Gemini AI (@google/genai)
- Lucide React icons
- JSZip for multi-file downloads

## Setup

1. Clone the repository

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file with your Gemini API key:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```

4. Start the dev server:
   ```bash
   npm run dev
   ```

## Scripts

```bash
npm run dev      # Start dev server (port 3000)
npm run build    # Production build
npm run preview  # Preview production build
```

## Project Structure

```
├── App.tsx              # Main application component
├── index.tsx            # React entry point
├── index.html           # HTML template with Tailwind config
├── types.ts             # TypeScript enums and interfaces
├── components/          # React UI components
│   ├── AudioVisualizer.tsx
│   ├── Graveyard.tsx
│   ├── PentagramSpinner.tsx
│   ├── SpiritMedium.tsx
│   └── SpookyInput.tsx
├── services/
│   └── geminiService.ts # Gemini AI integration
└── vite.config.ts       # Vite configuration
```

## Theme

Dark horror aesthetic with audio effects, visual glitches, sanity mechanics, and demonic TTS. Blood-red and rot-green color schemes with CRT scanlines and chromatic aberration effects.

## License

MIT
