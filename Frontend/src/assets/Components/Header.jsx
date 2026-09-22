import React, { useState, useEffect } from 'react';
import { Shield, Menu, X, GitBranch } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  // Close the mobile menu automatically whenever the route changes
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <nav className="bg-slate-950/80 backdrop-blur-2xl border-b border-white/5 sticky top-0 z-50 w-full border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
            <div className="relative">
              <img src="/logo.jpg" alt="QuickDrop" className="w-8 h-8 rounded-lg object-cover transition-transform duration-300 group-hover:rotate-12" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white">
              Quick<span className="text-blue-400">Drop</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/FeaturePage" className="text-sm font-medium text-slate-400 hover:text-white transition-colors relative group">
              Features
              <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-blue-400 group-hover:w-full transition-all duration-300" />
            </Link>
            <a href="/#security" className="text-sm font-medium text-slate-400 hover:text-white transition-colors relative group">
              Security
              <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-blue-400 group-hover:w-full transition-all duration-300" />
            </a>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 backdrop-blur-md border border-blue-500/30 text-blue-300 text-[11px] font-bold tracking-widest uppercase">
              <Shield className="w-4 h-4" />
              <span>P2P Encrypted</span>
            </div>
          </div>

          {/* Desktop Source Button */}
          <div className="hidden md:block">
            <a
              href="https://github.com/VipulGupta2610/QuickDrop"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-white/5 border border-white/10 text-slate-300 font-semibold rounded-2xl transition-all duration-300 hover:bg-blue-400/10 hover:border-blue-400/30 hover:text-white hover:-translate-y-0.5 flex items-center gap-2 text-sm px-4 py-2"
            >
              <GitBranch className="w-4 h-4" />
              Source
            </a>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-slate-400 hover:text-white transition-colors"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/5 px-4 py-5 space-y-4" style={{ background: 'rgba(2,8,23,0.96)' }}>
          <Link to="/FeaturePage" onClick={() => setMobileOpen(false)} className="block text-sm font-medium text-slate-300 hover:text-white py-1.5 transition-colors">
            Features
          </Link>
          <a href="/#security" onClick={() => setMobileOpen(false)} className="block text-sm font-medium text-slate-300 hover:text-white py-1.5 transition-colors">
            Security
          </a>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 backdrop-blur-md border border-blue-500/30 text-blue-300 text-[11px] font-bold tracking-widest uppercase w-fit">
            <Shield className="w-4 h-4" />
            <span>P2P Encrypted</span>
          </div>
          <a href="https://github.com/VipulGupta2610/QuickDrop" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-white/5 border border-white/10 text-slate-300 font-semibold rounded-2xl transition-all duration-300 hover:bg-blue-400/10 hover:border-blue-400/30 hover:text-white hover:-translate-y-0.5 flex items-center gap-2 text-sm px-4 py-2 w-fit">
            <GitBranch className="w-4 h-4" />
            Source
          </a>
        </div>
      )}
    </nav>
  );
};

export default Header;