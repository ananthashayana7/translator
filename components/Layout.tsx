
import React, { useState } from 'react';
import { Terminal, Shield, FileText, Settings, Github, X, Lock, Cpu, Database } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [activeModal, setActiveModal] = useState<'security' | 'source' | null>(null);

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-slate-950 text-slate-100">
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#475569 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>

      <header className="relative z-10 border-b-2 border-slate-800 bg-slate-900 px-6 py-4 flex items-center justify-between no-print shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-500 rounded-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <Terminal size={24} className="text-slate-900" />
          </div>
          <div>
            <h1 className="text-xl font-bold mono tracking-tighter uppercase text-amber-500">DocTrans<span className="text-slate-100">Pro</span></h1>
            <p className="text-[10px] mono text-slate-500 font-bold uppercase tracking-[0.2em]">High Performance DE-EN Translation Protocol v3.0.1</p>
          </div>
        </div>
        
        <nav className="flex items-center gap-6 text-sm font-bold uppercase tracking-widest mono">
          <button 
            onClick={() => setActiveModal('security')}
            className="text-slate-400 hover:text-amber-500 transition-colors flex items-center gap-2"
          >
            <Shield size={14} /> Security
          </button>
          <button 
            onClick={() => setActiveModal('source')}
            className="text-slate-400 hover:text-amber-500 transition-colors flex items-center gap-2"
          >
            <Github size={14} /> Source
          </button>
          <div className="h-6 w-[2px] bg-slate-800"></div>
          <div className="flex items-center gap-2 px-3 py-1 bg-slate-800 border border-slate-700 rounded-sm">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-[10px]">System Online</span>
          </div>
        </nav>
      </header>

      <main className="flex-1 relative z-10 p-4 md:p-8 max-w-7xl mx-auto w-full">
        {children}
      </main>

      {/* Modal Overlay */}
      {activeModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-2xl bg-slate-900 border-2 border-slate-700 shadow-2xl overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-800/50">
              <span className="mono font-bold uppercase tracking-tighter text-amber-500 flex items-center gap-2">
                {activeModal === 'security' ? <Lock size={16} /> : <Cpu size={16} />}
                SYSTEM_{activeModal.toUpperCase()}_PROTOCOL
              </span>
              <button onClick={() => setActiveModal(null)} className="text-slate-500 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-8 mono text-xs text-slate-300 space-y-4 max-h-[70vh] overflow-y-auto">
              {activeModal === 'security' ? (
                <>
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="p-4 border border-slate-800 bg-slate-900 text-center">
                      <div className="text-emerald-500 mb-1">AES-256</div>
                      <div className="text-[8px] text-slate-500">ENCRYPTION</div>
                    </div>
                    <div className="p-4 border border-slate-800 bg-slate-900 text-center">
                      <div className="text-emerald-500 mb-1">TLS 1.3</div>
                      <div className="text-[8px] text-slate-500">TRANSPORT</div>
                    </div>
                    <div className="p-4 border border-slate-800 bg-slate-900 text-center">
                      <div className="text-emerald-500 mb-1">Zero-Log</div>
                      <div className="text-[8px] text-slate-500">RETENTION</div>
                    </div>
                  </div>
                  <p>Our translation engine operates within a strictly ephemeral environment. All document buffers are purged from system memory immediately upon output delivery.</p>
                  <p className="text-slate-500">DPA compliance status: ACTIVE. GDPR compliance: CERTIFIED. Data localization: EU-WEST-1.</p>
                </>
              ) : (
                <>
                  <p className="text-amber-500">// Neural Architecture v3.0.1</p>
                  <pre className="p-4 bg-black border border-slate-800 overflow-x-auto text-[10px]">
{`const AI_CONFIG = {
  model: "gemini-3-pro-preview",
  temperature: 0.1,
  thinking: true,
  instruction: "Professional DE-EN Architect"
};

async function pipeline(input) {
  const stream = await neuralCore.stream(input);
  return stream.map(semanticAlign);
}`}
                  </pre>
                  <p>This application utilizes the Gemini 3 Pro reasoning model, optimized with chain-of-thought prompting for structural layout preservation in document translation.</p>
                </>
              )}
            </div>
            <div className="p-4 border-t border-slate-800 bg-slate-900 text-right">
              <button onClick={() => setActiveModal(null)} className="px-6 py-2 bg-slate-800 text-slate-300 font-bold uppercase text-[10px] hover:bg-slate-700 transition-colors border border-slate-700">Close</button>
            </div>
          </div>
        </div>
      )}

      <footer className="relative z-10 border-t-2 border-slate-800 bg-slate-900/50 p-4 no-print">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-[10px] mono text-slate-500 uppercase font-bold tracking-widest">
          <p>© 2024 NEURAL TRANSLATION SYSTEMS GMBH</p>
          <div className="flex gap-4">
            <span>BITRATE: 128KBPS</span>
            <span>LATENCY: 42MS</span>
            <span>ENCRYPTION: AES-256</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
