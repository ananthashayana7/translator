import React, { useState, useEffect, useRef } from 'react';
import { translateText } from '../services/geminiService';
import { Copy, Eraser, Sparkles, Languages, ChevronRight } from 'lucide-react';

const TranslationWindow: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  // Fixed: Use any for the timer reference to avoid NodeJS namespace issues in browser environment
  const debounceTimer = useRef<any>(null);

  const handleTranslate = async (text: string) => {
    if (!text.trim()) {
      setOutput('');
      return;
    }
    setIsTranslating(true);
    try {
      setOutput('');
      await translateText(text, (chunk) => {
        setOutput(prev => prev + chunk);
      });
    } catch (e) {
      setOutput("Error: Translation module failure.");
    } finally {
      setIsTranslating(false);
    }
  };

  const onInputChange = (val: string) => {
    setInput(val);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      handleTranslate(val);
    }, 1000);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
  };

  const clearAll = () => {
    setInput('');
    setOutput('');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_40px_1fr] gap-4 h-full min-h-[500px]">
      {/* Input Window */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center px-2">
          <span className="mono text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span> Input: DEUTSCH (AUTODETECT)
          </span>
          <button onClick={clearAll} className="p-1 hover:text-red-400 transition-colors" title="Clear All">
            <Eraser size={14} />
          </button>
        </div>
        <div className="relative flex-1 group">
          <textarea
            value={input}
            onChange={(e) => onInputChange(e.target.value)}
            placeholder="Geben Sie den Text hier ein..."
            className="w-full h-full bg-slate-900 border-2 border-slate-700 p-6 mono text-slate-300 focus:outline-none focus:border-amber-500/50 transition-all resize-none shadow-inner"
          />
          <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-slate-500 opacity-50"></div>
          <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-slate-500 opacity-50"></div>
          <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-slate-500 opacity-50"></div>
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-slate-500 opacity-50"></div>
        </div>
      </div>

      {/* Middle Divider */}
      <div className="hidden md:flex flex-col items-center justify-center gap-4 py-8">
        <div className="flex-1 w-[1px] bg-slate-800"></div>
        <div className="p-2 bg-slate-800 rounded-full border border-slate-700 text-slate-500">
           <ChevronRight size={16} />
        </div>
        <div className="flex-1 w-[1px] bg-slate-800"></div>
      </div>

      {/* Output Window */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center px-2">
          <span className="mono text-[10px] font-bold text-amber-500 uppercase flex items-center gap-1">
            <Sparkles size={10} /> Output: ENGLISH (SYNTHESIZED)
          </span>
          <button 
            onClick={copyToClipboard} 
            disabled={!output}
            className="p-1 hover:text-amber-400 transition-colors disabled:opacity-30" 
            title="Copy to Clipboard"
          >
            <Copy size={14} />
          </button>
        </div>
        <div className="relative flex-1">
          <div className="w-full h-full bg-slate-900/50 border-2 border-slate-700 p-6 mono text-amber-100/90 overflow-auto whitespace-pre-wrap shadow-inner min-h-[200px]">
            {output}
            {isTranslating && (
              <span className="inline-block w-2 h-4 bg-amber-500 ml-1 animate-pulse"></span>
            )}
            {!output && !isTranslating && (
                <span className="text-slate-700 italic">Waiting for signal...</span>
            )}
          </div>
          {/* Visual Flourish */}
          <div className="absolute top-4 right-4 text-[8px] mono text-slate-800 select-none pointer-events-none uppercase">
            X-PROCESS_ID: {Math.random().toString(16).slice(2, 8)}
          </div>
          <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-amber-900 opacity-30"></div>
          <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-amber-900 opacity-30"></div>
          <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-amber-900 opacity-30"></div>
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-amber-900 opacity-30"></div>
        </div>
      </div>
    </div>
  );
};

export default TranslationWindow;