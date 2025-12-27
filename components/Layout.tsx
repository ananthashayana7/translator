
import React from 'react';
import { Terminal, Shield, FileText, Settings, Github } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-slate-950 text-slate-100">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#475569 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>

      {/* Header */}
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
          <a href="#" className="text-slate-400 hover:text-amber-500 transition-colors flex items-center gap-2">
            <Shield size={14} /> Security
          </a>
          <a href="#" className="text-slate-400 hover:text-amber-500 transition-colors flex items-center gap-2">
            <Github size={14} /> Source
          </a>
          <div className="h-6 w-[2px] bg-slate-800"></div>
          <div className="flex items-center gap-2 px-3 py-1 bg-slate-800 border border-slate-700 rounded-sm">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-[10px]">System Online</span>
          </div>
        </nav>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 relative z-10 p-4 md:p-8 max-w-7xl mx-auto w-full">
        {children}
      </main>

      {/* Footer */}
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
