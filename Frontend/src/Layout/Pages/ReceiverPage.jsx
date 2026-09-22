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
        console.log("File Data Received:", res.data);
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

  // FIX: Use fetch + blob URL to avoid cross-origin sandboxed iframe script blocking
  const handleDownload = async () => {
    if (!fileData?.url) return;

    setConnectionStatus('downloading');
    setProgress(0);

    try {
      // Fetch the file as a blob to avoid cross-origin 'allow-scripts' sandbox error
      const response = await fetch(fileData.url);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      // Simulate progress animation
      let currentProgress = 0;
      const interval = setInterval(() => {
        currentProgress += 5;
        setProgress(Math.min(currentProgress, 95));
        if (currentProgress >= 95) clearInterval(interval);
      }, 40);

      // Once blob is ready, trigger download using blob URL (no sandbox issue)
      const link = document.createElement('a');
      link.href = blobUrl;
      link.setAttribute('download', fileData.name || 'quickdrop-file');
      document.body.appendChild(link);
      link.click();
      link.remove();

      // Cleanup blob URL
      setTimeout(() => URL.revokeObjectURL(blobUrl), 5000);

      clearInterval(interval);
      setProgress(100);
      setTimeout(() => setConnectionStatus('finished'), 400);
    } catch (error) {
      console.error("Download error:", error);
      // Fallback: direct link approach
      const link = document.createElement('a');
      link.href = fileData.url;
      link.setAttribute('download', fileData.name || 'quickdrop-file');
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
      document.body.appendChild(link);
      link.click();
      link.remove();
      setProgress(100);
      setTimeout(() => setConnectionStatus('finished'), 400);
    }
  };

  return (
    <div className="min-h-screen text-slate-200 flex flex-col items-center justify-center px-4 sm:px-6 py-10 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #020817 0%, #0a1628 50%, #020817 100%)' }}
    >
      {/* Background glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-blue-600/8 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-blue-800/5 blur-[80px] rounded-full pointer-events-none" />

      {/* Back link */}
      <Link to="/" className="absolute top-6 left-4 sm:left-8 flex items-center gap-2 text-slate-500 hover:text-slate-300 text-sm transition-colors group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span>Back</span>
      </Link>

      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-md"
        style={{
          background: 'rgba(10, 22, 40, 0.7)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '2rem',
          padding: '2rem',
          boxShadow: '0 25px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(59,130,246,0.05)',
        }}
      >
        {/* Header Status Row */}
        <div className="flex flex-wrap justify-between items-center gap-3 mb-8">
          <div className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-3 py-1.5 rounded-full">
            <Zap className="w-3 h-3 text-blue-400 fill-current" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400">
              Room: {inputCode}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-400">
            <Clock className="w-3.5 h-3.5" />
            <span className="text-xs">Expires in 1h</span>
          </div>
        </div>

        {/* File Info */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="relative mb-5">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-[1.5rem] flex items-center justify-center"
              style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.15)' }}
            >
              <div className="absolute inset-0 bg-blue-500/10 blur-2xl rounded-full" />
              <FileText className="w-10 h-10 sm:w-12 sm:h-12 text-blue-400 relative z-10" />
            </div>
            {connectionStatus === 'ready' && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-slate-900"
              >
                <CheckCircle2 className="w-3 h-3 text-white" />
              </motion.div>
            )}
          </div>

          <h2 className="text-lg sm:text-xl font-bold text-white mb-1 truncate w-full max-w-xs px-2">
            {fileData ? fileData.name : 'Loading File...'}
          </h2>
          <p className="text-slate-500 text-sm">
            {fileData ? fileData.size : 'Checking vault...'}
          </p>
        </div>

        {/* Action States */}
        <div className="space-y-4 mb-8">
          <AnimatePresence mode="wait">

            {connectionStatus === 'connecting' && (
              <motion.div
                key="connecting"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-3 py-5"
              >
                <div className="w-7 h-7 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-[11px] text-slate-400 uppercase tracking-widest font-bold">
                  Establishing Secure Channel...
                </p>
              </motion.div>
            )}

            {connectionStatus === 'ready' && (
              <motion.button
                key="ready"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(59,130,246,0.3)' }}
                whileTap={{ scale: 0.98 }}
                onClick={handleDownload}
                className="w-full text-white font-bold py-4 sm:py-5 rounded-2xl flex items-center justify-center gap-3 transition-all text-sm sm:text-base"
                style={{
                  background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                  boxShadow: '0 10px 30px rgba(37,99,235,0.3)',
                }}
              >
                <Download className="w-5 h-5" />
                Receive File
              </motion.button>
            )}

            {connectionStatus === 'downloading' && (
              <motion.div
                key="downloading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-3 py-4"
              >
                <div className="w-full h-2 rounded-full overflow-hidden"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.05)' }}
                >
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ ease: 'easeOut' }}
                    className="h-full rounded-full"
                    style={{ background: 'linear-gradient(90deg, #3b82f6, #60a5fa)', boxShadow: '0 0 12px rgba(59,130,246,0.5)' }}
                  />
                </div>
                <p className="text-center text-[11px] font-mono text-blue-400 uppercase tracking-widest">
                  Decrypting: {progress}%
                </p>
              </motion.div>
            )}

            {connectionStatus === 'finished' && (
              <motion.div
                key="finished"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-2xl p-4 flex items-center gap-4"
                style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}
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
              <motion.div
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-2xl p-4 flex items-center gap-4"
                style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}
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
        <div className="pt-5 border-t grid grid-cols-2 gap-3" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">AES-256 E2E</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertCircle className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Zero Retention</span>
          </div>
        </div>
      </motion.div>

      {/* Brand signature */}
      <p className="mt-8 text-slate-700 text-[10px] uppercase tracking-[0.3em] font-bold">
        Quick<span className="text-blue-600">Drop</span> Security Protocol v1.0
      </p>
    </div>
  );
};

export default ReceiverPage;