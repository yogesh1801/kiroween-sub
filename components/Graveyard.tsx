import React from 'react';
import { HistoryItem, TranslationMode } from '../types';
import { Skull, RefreshCw, Trash2 } from 'lucide-react';

interface GraveyardProps {
  history: HistoryItem[];
  onResurrect: (item: HistoryItem) => void;
  onClear: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const Graveyard: React.FC<GraveyardProps> = ({ history, onResurrect, onClear, isOpen, onClose }) => {
  return (
    <div className={`
      fixed inset-y-0 right-0 w-80 bg-black/95 border-l border-blood-900 transform transition-transform duration-500 z-[70]
      ${isOpen ? 'translate-x-0' : 'translate-x-full'}
    `}>
      <div className="p-4 border-b border-blood-900 flex justify-between items-center bg-blood-950/30">
        <h2 className="font-horror text-blood-500 text-xl tracking-widest flex items-center gap-2">
          <Skull size={20} /> GRAVEYARD
        </h2>
        <button onClick={onClose} className="text-blood-800 hover:text-blood-500 font-code">X</button>
      </div>

      <div className="p-4 overflow-y-auto h-[calc(100vh-120px)] space-y-4">
        {history.length === 0 ? (
          <div className="text-gray-700 font-code text-center mt-10 text-xs italic">
            NO BODIES BURIED YET...
          </div>
        ) : (
          history.map((item) => (
            <div 
              key={item.id}
              onClick={() => onResurrect(item)}
              className="group relative border border-gray-800 bg-gray-900/50 p-3 cursor-pointer hover:border-blood-700 hover:bg-blood-900/10 transition-all"
            >
              <div className="flex justify-between items-start mb-2">
                <span className={`text-[10px] font-ritual px-1 ${item.mode === TranslationMode.AUTOPSY ? 'bg-gray-700 text-white' : 'bg-blood-900 text-blood-200'}`}>
                  {item.mode}
                </span>
                <span className="text-[10px] text-gray-500 font-code">
                  {new Date(item.timestamp).toLocaleDateString()}
                </span>
              </div>
              <div className="text-blood-500 font-code text-xs font-bold mb-1">
                {item.sourceLang} &rarr; {item.targetLang}
              </div>
              <p className="text-gray-500 text-[10px] font-code line-clamp-2 italic">
                {item.preview}
              </p>
              
              <div className="absolute inset-0 bg-blood-600/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
            </div>
          ))
        )}
      </div>

      {history.length > 0 && (
        <div className="absolute bottom-0 inset-x-0 p-4 border-t border-blood-900 bg-black">
          <button 
            onClick={onClear}
            className="w-full flex items-center justify-center gap-2 text-gray-600 hover:text-red-500 font-code text-xs transition-colors"
          >
            <Trash2 size={12} /> BURN ALL BODIES
          </button>
        </div>
      )}
    </div>
  );
};

export default Graveyard;