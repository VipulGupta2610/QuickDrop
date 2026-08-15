import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  Clock, 
  Copy, 
  Check, 
  Share2, 
  FileText, 
  Zap, 
  X 
} from 'lucide-react';

const QRSharePage = ({ fileName = "document.pdf", fileSize = "2.4 MB", roomCode = "482 910" }) => {
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(3600); // 1 hour in seconds [cite: 62]

  // Timer logic for Auto-Delete feature [cite: 57, 62]
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col items-center justify-center px-6">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-xl bg-slate-900/40 border border-white/10 rounded-[3rem] p-10 backdrop-blur-2xl shadow-2xl"
      >
        {/* Close/Cancel Session */}
        <button className="absolute top-8 right-8 text-slate-500 hover:text-white transition-colors">
          <X className="w-6 h-6" />
        </button>

        <div className="flex flex-col items-center">
          {/* Header Status */}
          <div className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-4 py-1.5 rounded-full mb-8">
            <ShieldCheck className="w-4 h-4 text-blue-500" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-blue-400">
              Secure Channel Established [cite: 55]
            </span>
          </div>

          <h2 className="text-3xl font-black text-white mb-2 text-center">Ready to Share</h2>
          <p className="text-slate-500 text-sm mb-10 text-center">
            Scan the QR or share the code to begin direct P2P transfer[cite: 67, 93].
          </p>

          {/* QR Code Container */}
          <div className="relative group mb-10">
            <div className="absolute -inset-4 bg-blue-600/20 blur-2xl rounded-full opacity-50 group-hover:opacity-100 transition-opacity" />
            <div className="relative bg-white p-6 rounded-[2.5rem] shadow-2xl">
              <QRCodeSVG 
                value={`https://quickdrop.io/join/${roomCode.replace(/\s/g, '')}`} 
                size={220}
                level="H"
                includeMargin={false}
              />
            </div>
          </div>

          {/* Room Code Display */}
          <div className="w-full grid grid-cols-1 gap-4 mb-8">
            <div className="bg-slate-950/50 border border-white/5 rounded-2xl p-6 flex flex-col items-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Unique Access Code [cite: 24]</span>
              <div className="flex items-center gap-4">
                <span className="text-4xl font-black tracking-[0.2em] text-white font-mono">{roomCode}</span>
                <button 
                  onClick={handleCopy}
                  className="p-2 hover:bg-white/5 rounded-lg transition-colors text-blue-500"
                >
                  {copied ? <Check className="w-6 h-6 text-emerald-500" /> : <Copy className="w-6 h-6" />}
                </button>
              </div>
            </div>
          </div>

          {/* File Metadata & Expiry */}
          <div className="w-full flex flex-col gap-3">
            <div className="flex items-center justify-between px-2 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                <span>{fileName} ({fileSize}) [cite: 72]</span>
              </div>
              <div className="flex items-center gap-2 text-blue-500">
                <Clock className="w-4 h-4" />
                <span>Auto-Delete: {formatTime(timeLeft)} [cite: 57, 62]</span>
              </div>
            </div>
            
            <div className="h-1 w-full bg-slate-950 rounded-full overflow-hidden border border-white/5">
              <motion.div 
                className="h-full bg-blue-600"
                initial={{ width: "100%" }}
                animate={{ width: `${(timeLeft / 3600) * 100}%` }}
                transition={{ duration: 1, ease: "linear" }}
              />
            </div>
          </div>

          {/* Social Share Mockup */}
          <button className="mt-10 flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium">
            <Share2 className="w-4 h-4" />
            <span>Copy Session Link</span>
          </button>
        </div>
      </motion.div>

      {/* Security Reassurance Footer */}
      <div className="mt-12 flex gap-8">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-blue-500" />
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Instant P2P [cite: 27]</span>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-blue-500" />
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">End-to-End Protection [cite: 47, 58]</span>
        </div>
      </div>
    </div>
  );
};

export default QRSharePage;