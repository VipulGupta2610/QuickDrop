import React from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, ShieldCheck, Lock, ServerOff, 
  Smartphone, Cpu, Monitor, Globe, 
  WifiOff, HardDriveDownload, RefreshCw, Layers
} from 'lucide-react';

const FeaturePage = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  const features = [
    {
      icon: <Zap className="w-8 h-8 text-blue-500" />,
      title: "Zero Login sharing",
      desc: "Eliminates authentication barriers—share immediately, no account needed.",
      grid: "md:col-span-2",
      cite: "81"
    },
    {
      icon: <Lock className="w-8 h-8 text-blue-500" />,
      title: "AES-256 Encryption",
      desc: "Files are encrypted with AES before transmission begins.",
      grid: "md:col-span-1",
      cite: "59"
    },
    {
      icon: <ServerOff className="w-8 h-8 text-blue-500" />,
      title: "Zero Server Storage",
      desc: "Our server only handles signaling; data never touches our disks.",
      grid: "md:col-span-1",
      cite: "43"
    },
    {
      icon: <WifiOff className="w-8 h-8 text-blue-500" />,
      title: "Offline Mode",
      desc: "Works on same WiFi network without requiring internet connection.",
      grid: "md:col-span-2",
      cite: "76"
    },
    {
      icon: <RefreshCw className="w-8 h-8 text-blue-500" />,
      title: "Auto-Delete Protocol",
      desc: "Both devices auto-delete files post-transfer for total privacy.",
      grid: "md:col-span-1",
      cite: "62"
    },
    {
      icon: <Smartphone className="w-8 h-8 text-blue-500" />,
      title: "Mobile Ready",
      desc: "QR code & code-based instant pairing without manual configuration.",
      grid: "md:col-span-2",
      cite: "67"
    },
    {
      icon: <Layers className="w-8 h-8 text-blue-500" />,
      title: "Batch Operations",
      desc: "Multiple files per session for efficient batch transfer operations.",
      grid: "md:col-span-1",
      cite: "68"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 py-24 px-6 relative overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6">
            Engineered for <span className="text-blue-500">Privacy.</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            QuickDrop distinguishes itself from traditional solutions with a security-first architecture and friction-free user experience. [cite: 27]
          </p>
        </motion.div>

        {/* Bento Grid Layout */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {features.map((f, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              whileHover={{ y: -5, borderColor: 'rgba(59, 130, 246, 0.5)' }}
              className={`${f.grid} bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-8 backdrop-blur-xl transition-all duration-300 group`}
            >
              <div className="mb-6 bg-slate-950 w-16 h-16 rounded-2xl flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform">
                {f.icon}
              </div>
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-white">{f.title}</h3>
                <span className="text-[10px] text-slate-600 font-mono">CODE:</span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                {f.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Technical Roadmap Footer */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-32 p-12 bg-blue-600/5 border border-blue-500/10 rounded-[3rem] text-center"
        >
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Project Roadmap [cite: 96]</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="space-y-2">
              <p className="text-blue-500 font-bold text-sm">Phase 1</p>
              <p className="text-white text-sm font-medium">Mobile Apps [cite: 101]</p>
            </div>
            <div className="space-y-2">
              <p className="text-blue-500 font-bold text-sm">Phase 2</p>
              <p className="text-white text-sm font-medium">Chunked Transfer [cite: 103]</p>
            </div>
            <div className="space-y-2">
              <p className="text-blue-500 font-bold text-sm">Phase 3</p>
              <p className="text-white text-sm font-medium">AI Compression [cite: 105]</p>
            </div>
            <div className="space-y-2">
              <p className="text-blue-500 font-bold text-sm">Phase 4</p>
              <p className="text-white text-sm font-medium">Desktop Apps [cite: 108]</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FeaturePage;