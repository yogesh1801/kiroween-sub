import React from 'react';

interface PentagramSpinnerProps {
  label?: string;
}

const PentagramSpinner: React.FC<PentagramSpinnerProps> = ({ label }) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-6">
      <div className="relative w-32 h-32 flex items-center justify-center">
        {/* Outer Ring */}
        <div className="absolute inset-0 border-2 border-blood-900/50 rounded-full animate-[spin_10s_linear_infinite]"></div>
        <div className="absolute inset-2 border border-blood-900/30 rounded-full animate-[spin_8s_linear_infinite_reverse]"></div>
        
        {/* Star */}
        <svg viewBox="0 0 100 100" className="w-24 h-24 text-blood-600 fill-none stroke-current stroke-[1] animate-pulse-slow filter drop-shadow-[0_0_8px_rgba(220,38,38,0.5)]">
           <polygon points="50,5 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35" />
           <circle cx="50" cy="50" r="35" className="opacity-50" />
        </svg>

        {/* Glow center */}
        <div className="absolute inset-0 bg-blood-600/10 rounded-full blur-xl animate-pulse"></div>
      </div>
      
      {label && (
        <p className="font-horror text-blood-500 tracking-[0.3em] text-xl animate-pulse shadow-black drop-shadow-lg text-center uppercase">
          {label}
        </p>
      )}
    </div>
  );
};

export default PentagramSpinner;