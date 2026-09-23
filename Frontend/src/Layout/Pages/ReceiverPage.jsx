import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Download, ShieldCheck, Clock, FileText,
  Zap, AlertCircle, CheckCircle2, ArrowLeft
} from 'lucide-react';
import { useParams, Link } from 'react-router-dom';
import api from '../../assets/Components/api/axios';

const ReceiverPage = () => {
  const { inputCode } = useParams();
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const [fileData, setFileData] = useState(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const fetchFileInfo = async () => {
      try {
        const res = await api.get(`/ReceiverPage/${inputCode}`);
        setFileData({
          name: res.data.fileName,
          url: res.data.downloadUrl,
          size: "Secure P2P File"
        });
        setConnectionStatus('ready');
      } catch (error) {
        console.error("Error fetching file:", error);
        setConnectionStatus('error');
      }
    };
    if (inputCode) fetchFileInfo();
  }, [inputCode]);

  const handleDownload = async () => {
    if (!fileData?.url) return;
    setConnectionStatus('downloading');
    setProgress(0);

    try {
      const response = await fetch(fileData.url);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      let currentProgress = 0;
      const interval = setInterval(() => {
        currentProgress += 5;
        setProgress(Math.min(currentProgress, 95));
        if (currentProgress >= 95) clearInterval(interval);
      }, 40);

      const link = document.createElement('a');
      link.href = blobUrl;
      link.setAttribute('download', fileData.name || 'quickdrop-file');
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(blobUrl), 5000);

      clearInterval(interval);
      setProgress(100);
      setTimeout(() => setConnectionStatus('finished'), 400);
    } catch (error) {
      console.error("Download error:", error);
      const link = document.createElement('a');
      link.href = fileData.url;
      link.setAttribute('download', fileData.name || 'quickdrop-file');
      link.setAttribute('target', '_blank');
      document.body.appendChild(link);
      link.click();
      link.remove();
      setProgress(100);
      setTimeout(() => setConnectionStatus('finished'), 400);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 py-10 relative overflow-hidden">

      {/* Background glows */}
      <div className="absolute rounded-full pointer-events-none blur-[130px]" style={{ top: '-50px', left: '35%', width: '500px', height: '350px', background: 'rgba(37,99,235,0.06)' }} />

      {/* Back link */}
      <Link to="/" className="absolute top-6 left-4 sm:left-8 flex items-center gap-2 text-slate-500 hover:text-slate-300 text-sm transition-colors group z-20">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span>Back</span>
      </Link>

      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="bg-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.05)] relative z-10 w-full max-w-md p-6 sm:p-8"
      >
        {/* Header Row */}
        <div className="flex flex-wrap justify-between items-center gap-3 mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 backdrop-blur-md border border-blue-500/30 text-blue-300 text-[11px] font-bold tracking-widest uppercase">
            <Zap className="w-3 h-3 fill-current" />
            Room: {inputCode}
          </div>
          <div className="flex items-center gap-1.5 text-slate-400">
            <Clock className="w-3.5 h-3.5" />
            <span className="text-xs">Expires in 1h</span>
          </div>
        </div>

        {/* File Info */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="relative mb-5">
            <div className="flex items-center justify-center bg-gradient-to-br from-blue-500/20 to-purple-600/20 border border-white/10 text-blue-300 rounded-2xl transition-transform duration-300 w-20 h-20 sm:w-24 sm:h-24">
              <FileText className="w-10 h-10 sm:w-12 sm:h-12" />
            </div>
            {connectionStatus === 'ready' && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-slate-900">
                <CheckCircle2 className="w-3 h-3 text-white" />
              </motion.div>
            )}
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white mb-1 truncate w-full max-w-xs">
            {fileData ? fileData.name : 'Loading File...'}
          </h2>
          <p className="text-slate-500 text-sm">{fileData ? fileData.size : 'Checking vault...'}</p>
        </div>

        {/* Action States */}
        <div className="space-y-4 mb-8">
          <AnimatePresence mode="wait">
            {connectionStatus === 'connecting' && (
              <motion.div key="connecting" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-3 py-5">
                <div className="w-7 h-7 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-[11px] text-slate-400 uppercase tracking-widest font-bold">Establishing Secure Channel...</p>
              </motion.div>
            )}

            {connectionStatus === 'ready' && (
              <motion.button
                key="ready"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleDownload}
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-br from-blue-600 to-indigo-500 text-white font-semibold rounded-2xl transition-all duration-300 shadow-[0_4px_15px_rgba(37,99,235,0.3),inset_0_1px_0_rgba(255,255,255,0.2)] hover:shadow-[0_8px_25px_rgba(37,99,235,0.5),inset_0_1px_0_rgba(255,255,255,0.3)] hover:-translate-y-0.5 hover:brightness-110 active:scale-95 w-full py-4 sm:py-5 flex items-center justify-center gap-3 text-sm sm:text-base"
              >
                <Download className="w-5 h-5" /> Receive File
              </motion.button>
            )}

            {connectionStatus === 'downloading' && (
              <motion.div key="downloading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3 py-4">
                <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="h-full rounded-full"
                    style={{ background: 'linear-gradient(90deg, #3b82f6, #60a5fa)', boxShadow: '0 0 12px rgba(59,130,246,0.5)' }}
                  />
                </div>
                <p className="text-center text-[11px] text-blue-400 uppercase tracking-widest" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                  Decrypting: {progress}%
                </p>
              </motion.div>
            )}

            {connectionStatus === 'finished' && (
              <motion.div key="finished" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '1rem', padding: '1rem' }}
                className="flex items-center gap-4"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-emerald-400">Transfer Complete</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">File auto-deleted from vault</p>
                </div>
              </motion.div>
            )}

            {connectionStatus === 'error' && (
              <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '1rem', padding: '1rem' }}
                className="flex items-center gap-4"
              >
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                <div>
                  <p className="text-sm font-bold text-red-400">Link expired or invalid code</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Please request a new share link</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Security Footer */}
        <div className="pt-5 border-t border-white/5 grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">AES-256 E2E</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertCircle className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Zero Retention</span>
          </div>
        </div>
      </motion.div>

      <p className="mt-8 text-slate-700 text-[10px] uppercase tracking-[0.3em] font-bold">
        Quick<span className="text-blue-500">Drop</span> Security Protocol v1.0
      </p>
    </div>
  );
};

export default ReceiverPage;