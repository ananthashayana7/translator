
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import TranslationWindow from './components/TranslationWindow';
import DocumentProcessor from './components/DocumentProcessor';
import { AppMode } from './types';
import { Type, FileText, Key, AlertTriangle, ExternalLink } from 'lucide-react';

declare const window: any;

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.TEXT);
  const [hasKey, setHasKey] = useState<boolean | null>(null);

  useEffect(() => {
    const checkKey = async () => {
      if (window.aistudio?.hasSelectedApiKey) {
        const selected = await window.aistudio.hasSelectedApiKey();
        setHasKey(selected);
      } else {
        setHasKey(true); // Fallback for environments without the selection utility
      }
    };
    checkKey();
  }, []);

  const handleOpenKeySelector = async () => {
    if (window.aistudio?.openSelectKey) {
      await window.aistudio.openSelectKey();
      setHasKey(true); // Assume success per guidelines
    }
  };

  if (hasKey === false) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-slate-100 font-mono">
        <div className="max-w-md w-full bg-slate-900 border-2 border-red-900/30 p-8 flex flex-col gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <AlertTriangle size={80} className="text-red-500" />
          </div>
          <div className="flex items-center gap-4 text-red-500">
            <Key size={32} />
            <h1 className="text-xl font-bold uppercase tracking-tighter">Authentication Required</h1>
          </div>
          <p className="text-sm leading-relaxed text-slate-400">
            Gemini 3 Pro requires a valid, paid API key for high-fidelity translation processing. Please select your API key to initialize the system.
          </p>
          <div className="space-y-3">
            <button 
              onClick={handleOpenKeySelector}
              className="w-full py-4 bg-amber-500 text-slate-950 font-bold uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
            >
              Select API Key
            </button>
            <a 
              href="https://ai.google.dev/gemini-api/docs/billing" 
              target="_blank" 
              className="flex items-center justify-center gap-2 text-[10px] text-slate-500 hover:text-slate-300 underline"
            >
              View Billing Documentation <ExternalLink size={10} />
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="flex flex-col gap-8">
        <div className="flex gap-1 bg-slate-900 border-2 border-slate-800 p-1 rounded-sm w-fit mx-auto no-print">
          <button 
            onClick={() => setMode(AppMode.TEXT)}
            className={`px-6 py-2 mono text-xs font-bold uppercase tracking-widest transition-all ${
              mode === AppMode.TEXT 
              ? 'bg-amber-500 text-slate-950 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' 
              : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <Type size={14} /> Text Stream
            </div>
          </button>
          <button 
            onClick={() => setMode(AppMode.DOCUMENT)}
            className={`px-6 py-2 mono text-xs font-bold uppercase tracking-widest transition-all ${
              mode === AppMode.DOCUMENT 
              ? 'bg-amber-500 text-slate-950 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' 
              : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <FileText size={14} /> File Processor
            </div>
          </button>
        </div>

        <div className="min-h-[60vh] animate-in fade-in duration-700">
          {mode === AppMode.TEXT ? (
            <div className="space-y-6">
              <div className="no-print">
                <h2 className="text-2xl font-bold mono uppercase tracking-tight text-slate-300 mb-1">
                  Live Neural <span className="text-amber-500 underline decoration-2 underline-offset-4">Translation</span>
                </h2>
                <p className="text-xs text-slate-500 mono uppercase tracking-widest">
                  Real-time DE-EN stream with recursive semantic analysis
                </p>
              </div>
              <TranslationWindow />
            </div>
          ) : (
            <div className="space-y-6">
              <div className="no-print text-center">
                <h2 className="text-2xl font-bold mono uppercase tracking-tight text-slate-300 mb-1">
                  Document <span className="text-amber-500">Pipeline</span>
                </h2>
                <p className="text-xs text-slate-500 mono uppercase tracking-widest">
                  Structural preservation and high-fidelity output generation
                </p>
              </div>
              <DocumentProcessor />
            </div>
          )}
        </div>

        <div className="no-print mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
           {[
             { label: 'Translation Engine', val: 'Gemini-3 Pro' },
             { label: 'Linguistic Model', val: 'G-EN High Fi' },
             { label: 'Auth Status', val: hasKey ? 'AUTHORIZED' : 'PENDING' },
             { label: 'Neural Heat', val: '32°C [STABLE]' }
           ].map((stat, i) => (
             <div key={i} className="p-3 bg-slate-900/30 border border-slate-800 flex flex-col items-center">
               <span className="text-[8px] mono text-slate-600 uppercase font-bold">{stat.label}</span>
               <span className="text-[10px] mono text-emerald-500/80 uppercase font-bold">{stat.val}</span>
             </div>
           ))}
        </div>
      </div>
    </Layout>
  );
};

export default App;
