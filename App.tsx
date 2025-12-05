import React, { useState, useEffect, useRef } from 'react';
import { Skull, Ghost, Flame, BookOpen, Volume2, VolumeX, Activity, Syringe, Brain, Mic, Play, Pause, Square, Upload, History as HistoryIcon, X, ShieldCheck, Scroll, Zap, Download, Layers, MessageSquare, Copy, Check } from 'lucide-react';
import { resurrectCode, createNecromancerChat } from './services/geminiService';
import { LoadingState, TranslationMode, HistoryItem } from './types';
import { Chat, GenerateContentResponse } from "@google/genai";
import PentagramSpinner from './components/PentagramSpinner';
import { SpookyInput, SpookyTextArea, SpookySelect } from './components/SpookyInput';
import AudioVisualizer from './components/AudioVisualizer';
import Graveyard from './components/Graveyard';
import SpiritMedium, { ChatMessage } from './components/SpiritMedium';
import JSZip from 'jszip';

// --- Constants ---
const SOURCE_LANGUAGES = [
  { label: 'Auto-detect', value: 'Auto-detect' },
  { label: 'COBOL', value: 'COBOL' },
  { label: 'Fortran', value: 'Fortran' },
  { label: 'Assembly', value: 'Assembly' },
  { label: 'BASIC', value: 'BASIC' },
];

const TARGET_LANGUAGES = [
  { label: 'TypeScript', value: 'TypeScript' },
  { label: 'Rust', value: 'Rust' },
  { label: 'Go', value: 'Go' },
  { label: 'Python', value: 'Python' },
];

const EXAMPLES = [
  {
    id: 'cobol_finance',
    name: '💀 Financial Ruin (COBOL)',
    sourceLang: 'COBOL',
    targetLang: 'TypeScript',
    code: `       IDENTIFICATION DIVISION.
       PROGRAM-ID. MORTGAGE-CALC.
       DATA DIVISION.
       WORKING-STORAGE SECTION.
       01  LOAN-AMOUNT        PIC 9(9)V99 VALUE 500000.00.
       01  INTEREST-RATE      PIC 9(3)V99 VALUE 0.05.
       01  TERM-YEARS         PIC 9(3) VALUE 30.
       01  MONTHLY-PAYMENT    PIC 9(7)V99.
       PROCEDURE DIVISION.
           COMPUTE MONTHLY-PAYMENT = (LOAN-AMOUNT * INTEREST-RATE / 12) / 
           (1 - (1 + INTEREST-RATE / 12) ** -(TERM-YEARS * 12)).
           DISPLAY "MONTHLY SUFFERING: " MONTHLY-PAYMENT.
           STOP RUN.`
  },
  {
    id: 'fortran_physics',
    name: '⚛️ Atomic Decay (Fortran)',
    sourceLang: 'Fortran',
    targetLang: 'Rust',
    code: `      PROGRAM HALF_LIFE
      IMPLICIT NONE
      REAL :: MASS, DECAY_CONST, TIME, REMAINING
      MASS = 100.0
      DECAY_CONST = 0.693 / 5730.0
      TIME = 10000.0
      REMAINING = MASS * EXP(-DECAY_CONST * TIME)
      PRINT *, 'REMAINING SOUL FRAGMENTS: ', REMAINING
      END PROGRAM HALF_LIFE`
  },
  {
    id: 'basic_loop',
    name: '♾️ Eternal Loop (BASIC)',
    sourceLang: 'BASIC',
    targetLang: 'Python',
    code: `10 PRINT "YOU CANNOT ESCAPE"
20 GOTO 10`
  },
  {
    id: 'asm_hello',
    name: '🧠 Raw Thought (Assembly)',
    sourceLang: 'Assembly',
    targetLang: 'C',
    code: `section .data
    msg db 'Hello from the grave', 0xa
    len equ $ - msg

section .text
    global _start

_start:
    mov edx, len
    mov ecx, msg
    mov ebx, 1
    mov eax, 4
    int 0x80

    mov eax, 1
    int 0x80`
  }
];

// --- Advanced Horror Audio Engine ---
class HorrorAudio {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isMuted: boolean = false;
  private lastHeartbeatTime: number = 0;

  constructor() {}

  init() {
    if (this.ctx) return;
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    this.ctx = new AudioContextClass();
    
    // Master Gain for Mute Control
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = 1.0;
    
    const compressor = this.ctx.createDynamicsCompressor();
    compressor.threshold.value = -24;
    compressor.connect(this.ctx.destination);
    this.masterGain.connect(compressor);

    this.startDarkAmbience();
  }

  setMute(mute: boolean) {
    this.isMuted = mute;
    if (this.masterGain && this.ctx) {
      const t = this.ctx.currentTime;
      this.masterGain.gain.setTargetAtTime(mute ? 0 : 1, t, 0.5);
    }
    // Also cancel speech if muting
    if (mute) {
      window.speechSynthesis.cancel();
    }
  }

  private startDarkAmbience() {
    if (!this.ctx || !this.masterGain) return;
    [55, 58].forEach(freq => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sawtooth';
        osc.frequency.value = freq;
        const filter = this.ctx!.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 120;
        
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain!);
        gain.gain.value = 0.15;
        osc.start();
    });
  }

  playWhisper() {
    if (!this.ctx || !this.masterGain || this.isMuted) return;
    const bufferSize = this.ctx.sampleRate * 1.5;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * 0.5;

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 800 + Math.random() * 500;
    const panner = this.ctx.createStereoPanner();
    panner.pan.value = Math.random() * 2 - 1;
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.3, this.ctx.currentTime + 0.5);
    gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 1.5);

    noise.connect(filter);
    filter.connect(panner);
    panner.connect(gain);
    gain.connect(this.masterGain);
    noise.start();
  }

  playGlitchSound() {
    if (!this.ctx || !this.masterGain || this.isMuted) return;
    const osc = this.ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.value = 100 + Math.random() * 200;
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.3);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.3);
  }
  
  playTypingSound() {
    if (!this.ctx || !this.masterGain || this.isMuted) return;
    const bufferSize = this.ctx.sampleRate * 0.05;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * 0.8;
    
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 800;
    const gain = this.ctx.createGain();
    gain.gain.value = 0.2;
    
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    noise.start();
  }

  playHeartbeat() {
    if (!this.ctx || !this.masterGain || this.isMuted) return;
    if (this.ctx.currentTime - this.lastHeartbeatTime < 0.2) return;
    this.lastHeartbeatTime = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.frequency.setValueAtTime(150, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.5);
    gain.gain.setValueAtTime(0.5, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.5);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.5);
  }

  playScream() {
    if (!this.ctx || !this.masterGain || this.isMuted) return;
    const osc = this.ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.exponentialRampToValueAtTime(1000, this.ctx.currentTime + 0.1);
    const gain = this.ctx.createGain();
    gain.gain.linearRampToValueAtTime(0.3, this.ctx.currentTime + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 1);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 1);
  }

  // --- DEMON TTS ---
  speakDemon(text: string) {
    if (this.isMuted) return;
    window.speechSynthesis.cancel(); // Stop current speech
    
    const cleanText = this.cleanTextForSpeech(text);
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.pitch = 0.01; // Absolute lowest pitch
    utterance.rate = 0.4; // Extremely slow
    utterance.volume = 1;

    // Try to find a fitting voice
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find(v => v.name.includes("Google US English")) || voices[0];
    if (voice) utterance.voice = voice;
    
    // Play dark growl underneath speech
    this.playGrowl(text.length * 100);

    window.speechSynthesis.speak(utterance);
  }

  cleanTextForSpeech(text: string): string {
    // Remove emojis, markdown, special chars that ruin immersion
    return text
      .replace(/[\u{1F600}-\u{1F6FF}]/gu, '') // Emoticons
      .replace(/[\u{1F300}-\u{1F5FF}]/gu, '') // Misc Symbols
      .replace(/[\u{1F680}-\u{1F6FF}]/gu, '') // Transport
      .replace(/[\u{1F900}-\u{1F9FF}]/gu, '') // Supplement
      .replace(/`/g, '') // Backticks
      .replace(/[*{}\[\]#]/g, '') // Markdown
      .replace(/https?:\/\/\S+/g, 'link'); // URLs
  }
  
  pauseSpeaking() {
    if(window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
      window.speechSynthesis.pause();
    }
  }

  resumeSpeaking() {
     if(window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
  }

  stopSpeaking() {
    window.speechSynthesis.cancel();
  }

  playGrowl(durationMs: number) {
    if (!this.ctx || !this.masterGain || this.isMuted) return;
    const bufferSize = this.ctx.sampleRate * 2.0;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * 0.8;

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 100;
    
    // LFO for growl modulation
    const lfo = this.ctx.createOscillator();
    lfo.frequency.value = 8; // fast wobble
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.value = 300;
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.6, this.ctx.currentTime + 1);
    
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    
    lfo.start();
    noise.start();
    
    const stopTime = this.ctx.currentTime + (durationMs / 1000);
    gain.gain.exponentialRampToValueAtTime(0.001, stopTime);
    noise.stop(stopTime);
    lfo.stop(stopTime);
  }

  playFeedMe() {
    this.speakDemon("Feeeed me.");
  }
}

const horrorAudio = new HorrorAudio();

const App: React.FC = () => {
  const [hasEntered, setHasEntered] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [sourceCode, setSourceCode] = useState<string>('');
  const [sourceLang, setSourceLang] = useState<string>('COBOL');
  const [targetLang, setTargetLang] = useState<string>('TypeScript');
  const [resultCode, setResultCode] = useState<string>('');
  const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.IDLE);
  const [ritualStatus, setRitualStatus] = useState<string>('');
  const [glitchTitle, setGlitchTitle] = useState('NECROMANCER');
  
  // Scary states
  const [isScreenShaking, setIsScreenShaking] = useState(false);
  const [isInverted, setIsInverted] = useState(false);
  const [showJumpScare, setShowJumpScare] = useState(false);
  
  // Features
  const [sanity, setSanity] = useState(100);
  const [mode, setMode] = useState<TranslationMode>(TranslationMode.RESURRECT);
  const [activeRitualStep, setActiveRitualStep] = useState<TranslationMode | null>(null);
  
  // Drag & Drop
  const [isDragging, setIsDragging] = useState(false);

  // Seance (Mic)
  const [isListening, setIsListening] = useState(false);
  const [micStream, setMicStream] = useState<MediaStream | null>(null);

  // Graveyard
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showGraveyard, setShowGraveyard] = useState(false);
  
  // Chat / Spirit Medium
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatSessionRef = useRef<Chat | null>(null);

  // Full Ritual Artifacts
  const [autopsyReport, setAutopsyReport] = useState<string | null>(null);
  const [fullRitualData, setFullRitualData] = useState<{
    autopsy: string;
    resurrected: string;
    exorcised: string;
    bound: string;
  } | null>(null);
  
  // Intro Ghosts
  const [specters, setSpecters] = useState<any[]>([]);
  
  // TTS State
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  
  // Copy feedback state
  const [copiedLeft, setCopiedLeft] = useState(false);
  const [copiedRight, setCopiedRight] = useState(false);
  
  // Mouse Tracking for Watcher
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [showWatcher, setShowWatcher] = useState(false);

  // Initialize Ghosts
  useEffect(() => {
    // Generate many specters immediately with negative delay for instant population
    const newSpecters = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      width: 50 + Math.random() * 300, // Size via width/height
      height: 100 + Math.random() * 400,
      delay: Math.random() * -20, // Negative delay to start mid-animation
      duration: 10 + Math.random() * 20, // Slower, haunting duration
      opacity: 0.1 + Math.random() * 0.4, // Subtler
    }));
    setSpecters(newSpecters);
  }, []);

  // Load History
  useEffect(() => {
    const saved = localStorage.getItem('necromancer_graveyard');
    if (saved) setHistory(JSON.parse(saved));
    
    // Watcher Logic
    const watcherInterval = setInterval(() => {
      if(Math.random() > 0.95) {
        setShowWatcher(true);
        setTimeout(() => setShowWatcher(false), 2000);
      }
    }, 5000);
    
    return () => clearInterval(watcherInterval);
  }, []);
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
       setMousePos({ x: e.clientX, y: e.clientY });
       if (showWatcher) {
         // If mouse gets close to watcher, it vanishes
         // Hardcoded watcher pos for now or random
       }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [showWatcher]);

  const addToGraveyard = (result: string, modeUsed: TranslationMode) => {
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      sourceLang,
      targetLang,
      mode: modeUsed,
      sourceCode: sourceCode.slice(0, 500), // Trim for storage
      resultCode: result,
      preview: sourceCode.slice(0, 50) + "..."
    };
    const newHistory = [newItem, ...history];
    setHistory(newHistory);
    localStorage.setItem('necromancer_graveyard', JSON.stringify(newHistory));
  };

  const clearGraveyard = () => {
    setHistory([]);
    localStorage.removeItem('necromancer_graveyard');
    horrorAudio.playScream();
  };

  // Intro Handler
  const enterSite = () => {
    horrorAudio.init();
    setHasEntered(true);
    triggerRandomScare();
  };

  const toggleMute = () => {
    const newState = !isMuted;
    setIsMuted(newState);
    horrorAudio.setMute(newState);
  };

  const restoreSanity = () => {
    setSanity(100);
  };

  // Sanity Decay - SLOWED DOWN
  useEffect(() => {
    if (!hasEntered) return;
    const decayInterval = setInterval(() => {
      // Much slower decay
      setSanity(prev => Math.max(20, prev - 1));
    }, 10000); // 10 seconds per 1% decay
    return () => clearInterval(decayInterval);
  }, [hasEntered]);
  
  // Subliminal Flash - REDUCED FREQUENCY
  useEffect(() => {
    if (!hasEntered) return;
    const subInterval = setInterval(() => {
      if (sanity < 30 && Math.random() > 0.95) {
        // Flash something
        const flashEl = document.createElement('div');
        flashEl.className = Math.random() > 0.5 ? 'subliminal-text' : 'subliminal-img';
        flashEl.innerText = Math.random() > 0.5 ? 'RUN' : 'BEHIND YOU';
        document.body.appendChild(flashEl);
        setTimeout(() => flashEl.remove(), 100);
      }
    }, 5000);
    return () => clearInterval(subInterval);
  }, [hasEntered, sanity]);

  // Audio FX loop
  useEffect(() => {
    if (!hasEntered) return;
    const beatIntervalTime = Math.max(2000, sanity * 50); // Slower heartbeat
    const heartbeatTimer = setTimeout(() => {
       if (Math.random() > 0.6) horrorAudio.playHeartbeat();
    }, beatIntervalTime);

    return () => clearTimeout(heartbeatTimer);
  }, [hasEntered, sanity]);

  const triggerRandomScare = () => {
    const scareType = Math.floor(Math.random() * 5);
    if (scareType === 0) {
      horrorAudio.playGlitchSound();
      setIsScreenShaking(true);
      setTimeout(() => setIsScreenShaking(false), 300);
    } else if (scareType === 2) {
      horrorAudio.playWhisper();
    }
  };

  const handleInputShake = () => {
    // setIsScreenShaking(true); // Disable input shake for comfort
    // setTimeout(() => setIsScreenShaking(false), 50);
    if (Math.random() > 0.7) horrorAudio.playTypingSound();
    restoreSanity();
  };

  const loadExample = (id: string) => {
    const example = EXAMPLES.find(e => e.id === id);
    if (example) {
      setSourceLang(example.sourceLang);
      setTargetLang(example.targetLang);
      setSourceCode(example.code);
      handleInputShake();
      horrorAudio.playGlitchSound();
    }
  };

  // --- DOWNLOAD LOGIC ---
  const downloadFile = (filename: string, content: string) => {
    const element = document.createElement('a');
    const file = new Blob([content], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleDownload = async () => {
    if (!resultCode) return;
    
    // Determine extension
    const getExt = (lang: string) => {
        const l = lang.toLowerCase();
        if (l === 'python') return 'py';
        if (l === 'typescript') return 'ts';
        if (l === 'javascript') return 'js';
        if (l === 'rust') return 'rs';
        if (l === 'go') return 'go';
        if (l === 'c') return 'c';
        if (l === 'c++') return 'cpp';
        if (l === 'java') return 'java';
        return 'txt';
    };
    const ext = getExt(targetLang);

    if (mode === TranslationMode.FULL_RITUAL && fullRitualData) {
        try {
            const zip = new JSZip();
            const folderName = "necromancer_ritual_output";
            const folder = zip.folder(folderName);
            
            if (folder) {
                if (fullRitualData.autopsy) folder.file("1_autopsy_report.md", fullRitualData.autopsy);
                if (fullRitualData.resurrected) folder.file(`2_resurrected.${ext}`, fullRitualData.resurrected);
                if (fullRitualData.exorcised) folder.file(`3_purified.${ext}`, fullRitualData.exorcised);
                if (fullRitualData.bound) folder.file(`4_bound_soul.${ext}`, fullRitualData.bound);
                
                folder.file("README.txt", "The ritual is complete. These are the artifacts recovered from the void.");

                const content = await zip.generateAsync({ type: "blob" });
                const url = URL.createObjectURL(content);
                const link = document.createElement('a');
                link.href = url;
                link.download = "ritual_artifacts.zip";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
            }
        } catch (e) {
            console.error("Zip failed", e);
            horrorAudio.playScream();
        }
    } else {
        // Download Code
        downloadFile(`resurrected_code.${ext}`, resultCode);
        
        // Download Autopsy if exists
        if (autopsyReport) {
          setTimeout(() => {
             downloadFile('autopsy_report.txt', autopsyReport);
          }, 500);
        }
    }
    
    horrorAudio.playGlitchSound();
  };

  // --- CHAT LOGIC ---
  const handleToggleChat = () => {
    const newOpen = !showChat;
    setShowChat(newOpen);
    
    if (newOpen) {
      horrorAudio.playWhisper();
      if (!chatSessionRef.current) {
        chatSessionRef.current = createNecromancerChat(sourceCode || "No code provided.");
      }
    }
  };

  const handleSendMessage = async (text: string) => {
    // Optimistic UI
    const newUserMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text };
    setChatMessages(prev => [...prev, newUserMsg]);
    setIsChatLoading(true);
    horrorAudio.playTypingSound();

    try {
      if (!chatSessionRef.current) {
        chatSessionRef.current = createNecromancerChat(sourceCode || "No code provided.");
      }
      
      const response: GenerateContentResponse = await chatSessionRef.current.sendMessage({ message: text });
      const responseText = response.text || "...";
      
      const newModelMsg: ChatMessage = { id: (Date.now() + 1).toString(), role: 'model', text: responseText };
      setChatMessages(prev => [...prev, newModelMsg]);
      horrorAudio.playWhisper();
    } catch (e) {
      console.error(e);
      const errorMsg: ChatMessage = { id: (Date.now() + 1).toString(), role: 'model', text: "The spirits are silent... (Error)" };
      setChatMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // --- RITUAL LOGIC ---
  const performStep = async (stepMode: TranslationMode, inputCode: string, langIn: string, langOut: string) => {
     return await resurrectCode({
        sourceCode: inputCode,
        sourceLanguage: langIn,
        targetLanguage: langOut,
        mode: stepMode,
      });
  };

  const handleResurrect = async () => {
    if (!sourceCode.trim()) return;
    restoreSanity();
    setLoadingState(LoadingState.SUMMONING);
    setResultCode('');
    setAutopsyReport(null);
    setFullRitualData(null);
    setActiveRitualStep(null);
    horrorAudio.playScream();
    setIsScreenShaking(true);
    setRitualStatus('');

    try {
      if (mode === TranslationMode.FULL_RITUAL) {
        // --- STEP 1: AUTOPSY ---
        setActiveRitualStep(TranslationMode.AUTOPSY);
        setRitualStatus('AUTOPSYING CORPSE...');
        const autopsy = await performStep(TranslationMode.AUTOPSY, sourceCode, sourceLang, targetLang);
        setAutopsyReport(autopsy);
        
        // --- STEP 2: RESURRECT ---
        setActiveRitualStep(TranslationMode.RESURRECT);
        setRitualStatus('RESURRECTING SPIRIT...');
        const resurrected = await performStep(TranslationMode.RESURRECT, sourceCode, sourceLang, targetLang);
        
        // --- STEP 3: EXORCISE ---
        setActiveRitualStep(TranslationMode.CURSE_REMOVAL);
        setRitualStatus('PURGING CURSES...');
        const exorcised = await performStep(TranslationMode.CURSE_REMOVAL, resurrected, targetLang, targetLang);
        
        // --- STEP 4: BIND SOUL ---
        setActiveRitualStep(TranslationMode.SOUL_BINDING);
        setRitualStatus('BINDING SOUL...');
        const bound = await performStep(TranslationMode.SOUL_BINDING, exorcised, targetLang, targetLang);
        
        setActiveRitualStep(null);
        setFullRitualData({
             autopsy,
             resurrected,
             exorcised,
             bound
        });
        setResultCode(bound);
        setLoadingState(LoadingState.RITUAL_COMPLETED);
        addToGraveyard(bound, TranslationMode.FULL_RITUAL);
        
      } else {
        // Single Mode
        // Set specific status message based on mode
        switch (mode) {
          case TranslationMode.AUTOPSY: setRitualStatus('AUTOPSYING CORPSE...'); break;
          case TranslationMode.CURSE_REMOVAL: setRitualStatus('PURGING CURSES...'); break;
          case TranslationMode.SOUL_BINDING: setRitualStatus('BINDING SOUL...'); break;
          default: setRitualStatus('RESURRECTING...');
        }
        
        const result = await performStep(mode, sourceCode, sourceLang, targetLang);
        setResultCode(result);
        
        let doneState = LoadingState.RESURRECTED;
        if (mode === TranslationMode.AUTOPSY) doneState = LoadingState.AUTOPSY_COMPLETED;
        if (mode === TranslationMode.CURSE_REMOVAL) doneState = LoadingState.EXORCISM_COMPLETED;
        if (mode === TranslationMode.SOUL_BINDING) doneState = LoadingState.BINDING_COMPLETED;
        
        setLoadingState(doneState);
        addToGraveyard(result, mode);
      }

    } catch (error) {
      console.error(error);
      setResultCode("// THE RITUAL FAILED. THE DEAD REFUSE TO SPEAK.");
      setLoadingState(LoadingState.CURSED);
      horrorAudio.playScream();
    } finally {
      setIsScreenShaking(false);
      setRitualStatus('');
      setActiveRitualStep(null);
    }
  };

  // --- DRAG AND DROP ---
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!isDragging) {
      setIsDragging(true);
      horrorAudio.playFeedMe();
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    horrorAudio.playGlitchSound(); // Crunch sound
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setSourceCode(event.target.result as string);
          restoreSanity();
        }
      };
      reader.readAsText(file);
    }
  };
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setSourceCode(event.target.result as string);
          restoreSanity();
          horrorAudio.playGlitchSound();
        }
      };
      reader.readAsText(file);
    }
  }

  // --- SEANCE (Microphone) ---
  const toggleListening = async () => {
    if (isListening) {
      if (micStream) {
        micStream.getTracks().forEach(track => track.stop());
        setMicStream(null);
      }
      setIsListening(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setMicStream(stream);
      setIsListening(true);
      
      // Basic recognition setup
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setSourceCode(prev => prev + " " + transcript);
        };
        recognition.start();
      }
    } catch (err) {
      console.error("Microphone denied", err);
    }
  };
  
  // TTS Controls
  const handlePlayTTS = () => {
    if (!resultCode) return;
    if (isPaused) {
      horrorAudio.resumeSpeaking();
      setIsPaused(false);
      setIsSpeaking(true);
    } else {
      horrorAudio.speakDemon(resultCode.slice(0, 500));
      setIsSpeaking(true);
    }
  };
  
  const handlePauseTTS = () => {
    horrorAudio.pauseSpeaking();
    setIsPaused(true);
    setIsSpeaking(false);
  };
  
  const handleStopTTS = () => {
    horrorAudio.stopSpeaking();
    setIsPaused(false);
    setIsSpeaking(false);
  };

  // REDUCED SANITY EFFECTS
  const getSanityStyles = () => {
    if (sanity > 80) return '';
    if (sanity > 40) return 'blur-[0.5px]'; // Subtle blur only
    return 'blur-[1px] sepia-[0.3]'; // Slightly more blur and sepia, no drift, no invert
  };
  
  const getThemeColor = (m: TranslationMode) => {
    switch (m) {
      case TranslationMode.AUTOPSY: return 'gray';
      case TranslationMode.CURSE_REMOVAL: return 'cyan';
      case TranslationMode.SOUL_BINDING: return 'purple';
      case TranslationMode.FULL_RITUAL: return 'blood';
      case TranslationMode.RESURRECT: 
      default: return 'green'; // rot
    }
  };
  
  const getThemeClasses = (m: TranslationMode) => {
    switch (m) {
      case TranslationMode.AUTOPSY: return {
        text: 'text-gray-400',
        border: 'border-gray-600',
        bg: 'bg-gray-900',
        glow: 'shadow-[0_0_20px_#9ca3af]'
      };
      case TranslationMode.CURSE_REMOVAL: return {
        text: 'text-cyan-400',
        border: 'border-cyan-600',
        bg: 'bg-cyan-900',
        glow: 'shadow-[0_0_20px_#22d3ee]'
      };
      case TranslationMode.SOUL_BINDING: return {
        text: 'text-purple-400',
        border: 'border-purple-600',
        bg: 'bg-purple-900',
        glow: 'shadow-[0_0_20px_#c084fc]'
      };
      case TranslationMode.FULL_RITUAL: return {
        text: 'text-blood-500',
        border: 'border-blood-600',
        bg: 'bg-blood-900',
        glow: 'shadow-[0_0_20px_#ef4444]'
      };
      case TranslationMode.RESURRECT: 
      default: return {
        text: 'text-rot-500',
        border: 'border-rot-900',
        bg: 'bg-rot-950',
        glow: 'shadow-[0_0_20px_#22c55e]'
      };
    }
  }

  // Calculate themes
  const displayMode = activeRitualStep || mode;
  const theme = getThemeClasses(displayMode);
  const controlsTheme = getThemeClasses(mode);

  if (!hasEntered) {
    return (
      <div className="fixed inset-0 bg-void flex items-center justify-center z-[100] cursor-pointer overflow-hidden bg-[radial-gradient(circle_at_center,_#200000_0%,_#000000_70%)]" onClick={enterSite}>
         {specters.map(s => (
            <div 
              key={s.id} 
              className="absolute pointer-events-none bg-blood-900/10 rounded-full blur-3xl animate-pulse"
              style={{
                left: `${s.left}%`,
                top: `${s.top}%`,
                width: `${s.width}px`,
                height: `${s.height}px`,
                animationDuration: `${s.duration}s`,
                animationDelay: `${s.delay}s`,
                opacity: s.opacity,
              }}
            ></div>
         ))}
         
         <div className="text-center relative z-10 animate-pulse-slow mix-blend-screen flex flex-col items-center justify-center">
           <h1 className="text-6xl md:text-9xl font-horror text-blood-600 mb-8 tracking-[0.5em] animate-glitch">WARNING</h1>
           <p className="text-blood-800 font-ritual text-xl tracking-widest border border-blood-900 p-4 hover:bg-blood-950 transition-colors bg-black/50 backdrop-blur-sm">
             CLICK TO ENTER THE VOID
           </p>
         </div>
      </div>
    );
  }

  return (
    <div 
      className={`
        min-h-screen bg-void font-sans relative overflow-x-hidden transition-all duration-1000
        cursor-crosshair
        ${isScreenShaking ? 'animate-shake' : ''} 
        ${isInverted ? 'invert' : ''}
        ${getSanityStyles()}
      `}
      onMouseMove={(e) => setMousePos({ x: e.clientX, y: e.clientY })}
    >
      
      {showJumpScare && (
        <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center pointer-events-none">
          <img src="https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExcjR5Ym50bXJ6c3l5bnZ5bnZ5bnZ5bnZ5bnZ5bnZ5bnZ5bnZ5bSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/13CoXDiaCcCzdP/giphy.gif" alt="SCREAM" className="w-full h-full object-cover opacity-50" />
        </div>
      )}
      
      {/* The Watcher Eyes */}
      {showWatcher && (
        <div 
          className="watcher-eyes" 
          style={{ 
             top: '20%', 
             left: '80%',
             transform: `rotate(${Math.atan2(mousePos.y - (window.innerHeight * 0.2), mousePos.x - (window.innerWidth * 0.8)) * 180 / Math.PI}deg)`
          }}
        ></div>
      )}

      {/* Global FX */}
      <div className="scanlines"></div>
      <div className="noise"></div>
      <div className="blood-drip"></div>
      <div className="vignette fixed inset-0 bg-[radial-gradient(circle,transparent_0%,#000000_90%)] z-30 pointer-events-none"></div>
      
      {/* HUD: Sanity & Controls */}
      <div className="fixed top-6 left-6 z-[60] flex items-center gap-4">
        <div className="relative group cursor-help" title="Sanity Level">
          <Brain className={`w-12 h-12 ${sanity < 30 ? 'text-gray-600 animate-pulse' : 'text-blood-600'}`} />
          <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-black">{sanity}%</div>
        </div>
        <div className="flex flex-col">
          <span className="text-blood-600 font-horror tracking-widest text-sm">SANITY</span>
          <div className="w-48 h-2 bg-blood-950 border border-blood-900 overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${sanity < 30 ? 'bg-gray-500' : 'bg-blood-600'}`} 
              style={{ width: `${sanity}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="fixed top-6 right-6 z-[60] flex gap-4">
        <button onClick={() => setShowGraveyard(true)} className="text-blood-600 hover:text-blood-400 p-2 border border-blood-900 bg-black/50 rounded-full" title="Graveyard">
          <HistoryIcon className="w-6 h-6" />
        </button>
        <button onClick={toggleMute} className="text-blood-600 hover:text-blood-400 p-2 border border-blood-900 bg-black/50 rounded-full">
          {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6 animate-pulse" />}
        </button>
      </div>

      <SpiritMedium 
        isOpen={showChat} 
        onClose={() => setShowChat(false)} 
        messages={chatMessages}
        onSendMessage={handleSendMessage}
        isLoading={isChatLoading}
      />

      {/* SPOOKY FLOATING CHAT BUTTON (SOUL THEME - RED) */}
      {!showChat && (
        <button 
          onClick={handleToggleChat}
          className="fixed bottom-8 right-8 z-[70] w-20 h-20 rounded-full bg-black border-2 border-blood-600 shadow-[0_0_30px_#dc2626] flex items-center justify-center hover:scale-110 transition-transform duration-300 group animate-pulse-slow"
          title="COMMUNE WITH THE DEAD"
        >
          <div className="absolute inset-0 bg-blood-600/20 rounded-full animate-ping"></div>
          <div className="relative z-10">
            <Ghost className="w-10 h-10 text-blood-400 group-hover:text-blood-200" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-blood-200 rounded-full animate-bounce"></div>
          </div>
        </button>
      )}

      <Graveyard 
        history={history} 
        isOpen={showGraveyard} 
        onClose={() => setShowGraveyard(false)} 
        onClear={clearGraveyard}
        onResurrect={(item) => {
          setSourceCode(item.sourceCode);
          setResultCode(item.resultCode);
          setSourceLang(item.sourceLang);
          setTargetLang(item.targetLang);
          setMode(item.mode);
          setShowGraveyard(false);
          horrorAudio.playGlitchSound();
        }}
      />

      <div className="relative z-40 max-w-[1600px] mx-auto px-6 py-10 min-h-screen flex flex-col">
        
        {/* Header */}
        <header className="flex flex-col items-center justify-center mb-16 relative">
          <h1 className="text-6xl md:text-9xl font-horror text-blood-600 tracking-widest chromatic-aberration select-none hover:animate-glitch cursor-default">
            {glitchTitle}
          </h1>
          <p className="text-blood-800 font-ritual tracking-[0.6em] uppercase animate-pulse mt-4">
            Resurrect Your Dead Code
          </p>
        </header>

        {/* The Altar */}
        <main className="flex-grow grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-12 items-start relative">
          
          {/* LEFT PANEL: DEAD CODE */}
          <section 
            className={`flex flex-col h-[650px] relative group transition-transform duration-300 ${isDragging ? 'scale-105 shadow-[0_0_100px_#ff0000] border-2 border-blood-500' : 'hover:scale-[1.01]'}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {isDragging && (
              <div className="absolute inset-0 z-50 bg-blood-900/80 flex items-center justify-center backdrop-blur-sm animate-pulse">
                <h3 className="font-horror text-6xl text-black drop-shadow-[0_0_10px_#fff]">FEED ME</h3>
              </div>
            )}

            <div className="relative h-full border-2 border-blood-700 bg-black/95 rounded-sm flex flex-col shadow-[0_0_60px_rgba(220,38,38,0.3)]">
              <div className="flex items-center justify-between p-4 border-b border-blood-900 bg-blood-950/20">
                <div className="flex items-center gap-3">
                  <Skull className="w-6 h-6 text-blood-700 animate-[pulse_3s_infinite]" />
                  <h2 className="text-2xl font-metal tracking-widest text-blood-600">DEAD CODE</h2>
                </div>
                <div className="flex gap-2 items-center">
                    <label 
                      className="p-2 rounded-full border border-blood-900 text-blood-700 hover:text-blood-500 hover:border-blood-500 cursor-pointer transition-all"
                      title="Upload File"
                      onClick={() => horrorAudio.playFeedMe()}
                    >
                      <Upload size={16} />
                      <input type="file" className="hidden" onChange={handleFileUpload} />
                    </label>
                    <button 
                      onClick={toggleListening}
                      className={`p-2 rounded-full border transition-all ${isListening ? 'bg-blood-600 border-white animate-pulse' : 'border-blood-900 text-blood-700 hover:text-blood-500'}`}
                      title="Chant the Code"
                    >
                      <Mic size={16} />
                    </button>
                </div>
              </div>

              <div className="flex-grow p-6 flex flex-col gap-6 font-code bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] relative overflow-hidden">
                <AudioVisualizer stream={micStream} isActive={isListening} />
                
                <div className="grid grid-cols-2 gap-4 relative z-10">
                  <div className="space-y-2">
                    <label className="text-blood-500 text-xs font-ritual tracking-widest uppercase flex items-center gap-2">
                      <span className="w-2 h-2 bg-blood-600 rotate-45"></span> Source
                    </label>
                    <div className="border border-blood-600 p-2 bg-blood-950/40">
                       <SpookySelect 
                          options={SOURCE_LANGUAGES}
                          value={sourceLang}
                          onChange={(e) => { setSourceLang(e.target.value); handleInputShake(); }}
                          variant="blood"
                       />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-blood-500 text-xs font-ritual tracking-widest uppercase flex items-center gap-2">
                      <BookOpen className="w-3 h-3" /> Grimoire
                    </label>
                    <div className="border border-blood-600 p-2 bg-blood-950/40">
                       <SpookySelect 
                         options={EXAMPLES.map(ex => ({ label: ex.name, value: ex.id }))}
                         onChange={(e) => loadExample(e.target.value)}
                         placeholder="-- Summon --"
                         variant="blood"
                       />
                    </div>
                  </div>
                </div>

                <div className="space-y-2 flex-grow flex flex-col z-10">
                   <div className="flex-grow border border-blood-600 p-1 bg-blood-950/40 relative transition-colors">
                    <SpookyTextArea
                      value={sourceCode}
                      onChange={(e) => { setSourceCode(e.target.value); handleInputShake(); }}
                      placeholder="DRAG A FILE HERE OR PASTE THE ROTTING CARCASS..."
                      variant="blood"
                    />
                    {sourceCode && (
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(sourceCode);
                          setCopiedLeft(true);
                          setTimeout(() => setCopiedLeft(false), 2000);
                        }}
                        className="absolute top-3 right-3 p-2 text-blood-500 hover:text-blood-300 bg-blood-950/80 rounded border border-blood-700 hover:border-blood-500 hover:bg-blood-900/50 transition-all shadow-lg z-20"
                        title="Copy to clipboard"
                      >
                        {copiedLeft ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                      </button>
                    )}
                  </div>
                </div>

              </div>
              <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-blood-700"></div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-blood-700"></div>
            </div>
          </section>

          {/* CENTER: CONTROLS */}
          <div className="flex flex-col items-center justify-center h-full gap-8 z-50 pt-10 lg:pt-0">
             
             {/* RITUAL MODE SELECTOR */}
             <div className="grid grid-cols-2 gap-4">
               {[
                 { m: TranslationMode.AUTOPSY, icon: Skull, label: 'AUTOPSY' },
                 { m: TranslationMode.RESURRECT, icon: Ghost, label: 'RESURRECT' },
                 { m: TranslationMode.CURSE_REMOVAL, icon: ShieldCheck, label: 'EXORCISE' },
                 { m: TranslationMode.SOUL_BINDING, icon: Scroll, label: 'BIND SOUL' },
               ].map((item) => {
                  // Determine if this specific button should be lit up
                  // It lights up if: 
                  // 1. It is the active step in a Full Ritual
                  // 2. OR no full ritual step is running, but this mode is selected manually
                  const isButtonActive = activeRitualStep === item.m || (mode === item.m && activeRitualStep === null);
                  
                  return (
                   <button
                     key={item.m}
                     onClick={() => { setMode(item.m); horrorAudio.playGlitchSound(); }}
                     className={`
                       flex flex-col items-center justify-center p-3 w-20 h-20 rounded border-2 transition-all duration-300
                       ${isButtonActive ? `border-${getThemeColor(item.m)}-500 bg-${getThemeColor(item.m)}-900/30 scale-110 shadow-[0_0_15px_${item.m === TranslationMode.AUTOPSY ? '#9ca3af' : item.m === TranslationMode.CURSE_REMOVAL ? '#22d3ee' : item.m === TranslationMode.SOUL_BINDING ? '#c084fc' : '#22c55e'}]` : 'border-gray-800 bg-black hover:border-gray-600'}
                     `}
                     title={item.label}
                   >
                     <item.icon className={`w-8 h-8 mb-1 ${isButtonActive ? `text-${getThemeColor(item.m)}-400` : 'text-gray-600'}`} />
                     <span className={`text-[8px] font-ritual tracking-widest ${isButtonActive ? 'text-white' : 'text-gray-600'}`}>{item.label}</span>
                   </button>
                 );
               })}
             </div>
             
             {/* FULL RITUAL BUTTON */}
             <button
               onClick={() => { setMode(TranslationMode.FULL_RITUAL); horrorAudio.playGlitchSound(); }}
               className={`
                 w-full flex items-center justify-center gap-2 p-3 rounded border-2 transition-all duration-300
                 ${mode === TranslationMode.FULL_RITUAL 
                    ? 'border-blood-500 bg-blood-900/30 shadow-[0_0_20px_#ef4444] scale-105' 
                    : 'border-gray-800 bg-black hover:border-blood-800 text-gray-500 hover:text-blood-500'}
               `}
             >
               <Layers size={18} />
               <span className="text-xs font-ritual tracking-widest font-bold">FULL RITUAL</span>
             </button>

            <button
                onClick={handleResurrect}
                disabled={loadingState === LoadingState.SUMMONING}
                className={`
                  relative w-32 h-32 rounded-full flex items-center justify-center
                  border-[4px] transition-all duration-100 ease-out
                  group
                  ${loadingState === LoadingState.SUMMONING 
                    ? `border-${getThemeColor(displayMode)}-500 bg-black animate-[spin_0.5s_linear_infinite] shadow-[0_0_100px_${displayMode === TranslationMode.AUTOPSY ? '#9ca3af' : displayMode === TranslationMode.CURSE_REMOVAL ? '#22d3ee' : displayMode === TranslationMode.SOUL_BINDING ? '#c084fc' : '#ff0000'}]` 
                    : `${theme.border} bg-black hover:scale-110 hover:${theme.glow} hover:border-white`
                  }
                `}
              >
                <div className={`relative z-10 transition-transform duration-100 ${loadingState === LoadingState.SUMMONING ? 'scale-0' : 'group-hover:rotate-180'}`}>
                  {loadingState === LoadingState.SUMMONING ? (
                    <Flame className={`w-12 h-12 text-${getThemeColor(displayMode)}-500`} />
                  ) : (
                    <div className={theme.text}>
                      {displayMode === TranslationMode.AUTOPSY && <Skull size={48} />}
                      {displayMode === TranslationMode.RESURRECT && <Ghost size={48} />}
                      {displayMode === TranslationMode.CURSE_REMOVAL && <ShieldCheck size={48} />}
                      {displayMode === TranslationMode.SOUL_BINDING && <Zap size={48} />}
                      {displayMode === TranslationMode.FULL_RITUAL && <Layers size={48} />}
                    </div>
                  )}
                </div>
              </button>
          </div>

          {/* RIGHT PANEL: RESULT */}
          <section className="flex flex-col h-[650px] relative group hover:scale-[1.01] transition-transform duration-300">
            <div className={`absolute -inset-1 bg-gradient-to-b from-${getThemeColor(displayMode)}-900 to-black blur-md opacity-50 group-hover:opacity-100 transition duration-500`}></div>
            
            <div className={`relative h-full border ${theme.border} bg-black/95 rounded-sm flex flex-col shadow-[0_0_50px_rgba(20,83,45,0.1)]`}>
              <div className={`flex items-center justify-between p-4 border-b ${theme.border} ${theme.bg}`}>
                <div className="flex items-center gap-3">
                  {displayMode === TranslationMode.AUTOPSY && <Skull className={`w-6 h-6 ${theme.text}`} />}
                  {displayMode === TranslationMode.RESURRECT && <Ghost className={`w-6 h-6 ${theme.text}`} />}
                  {displayMode === TranslationMode.CURSE_REMOVAL && <ShieldCheck className={`w-6 h-6 ${theme.text}`} />}
                  {displayMode === TranslationMode.SOUL_BINDING && <Scroll className={`w-6 h-6 ${theme.text}`} />}
                  {displayMode === TranslationMode.FULL_RITUAL && <Layers className={`w-6 h-6 ${theme.text}`} />}
                  
                  <h2 className={`text-2xl font-metal tracking-widest ${theme.text}`}>
                    {displayMode === TranslationMode.AUTOPSY ? 'AUTOPSY REPORT' : 
                     displayMode === TranslationMode.CURSE_REMOVAL ? 'PURIFIED CODE' :
                     displayMode === TranslationMode.SOUL_BINDING ? 'BOUND SOUL' : 
                     displayMode === TranslationMode.FULL_RITUAL ? 'GRIMOIRE' : 'ALIVE CODE'}
                  </h2>
                </div>
                {resultCode && (
                   <div className="flex gap-2">
                     {isSpeaking && !isPaused ? (
                        <button onClick={handlePauseTTS} className={`p-1 ${theme.text} hover:text-white rounded-full`} title="Pause">
                          <Pause size={20} />
                        </button>
                     ) : (
                        <button onClick={handlePlayTTS} className={`p-1 ${theme.text} hover:text-white rounded-full`} title="Speak">
                          <Play size={20} />
                        </button>
                     )}
                     <button onClick={handleStopTTS} className={`p-1 ${theme.text} hover:text-white rounded-full`} title="Stop">
                       <Square size={20} />
                     </button>
                   </div>
                )}
              </div>

              <div className="flex-grow p-6 flex flex-col gap-6 font-code bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] relative overflow-hidden">
                {(displayMode === TranslationMode.RESURRECT || displayMode === TranslationMode.FULL_RITUAL || displayMode === TranslationMode.CURSE_REMOVAL || displayMode === TranslationMode.SOUL_BINDING) && (
                  <div className="space-y-2 z-10">
                    <label className={`text-${getThemeColor(displayMode)}-500 text-xs font-ritual tracking-widest uppercase flex items-center gap-2`}>
                      <span className={`w-2 h-2 bg-${getThemeColor(displayMode)}-600 rotate-45`}></span> Target
                    </label>
                    <div className={`border border-${getThemeColor(displayMode)}-900/40 p-2 bg-black/80`}>
                      <SpookySelect 
                          options={TARGET_LANGUAGES}
                          value={targetLang}
                          onChange={(e) => { setTargetLang(e.target.value); handleInputShake(); }}
                          variant={displayMode === TranslationMode.AUTOPSY || displayMode === TranslationMode.FULL_RITUAL ? 'blood' : 'rot'}
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2 flex-grow flex flex-col relative z-10">
                  <div className={`flex-grow border ${theme.border} p-1 bg-black/80 relative overflow-hidden`}>
                    {loadingState === LoadingState.SUMMONING && (
                      <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/90 backdrop-blur-sm">
                        <PentagramSpinner label={ritualStatus} />
                      </div>
                    )}
                    <SpookyTextArea
                      value={resultCode}
                      readOnly
                      placeholder={
                        displayMode === TranslationMode.AUTOPSY ? "PREPARING SCALPEL..." : 
                        displayMode === TranslationMode.CURSE_REMOVAL ? "PREPARING HOLY WATER..." :
                        displayMode === TranslationMode.SOUL_BINDING ? "SCRIBING SCROLLS..." :
                        displayMode === TranslationMode.FULL_RITUAL ? "AWAITING THE GRAND RITUAL..." :
                        "WAITING FOR THE SPIRITS..."
                      }
                      variant={displayMode === TranslationMode.AUTOPSY ? 'blood' : 'rot'}
                    />
                    {resultCode && (
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(resultCode);
                          setCopiedRight(true);
                          setTimeout(() => setCopiedRight(false), 2000);
                        }}
                        className={`absolute top-3 right-3 p-2 ${displayMode === TranslationMode.AUTOPSY ? 'text-blood-500 hover:text-blood-300 bg-blood-950/80 border-blood-700 hover:border-blood-500 hover:bg-blood-900/50' : 'text-rot-500 hover:text-rot-300 bg-rot-950/80 border-rot-600 hover:border-rot-400 hover:bg-rot-900/50'} rounded border transition-all z-40 shadow-lg`}
                        title="Copy to clipboard"
                      >
                        {copiedRight ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                      </button>
                    )}
                  </div>
                </div>
                
                {resultCode && (
                  <button 
                    onClick={handleDownload}
                    className={`
                      z-20 w-full py-3 font-ritual font-bold tracking-[0.2em] border-t-2 transition-all duration-300 flex items-center justify-center gap-3 group
                      bg-black hover:bg-${getThemeColor(displayMode)}-900/30 border-${getThemeColor(displayMode)}-700 text-${getThemeColor(displayMode)}-500 hover:text-white
                    `}
                  >
                    <Download className={`w-5 h-5 group-hover:animate-bounce`} />
                    DOWNLOAD GRIMOIRE
                  </button>
                )}
                
              </div>

              <div className={`absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 ${theme.border}`}></div>
              <div className={`absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 ${theme.border}`}></div>
            </div>
          </section>

        </main>
      </div>
    </div>
  );
};

export default App;
