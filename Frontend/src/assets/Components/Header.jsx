import React, { useState } from 'react';
import { Zap, Shield, Menu, X, GitBranch } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { label: 'Features', to: '/FeaturePage' },
    { label: 'Security', to: '/#security' },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/5"
      style={{ background: 'rgba(2, 8, 23, 0.85)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
            <div className="relative">
              <img
                src="/logo.jpg"
                alt="QuickDrop Logo"
                className="w-8 h-8 rounded-lg object-cover transition-transform duration-300 group-hover:rotate-12"
              />
              <div className="absolute inset-0 rounded-lg bg-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white">
              Quick<span className="text-blue-400">Drop</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="text-sm font-medium text-slate-400 hover:text-white transition-colors duration-200 relative group"
              >
                {link.label}
                <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-blue-400 group-hover:w-full transition-all duration-300" />
              </Link>
            ))}

            <div className="flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 px-3 py-1.5 rounded-full">
              <Shield className="w-3.5 h-3.5" />
              <span className="text-[11px] font-bold uppercase tracking-wider">P2P Encrypted</span>
            </div>
          </div>

          {/* Desktop Action */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="https://github.com/VipulGupta2610/QuickDrop"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-xl transition-all duration-200"
            >
            <GitBranch className="w-4 h-4" />
              <span>Source</span>
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-slate-400 hover:text-white transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/5 px-4 py-4 space-y-3"
          style={{ background: 'rgba(2, 8, 23, 0.95)' }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className="block text-sm font-medium text-slate-300 hover:text-white py-2 transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <div className="flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 px-3 py-2 rounded-xl w-fit">
            <Shield className="w-3.5 h-3.5" />
            <span className="text-[11px] font-bold uppercase tracking-wider">P2P Encrypted</span>
          </div>
          <a
            href="https://github.com/VipulGupta2610/QuickDrop"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white bg-white/5 border border-white/10 px-4 py-2 rounded-xl transition-colors w-fit"
          >
            <GitBranch className="w-4 h-4" />
            Source
          </a>
        </div>
      )}
    </nav>
  );
};

export default Header;