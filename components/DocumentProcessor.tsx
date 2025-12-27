
import React, { useState, useRef, useEffect } from 'react';
import { Upload, FileText, Download, CheckCircle2, Loader2, FileUp, Printer, Terminal as TerminalIcon } from 'lucide-react';
import { translateDocumentContent } from '../services/geminiService';

declare const pdfjsLib: any;
declare const mammoth: any;

const DocumentProcessor: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [translatedDoc, setTranslatedDoc] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const logEndRef = useRef<HTMLDivElement>(null);

  const addLog = (msg: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const extractTextFromPDF = async (data: ArrayBuffer): Promise<string> => {
    addLog("PDF ENGINE INITIALIZED...");
    const pdf = await pdfjsLib.getDocument({ data }).promise;
    let fullText = '';
    addLog(`DETECTED ${pdf.numPages} PAGES. STARTING EXTRACTION...`);
    for (let i = 1; i <= pdf.numPages; i++) {
      addLog(`PARSING PAGE ${i}/${pdf.numPages}...`);
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item: any) => item.str).join(' ');
      fullText += `\n--- PAGE ${i} ---\n${pageText}\n`;
    }
    return fullText;
  };

  const extractTextFromDOCX = async (data: ArrayBuffer): Promise<string> => {
    addLog("DOCX STREAM OPENED...");
    const result = await mammoth.extractRawText({ arrayBuffer: data });
    addLog("XML TEXT NODES EXTRACTED SUCCESSFULLY.");
    return result.value;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setLogs([`FILE REGISTERED: ${selected.name.toUpperCase()}`]);
    }
  };

  const processDocument = async () => {
    if (!file) return;
    setIsProcessing(true);
    setLogs(prev => [...prev, "COMMENCING NEURAL TRANSLATION PROTOCOL..."]);
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      let rawText = '';
      
      if (file.type === 'application/pdf') {
        rawText = await extractTextFromPDF(arrayBuffer);
      } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        rawText = await extractTextFromDOCX(arrayBuffer);
      } else {
        addLog("PLAINTEXT DETECTED. ENCODING STREAM...");
        rawText = new TextDecoder().decode(arrayBuffer);
      }

      addLog("LIGUISTIC ANALYSIS IN PROGRESS...");
      addLog("MAPPING SEMANTIC ALIGNMENT...");
      
      const translated = await translateDocumentContent(rawText);
      
      addLog("SYNTHESIS COMPLETE. FINALIZING DOCUMENT...");
      setTranslatedDoc(translated);
    } catch (e) {
      addLog("CRITICAL ERROR: KERNEL PANIC DURING TRANSLATION.");
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {!translatedDoc ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upload Zone */}
          <div 
            className="retro-border bg-slate-900 p-8 flex flex-col items-center justify-center gap-6 cursor-pointer hover:border-amber-500 transition-all group relative overflow-hidden"
            onClick={() => fileInputRef.current?.click()}
          >
            {isProcessing && (
              <div className="absolute top-0 left-0 w-full h-[2px] bg-amber-500/50 shadow-[0_0_15px_#f59e0b] animate-[scan_2s_linear_infinite] z-20"></div>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden" 
              accept=".pdf,.docx,.txt"
            />
            <div className="p-6 bg-slate-800 rounded-full text-slate-400 group-hover:text-amber-500 transition-colors">
              {file ? <CheckCircle2 size={48} className="text-emerald-500" /> : <FileUp size={48} />}
            </div>
            <div className="text-center">
              <h3 className="text-xl font-bold mono uppercase mb-2">
                {file ? file.name : "Select German Source"}
              </h3>
              <p className="text-xs text-slate-500 mono uppercase tracking-widest">
                PDF, DOCX, TXT • SECURE UPLOAD
              </p>
            </div>
            
            <button 
              onClick={(e) => { e.stopPropagation(); processDocument(); }}
              disabled={!file || isProcessing}
              className="mt-4 px-10 py-4 bg-amber-500 text-slate-950 font-bold mono uppercase retro-btn flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? <Loader2 className="animate-spin" /> : <Sparkles size={18} />}
              {isProcessing ? "TRANSCODING..." : "Process Document"}
            </button>
          </div>

          {/* Terminal Log View */}
          <div className="retro-border bg-black p-4 flex flex-col h-[320px] lg:h-auto overflow-hidden">
            <div className="flex items-center gap-2 mb-2 border-b border-slate-800 pb-2">
              <TerminalIcon size={14} className="text-amber-500" />
              <span className="mono text-[10px] font-bold text-slate-500 uppercase tracking-widest">System Monitor log.v0</span>
            </div>
            <div className="flex-1 overflow-y-auto mono text-[11px] leading-relaxed text-emerald-500/80 space-y-1 custom-scrollbar">
              {logs.length === 0 && <div className="animate-pulse">_ WAITING FOR INPUT...</div>}
              {logs.map((log, i) => (
                <div key={i} className="flex gap-2">
                  <span className="text-slate-700 whitespace-nowrap">[{i.toString().padStart(3, '0')}]</span>
                  <span>{log}</span>
                </div>
              ))}
              <div ref={logEndRef} />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex justify-between items-center no-print">
            <div className="flex items-center gap-4">
               <button onClick={() => { setTranslatedDoc(null); setLogs([]); setFile(null); }} className="text-slate-400 hover:text-white mono text-xs uppercase flex items-center gap-2 group">
                 <span className="group-hover:-translate-x-1 transition-transform">←</span> Return to Terminal
               </button>
               <h2 className="text-lg font-bold mono uppercase text-amber-500 flex items-center gap-2">
                 <CheckCircle2 size={18} /> Analysis Complete
               </h2>
            </div>
            <button onClick={() => window.print()} className="px-6 py-2 bg-slate-800 text-slate-200 border border-slate-700 mono text-xs uppercase font-bold hover:bg-slate-700 transition-colors flex items-center gap-2">
              <Printer size={14} /> Output to PDF/Paper
            </button>
          </div>

          <div className="bg-[#fefefe] text-slate-900 p-12 md:p-20 shadow-[0_0_50px_rgba(0,0,0,0.5)] mx-auto max-w-[900px] w-full min-h-[1100px] border border-slate-300 printable-area relative">
            <div className="absolute top-8 right-8 mono text-[10px] text-slate-400 no-print select-none">
              DOC_ID: {Math.random().toString(36).toUpperCase().slice(2, 10)}
            </div>
            <div className="prose prose-slate max-w-none whitespace-pre-wrap font-serif text-[15px] leading-[1.6] text-justify">
               {translatedDoc}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes scan {
          0% { top: 0; }
          100% { top: 100%; }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #000;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #334155;
        }
      `}</style>
    </div>
  );
};

const Sparkles = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    <path d="M5 3v4" /><path d="M19 17v4" /><path d="M3 5h4" /><path d="M17 19h4" />
  </svg>
);

export default DocumentProcessor;

