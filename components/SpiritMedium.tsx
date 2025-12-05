import React, { useState, useEffect, useRef } from 'react';
import { Send, X, Sparkles, Skull, Ghost } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { SpookyInput } from './SpookyInput';

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
}

interface SpiritMediumProps {
  isOpen: boolean;
  onClose: () => void;
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  isLoading: boolean;
}

const SpiritMedium: React.FC<SpiritMediumProps> = ({ isOpen, onClose, messages, onSendMessage, isLoading }) => {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      // Focus input when opened
      const timer = setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [messages, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;
    onSendMessage(inputValue);
    setInputValue('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex flex-col transition-opacity duration-300 cursor-default">
      {/* Background Ambience - Blood Red */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blood-900/20 rounded-full blur-[100px] animate-pulse-slow"></div>
      </div>

      {/* Floating Close Button */}
      <button 
        onClick={onClose} 
        className="absolute top-6 right-6 z-50 p-2 text-blood-700 hover:text-blood-400 transition-colors hover:rotate-90 duration-300 bg-black/20 rounded-full backdrop-blur-sm border border-blood-900/30 cursor-pointer"
        title="Sever Connection"
      >
        <X className="w-8 h-8" />
      </button>

      {/* Messages Area */}
      <div className="relative z-10 flex-grow overflow-y-auto p-4 md:p-8 space-y-8 scrollbar-thin scrollbar-thumb-blood-900">
        <div className="max-w-4xl mx-auto space-y-8 pb-20 pt-10">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-6 opacity-60 select-none">
              <Ghost className="w-24 h-24 text-blood-900/50 animate-[drift_6s_infinite]" />
              <div className="space-y-2">
                <p className="font-ritual text-blood-500 text-lg tracking-widest drop-shadow-[0_0_5px_rgba(220,38,38,0.5)]">
                  THE SPIRIT MEDIUM IS LISTENING
                </p>
                <p className="font-code text-blood-600/50 text-sm">Ask the soul of the code...</p>
              </div>
            </div>
          ) : (
            messages.map((msg) => (
              <div 
                key={msg.id}
                className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`
                  max-w-[90%] md:max-w-[80%] p-6 rounded-sm relative
                  ${msg.role === 'user' 
                    ? 'bg-blood-950/40 border-r-2 border-blood-500/50 text-blood-100 shadow-[0_0_15px_rgba(220,38,38,0.1)]' 
                    : 'bg-black/80 border-l-2 border-blood-800 text-gray-300 shadow-[0_0_30px_rgba(0,0,0,0.8)]'}
                `}>
                  {/* Avatar Icon */}
                  <div className={`absolute -top-3 ${msg.role === 'user' ? '-right-2' : '-left-2'}`}>
                    {msg.role === 'model' && <Sparkles className="w-6 h-6 text-blood-500 fill-black animate-spin" style={{ animationDuration: '6s' }} />}
                  </div>

                  {msg.role === 'user' ? (
                    <div className="font-code text-sm md:text-base leading-relaxed">{msg.text}</div>
                  ) : (
                    <div className="markdown-content font-code text-sm md:text-base leading-relaxed space-y-4">
                      <ReactMarkdown
                        components={{
                          code({node, inline, className, children, ...props}: any) {
                            return !inline ? (
                              <div className="my-4 border border-blood-900/30 bg-black/80 rounded p-4 overflow-x-auto shadow-inner">
                                <code className="text-blood-400 font-code text-xs" {...props}>
                                  {children}
                                </code>
                              </div>
                            ) : (
                              <code className="bg-blood-900/20 text-blood-300 px-1 py-0.5 rounded font-bold text-xs" {...props}>
                                {children}
                              </code>
                            )
                          },
                          p: ({children}) => <p className="text-gray-300">{children}</p>,
                          strong: ({children}) => <strong className="text-blood-400 font-bold">{children}</strong>,
                          ul: ({children}) => <ul className="list-disc pl-4 space-y-1 text-gray-400 marker:text-blood-600">{children}</ul>,
                          ol: ({children}) => <ol className="list-decimal pl-4 space-y-1 text-gray-400 marker:text-blood-600">{children}</ol>,
                          h1: ({children}) => <h1 className="text-2xl font-ritual text-blood-500 border-b border-blood-900/30 pb-2 mt-4">{children}</h1>,
                          h2: ({children}) => <h2 className="text-xl font-ritual text-blood-400 mt-4">{children}</h2>,
                          h3: ({children}) => <h3 className="text-lg font-ritual text-blood-300 mt-2">{children}</h3>,
                          blockquote: ({children}) => <blockquote className="border-l-4 border-blood-800/50 pl-4 italic text-blood-200/50 my-2">{children}</blockquote>
                        }}
                      >
                        {msg.text}
                      </ReactMarkdown>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
          
          {isLoading && (
            <div className="flex justify-start w-full">
              <div className="bg-black/60 border-l-2 border-blood-800 p-6 flex gap-3 items-center">
                 <div className="w-2 h-2 bg-blood-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                 <div className="w-2 h-2 bg-blood-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                 <div className="w-2 h-2 bg-blood-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                 <span className="font-ritual text-xs text-blood-600 ml-2 animate-pulse">COMMUNING WITH THE VOID...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area - IMPROVED */}
      <div className="relative z-20 p-6 bg-black/95 border-t border-blood-900/50 shadow-[0_-10px_40px_rgba(0,0,0,1)]">
        <div className="max-w-4xl mx-auto">
          <form 
            onSubmit={handleSubmit} 
            className="relative group flex items-center bg-black border-2 border-blood-900/50 rounded-lg focus-within:border-blood-500 focus-within:shadow-[0_0_15px_rgba(220,38,38,0.3)] transition-all duration-300 cursor-text"
            onClick={() => inputRef.current?.focus()}
          >
            {/* Glow effect */}
            <div className="absolute inset-0 bg-blood-900/5 rounded-lg pointer-events-none"></div>
            
            <SpookyInput
              ref={inputRef}
              variant="blood"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="SPEAK TO THE SPIRIT..."
              className="flex-grow px-6 py-4 text-xl !bg-transparent border-none outline-none focus:ring-0 text-blood-500 placeholder-blood-900/30 cursor-text font-code"
              disabled={isLoading}
              autoFocus
            />
            
            <button 
              type="submit"
              disabled={isLoading}
              className="mr-4 p-2 text-blood-700 hover:text-blood-400 disabled:opacity-30 transition-all hover:scale-110 cursor-pointer"
            >
              <Send size={24} />
            </button>
          </form>
          <div className="text-center mt-2 text-[10px] text-blood-900/50 font-code tracking-widest uppercase select-none">
            Press Enter to Summon
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpiritMedium;