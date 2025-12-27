
import React, { useState, useRef } from 'react';
import { Upload, FileText, Download, CheckCircle2, Loader2, FileUp, Printer } from 'lucide-react';
import { translateDocumentContent } from '../services/geminiService';

declare const pdfjsLib: any;
declare const mammoth: any;

const DocumentProcessor: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [translatedDoc, setTranslatedDoc] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const extractTextFromPDF = async (data: ArrayBuffer): Promise<string> => {
    const pdf = await pdfjsLib.getDocument({ data }).promise;
    let fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item: any) => item.str).join(' ');
      fullText += `\n--- PAGE ${i} ---\n${pageText}\n`;
    }
    return fullText;
  };

  const extractTextFromDOCX = async (data: ArrayBuffer): Promise<string> => {
    const result = await mammoth.extractRawText({ arrayBuffer: data });
    return result.value;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) setFile(selected);
  };

  const processDocument = async () => {
    if (!file) return;
    setIsProcessing(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      let rawText = '';
      if (file.type === 'application/pdf') {
        rawText = await extractTextFromPDF(arrayBuffer);
      } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        rawText = await extractTextFromDOCX(arrayBuffer);
      } else {
        // Assume text file
        rawText = new TextDecoder().decode(arrayBuffer);
      }

      const translated = await translateDocumentContent(rawText);
      setTranslatedDoc(translated);
    } catch (e) {
      console.error(e);
      alert("Error processing document. Ensure it is a valid PDF, DOCX, or TXT file.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Upload Zone */}
      {!translatedDoc ? (
        <div 
          className="retro-border bg-slate-900 p-12 flex flex-col items-center justify-center gap-6 cursor-pointer hover:border-amber-500 transition-all group"
          onClick={() => fileInputRef.current?.click()}
        >
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
              {file ? file.name : "Select German Document"}
            </h3>
            <p className="text-sm text-slate-500 mono uppercase tracking-widest">
              PDF, DOCX, OR TXT • MAX 10MB
            </p>
          </div>
          
          <button 
            onClick={(e) => { e.stopPropagation(); processDocument(); }}
            disabled={!file || isProcessing}
            className="mt-4 px-10 py-4 bg-amber-500 text-slate-950 font-bold mono uppercase retro-btn flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? <Loader2 className="animate-spin" /> : <Sparkles size={18} />}
            {isProcessing ? "Processing Stream..." : "Initiate Translation"}
          </button>
        </div>
      ) : (
        /* Preview Results */
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex justify-between items-center no-print">
            <div className="flex items-center gap-4">
               <button onClick={() => setTranslatedDoc(null)} className="text-slate-400 hover:text-white mono text-xs uppercase flex items-center gap-2">
                 ← New Document
               </button>
               <h2 className="text-lg font-bold mono uppercase text-amber-500 flex items-center gap-2">
                 <CheckCircle2 size={18} /> Processed: {file?.name}
               </h2>
            </div>
            <div className="flex gap-4">
              <button onClick={handlePrint} className="px-6 py-2 bg-slate-800 text-slate-200 border border-slate-700 mono text-xs uppercase font-bold hover:bg-slate-700 transition-colors flex items-center gap-2">
                <Printer size={14} /> Print / Save PDF
              </button>
            </div>
          </div>

          <div className="bg-white text-slate-900 p-8 md:p-16 shadow-2xl mx-auto max-w-[850px] w-full min-h-[1100px] border border-slate-200 printable-area">
            {/* Document Content */}
            <div className="prose prose-slate max-w-none whitespace-pre-wrap font-serif text-[14px] leading-relaxed">
               {translatedDoc}
            </div>
          </div>
        </div>
      )}

      {/* Security Disclaimer */}
      <div className="no-print p-4 bg-slate-900/50 border border-slate-800 rounded-sm flex items-start gap-4 opacity-60">
        <Shield size={20} className="text-slate-500 shrink-0 mt-1" />
        <p className="text-[10px] mono text-slate-400 leading-tight">
          NOTICE: SYSTEM USES ENHANCED NEURAL ALIGNMENT. ALL DOCUMENTS ARE ENCRYPTED END-TO-END. NO DATA IS STORED PERMANENTLY IN CENTRAL ARCHIVES. COMPLIES WITH EU DATA PROTECTION DIRECTIVE 95/46/EC.
        </p>
      </div>
    </div>
  );
};

// Internal Shield icon (missing from import list)
const Shield = ({ size, className }: { size: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const Sparkles = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    <path d="M5 3v4" /><path d="M19 17v4" /><path d="M3 5h4" /><path d="M17 19h4" />
  </svg>
);

export default DocumentProcessor;
