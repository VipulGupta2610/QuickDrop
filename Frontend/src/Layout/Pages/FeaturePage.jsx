import React from 'react';
import { motion } from 'framer-motion';
import {
  Zap, Lock, ServerOff,
  Smartphone, WifiOff, RefreshCw, Layers
} from 'lucide-react';

const FeaturePage = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  const features = [
    {
      icon: <Zap className="w-7 h-7 text-blue-400" />,
      title: "Zero Login Sharing",
      desc: "Eliminates authentication barriers — share immediately, no account needed.",
      wide: true,
    },
    {
      icon: <Lock className="w-7 h-7 text-blue-400" />,
      title: "AES-256 Encryption",
      desc: "Files are encrypted with AES before transmission begins.",
      wide: false,
    },
    {
      icon: <ServerOff className="w-7 h-7 text-blue-400" />,
      title: "Zero Server Storage",
      desc: "Our server only handles signaling; data never touches our disks.",
      wide: false,
    },
    {
      icon: <WifiOff className="w-7 h-7 text-blue-400" />,
      title: "Offline Mode",
      desc: "Works on same WiFi network without requiring internet connection.",
      wide: true,
    },
    {
      icon: <RefreshCw className="w-7 h-7 text-blue-400" />,
      title: "Auto-Delete Protocol",
      desc: "Both devices auto-delete files post-transfer for total privacy.",
      wide: false,
    },
    {
      icon: <Smartphone className="w-7 h-7 text-blue-400" />,
      title: "Mobile Ready",
      desc: "QR code & code-based instant pairing without manual configuration.",
      wide: true,
    },
    {
      icon: <Layers className="w-7 h-7 text-blue-400" />,
      title: "Batch Operations",
      desc: "Multiple files per session for efficient batch transfer operations.",
      wide: false,
    }
  ];

  return (
    <div className="min-h-screen py-20 sm:py-28 px-4 sm:px-6 relative overflow-hidden">

      {/* Background glow */}
      <div className="absolute rounded-full pointer-events-none blur-[130px]" style={{ top: '0', left: '20%', width: '400px', height: '400px', background: 'rgba(37,99,235,0.06)' }} />

      <div className="max-w-6xl mx-auto relative z-10">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16 sm:mb-20">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white mb-5 tracking-tight">
            Engineered for <span className="bg-gradient-to-br from-blue-400 to-purple-400 bg-clip-text text-transparent">Privacy.</span>
          </h1>
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            QuickDrop distinguishes itself from traditional solutions with a security-first architecture and friction-free user experience.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-5"
        >
          {features.map((f, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className={`${f.wide ? 'md:col-span-2' : 'md:col-span-1'} bg-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.05)] transition-all duration-300 hover:bg-slate-800/70 hover:border-blue-400/30 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.1)] p-7 sm:p-8 group cursor-default`}
              style={{ borderRadius: '1.75rem' }}
            >
              <div className="flex items-center justify-center bg-gradient-to-br from-blue-500/20 to-purple-600/20 border border-white/10 text-blue-300 rounded-2xl transition-transform duration-300 w-14 h-14 mb-5">
                {f.icon}
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2">{f.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Roadmap */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-24 sm:mt-32 p-8 sm:p-12 text-center"
          style={{
            background: 'rgba(37,99,235,0.04)',
            border: '1px solid rgba(59,130,246,0.1)',
            borderRadius: '2rem',
          }}
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8">Project Roadmap</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {[
              { phase: "Phase 1", label: "Mobile Apps" },
              { phase: "Phase 2", label: "Chunked Transfer" },
              { phase: "Phase 3", label: "AI Compression" },
              { phase: "Phase 4", label: "Desktop Apps" },
            ].map((item, i) => (
              <div key={i} className="space-y-2">
                <p className="text-blue-400 font-bold text-sm">{item.phase}</p>
                <p className="text-white text-sm font-medium">{item.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FeaturePage;