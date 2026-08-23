import React from 'react';
import { Zap, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <nav className="sticky top-0 z-50 w-full bg-slate-950/80 backdrop-blur-md border-b border-blue-500/10 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to={"/"}>
        <div className="flex items-center gap-2 group cursor-pointer">
          <img src="/logo.jpg" alt="QuickDrop Logo" className="w-8 h-8 rounded-lg group-hover:rotate-12 transition-transform" />
          <span className="text-xl font-bold tracking-tight text-white">
            Quick<span className="text-blue-500">Drop</span>
          </span>
        </div>

        </Link>
        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
          <Link to={"/FeaturePage"}>
          
          <p className="hover:text-blue-400 transition-colors">Features</p>
          </Link>
          <a href="#security" className="hover:text-blue-400 transition-colors">Security</a>
          <div className="flex items-center gap-1.5 text-blue-500 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
            <Shield className="w-4 h-4" />
            <span className="text-xs font-bold uppercase">P2P Encrypted</span>
          </div>
        </div>

        {/* Action Button */}
        <button className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-slate-200 px-4 py-2 rounded-xl border border-slate-800 transition-all">
          {/* <Github className="w-4 h-4" /> */}
          <span className="text-sm">Source</span>
        </button>
      </div>
    </nav>
  );
};

export default Header;