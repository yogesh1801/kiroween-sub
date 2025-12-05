import React, { InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes, forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

interface SpookyInputProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: 'blood' | 'rot';
}

export const SpookyInput = forwardRef<HTMLInputElement, SpookyInputProps>(({ className, variant = 'blood', ...props }, ref) => {
  const textColor = variant === 'blood' ? 'text-blood-500' : 'text-rot-500';
  const placeholderColor = variant === 'blood' ? 'placeholder-blood-900/30' : 'placeholder-rot-900/30';
  const caretColor = variant === 'blood' ? 'caret-blood-600' : 'caret-rot-600';

  return (
    <input
      ref={ref}
      className={`
        w-full bg-transparent border-none outline-none font-code text-lg tracking-widest
        ${textColor} ${placeholderColor} ${caretColor}
        focus:ring-0 p-1 transition-all duration-75
        ${className}
      `}
      autoComplete="off"
      spellCheck={false}
      {...props}
    />
  );
});

SpookyInput.displayName = 'SpookyInput';

interface SpookyTextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?: 'blood' | 'rot';
}

export const SpookyTextArea = forwardRef<HTMLTextAreaElement, SpookyTextAreaProps>(({ className, variant = 'blood', ...props }, ref) => {
  const textColor = variant === 'blood' ? 'text-blood-500' : 'text-rot-500';
  const placeholderColor = variant === 'blood' ? 'placeholder-blood-900/20' : 'placeholder-rot-900/20';
  const selectionColor = variant === 'blood' ? 'selection:bg-blood-900 selection:text-white' : 'selection:bg-rot-900 selection:text-white';

  return (
    <textarea
      ref={ref}
      className={`
        w-full h-full bg-transparent border-none outline-none font-code text-sm leading-relaxed resize-none
        ${textColor} ${placeholderColor} ${selectionColor}
        focus:ring-0 p-4
        scrollbar-thin
        ${variant === 'blood' ? 'scrollbar-thumb-blood-900' : 'scrollbar-thumb-rot-900'}
        ${className}
      `}
      autoComplete="off"
      spellCheck={false}
      {...props}
    />
  );
});

SpookyTextArea.displayName = 'SpookyTextArea';

interface SpookySelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  variant?: 'blood' | 'rot';
  options: { label: string; value: string }[];
  placeholder?: string;
}

export const SpookySelect: React.FC<SpookySelectProps> = ({ className, variant = 'blood', options, placeholder, ...props }) => {
  const textColor = variant === 'blood' ? 'text-blood-500' : 'text-rot-500';
  
  return (
    <div className="relative w-full group">
      <select
        className={`
          w-full bg-transparent border-none outline-none font-code text-lg tracking-widest appearance-none
          ${textColor}
          focus:ring-0 p-1 pr-8 transition-all duration-75 cursor-pointer
          ${className}
        `}
        {...props}
      >
        {placeholder && <option value="" className="bg-black text-gray-500">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-black font-code tracking-widest">
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown 
        className={`absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none opacity-50 ${textColor}`} 
      />
    </div>
  );
};
