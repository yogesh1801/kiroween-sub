export interface TranslationRequest {
  sourceCode: string;
  sourceLanguage: string;
  targetLanguage: string;
  mode?: TranslationMode;
}

export enum TranslationMode {
  AUTOPSY = 'AUTOPSY',         // Step 2: What does it do?
  RESURRECT = 'RESURRECT',     // Step 3: Modern rewrite
  CURSE_REMOVAL = 'CURSE_REMOVAL', // Step 4: Security + Refactor
  SOUL_BINDING = 'SOUL_BINDING',   // Step 5: Docs + Tests
  FULL_RITUAL = 'FULL_RITUAL',     // All steps combined
}

export interface TranslationResponse {
  translatedCode: string;
  explanation?: string;
}

export enum LoadingState {
  IDLE = 'IDLE',
  SUMMONING = 'SUMMONING', // Loading
  RESURRECTED = 'RESURRECTED', // Success
  CURSED = 'CURSED', // Error
  AUTOPSY_COMPLETED = 'AUTOPSY_COMPLETED',
  EXORCISM_COMPLETED = 'EXORCISM_COMPLETED',
  BINDING_COMPLETED = 'BINDING_COMPLETED',
  RITUAL_COMPLETED = 'RITUAL_COMPLETED',
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  sourceLang: string;
  targetLang: string;
  preview: string;
  mode: TranslationMode;
  sourceCode: string;
  resultCode: string;
}