# Project Structure

```
├── App.tsx              # Main application component (state, logic, UI)
├── index.tsx            # React entry point
├── index.html           # HTML template with Tailwind config & custom CSS
├── types.ts             # TypeScript enums and interfaces
├── components/          # React UI components
│   ├── AudioVisualizer.tsx   # Canvas-based audio visualization
│   ├── Graveyard.tsx         # Translation history sidebar
│   ├── PentagramSpinner.tsx  # Loading spinner component
│   ├── SpiritMedium.tsx      # AI chat modal interface
│   └── SpookyInput.tsx       # Themed input/textarea/select components
├── services/
│   └── geminiService.ts      # Gemini AI integration (translation & chat)
├── vite.config.ts       # Vite configuration
└── tsconfig.json        # TypeScript configuration
```

## Architecture Notes

- **Single-page app** with all state managed in `App.tsx`
- **Services layer** (`services/`) handles external API calls
- **Components** are functional React components with TypeScript interfaces
- **Styling** uses Tailwind utility classes with custom theme colors (blood, rot, pumpkin, void)
- **Custom fonts** loaded via Google Fonts (Nosifer, Creepster, Cinzel, Fira Code)
- **Audio** handled by custom `HorrorAudio` class using Web Audio API
- **localStorage** used for translation history persistence
