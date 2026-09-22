import React from 'react';
import { Globe, ShieldCheck, Zap, Github } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="w-full border-t border-white/5 pt-14 pb-8 px-4 sm:px-6"
      style={{ background: 'rgba(2, 8, 23, 0.98)' }}
    >
      <div className="max-w-7xl mx-auto">

        {/* Top Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div className="sm:col-span-2 md:col-span-1 space-y-4">
            <div className="flex items-center gap-2">
              <img src="/logo.jpg" alt="QuickDrop" className="w-7 h-7 rounded-lg object-cover" />
              <span className="text-base font-bold text-white">Quick<span className="text-blue-400">Drop</span></span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
              Ephemeral file sharing with zero login. Secure, fast, and private by design.
            </p>
            <div className="flex items-center gap-2 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-dot" />
              <span className="text-[11px] font-bold uppercase tracking-wider">All Systems Operational</span>
            </div>
          </div>

          {/* Product */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold text-sm uppercase tracking-widest">Product</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Features', to: '/FeaturePage' },
                { label: 'How It Works', to: '/' },
                { label: 'Security', to: '/#security' },
              ].map((item) => (
                <li key={item.label}>
                  <Link to={item.to} className="text-slate-500 hover:text-slate-300 text-sm transition-colors duration-200">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Security */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold text-sm uppercase tracking-widest">Privacy</h4>
            <ul className="space-y-2.5 text-sm text-slate-500 leading-relaxed">
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
                <Globe className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span>Network: Global</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Secure Signaling</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <Zap className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                <span>P2P Active</span>
              </div>
            </div>
            <a
              href="https://github.com/VipulGupta2610/QuickDrop"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors"
            >
              <Github className="w-4 h-4" />
              <span>View Source</span>
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-slate-600 text-xs uppercase tracking-widest">
            © 2026 QuickDrop · No Login. No Signup. Just Share.
          </p>
          <p className="text-slate-600 text-xs">
            Built with ❤️ by <span className="text-slate-500">Vipul Gupta</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;