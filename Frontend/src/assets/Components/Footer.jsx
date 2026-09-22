import React from 'react';
import { Globe, ShieldCheck, Zap, GitBranch } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="w-full border-t border-white/5 pt-14 pb-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">

        {/* Top Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <img src="/logo.jpg" alt="QuickDrop" className="w-7 h-7 rounded-lg object-cover" />
              <span className="text-base font-bold text-white">Quick<span className="text-blue-400">Drop</span></span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
              Ephemeral file sharing with zero login. Secure, fast, and private by design.
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-slate-300 text-xs font-semibold tracking-wide uppercase w-fit text-emerald-400 border-emerald-400/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-glow" />
              All Systems Operational
            </div>
          </div>

          {/* Product */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold text-sm uppercase tracking-widest">Product</h4>
            <ul className="space-y-2.5">
              <li><Link to="/FeaturePage" className="text-slate-500 hover:text-slate-300 text-sm transition-colors">Features</Link></li>
              <li><Link to="/" className="text-slate-500 hover:text-slate-300 text-sm transition-colors">How It Works</Link></li>
              <li><a href="/#security" className="text-slate-500 hover:text-slate-300 text-sm transition-colors">Security</a></li>
            </ul>
          </div>

          {/* Privacy */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold text-sm uppercase tracking-widest">Privacy</h4>
            <ul className="space-y-2.5 text-sm text-slate-500">
              <li>AES-256 Encryption</li>
              <li>Zero Server Storage</li>
              <li>Auto-delete after transfer</li>
              <li>No account required</li>
            </ul>
          </div>

          {/* Status */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold text-sm uppercase tracking-widest">Status</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <Globe className="w-4 h-4 text-blue-400 flex-shrink-0" /> Network: Global
              </div>
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" /> Secure Signaling
              </div>
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <Zap className="w-4 h-4 text-yellow-400 flex-shrink-0" /> P2P Active
              </div>
            </div>
            <a href="https://github.com/VipulGupta2610/QuickDrop" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors mt-2">
              <GitBranch className="w-4 h-4" /> View Source
            </a>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-slate-600 text-xs uppercase tracking-widest">© 2026 QuickDrop · No Login. No Signup. Just Share.</p>
          <p className="text-slate-600 text-xs">Built with ❤️ by <span className="text-slate-500">Vipul Gupta</span></p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;