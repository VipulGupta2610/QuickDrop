import React from 'react';
import { Globe, ShieldCheck } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="w-full bg-slate-950 border-t border-white/5 pt-16 pb-8 px-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12 mb-12">
        <div className="space-y-4">
          <h4 className="text-white font-bold">QuickDrop</h4>
          <p className="text-slate-500 text-sm leading-relaxed">
            A temporary file transfer website enabling zero-login file sharing with end-to-end protection. [cite: 24, 58]
          </p>
        </div>
        <div className="space-y-4">
          <h4 className="text-white font-bold">Privacy</h4>
          <p className="text-slate-500 text-sm">
            Files are encrypted with AES before transmission and auto-deleted post-transfer. [cite: 59, 62]
          </p>
        </div>
        <div className="flex flex-col md:items-end gap-4">
          <div className="flex items-center gap-2 text-slate-400 hover:text-blue-500 cursor-pointer transition-colors">
            <Globe className="w-4 h-4" />
            <span className="text-sm font-medium">Network Status: Global</span>
          </div>
          <div className="flex items-center gap-2 text-green-500 bg-green-500/10 px-3 py-1 rounded-full text-xs">
            <ShieldCheck className="w-3 h-3" />
            <span>Secure Signaling Active</span>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-600 text-xs uppercase tracking-widest">
        <p>© 2026 QuickDrop Project Presentation [cite: 4]</p>
        <p>No Login. No Signup. Just Share. [cite: 28]</p>
      </div>
    </footer>
  );
};

export default Footer;