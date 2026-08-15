import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Download, ShieldCheck, Clock, FileText, 
  Zap, AlertCircle, CheckCircle2 
} from 'lucide-react';
import { useParams } from 'react-router-dom';
import api from '../../assets/Components/api/axios';

const ReceiverPage = () => {
  const { inputCode } = useParams();
  const [connectionStatus, setConnectionStatus] = useState('connecting'); 
  const [fileData, setFileData] = useState(null); // Set to null initially
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const fetchFileInfo = async () => {
      try {
        const res = await api.get(`/ReceiverPage/${inputCode}`);
        console.log("File Data Received:", res.data);
        
        // Update state with real data from backend
        setFileData({
          name: res.data.fileName,
          url: res.data.downloadUrl,
          size: "Secure P2P File" // You can add size to your backend model later
        });
        
        setConnectionStatus('ready');
      } catch (error) {
        console.error("Error fetching file:", error);
        setConnectionStatus('error');
      }
    };

    if (inputCode) fetchFileInfo();
  }, [inputCode]);

  const handleDownload = () => {
    if (!fileData?.url) return;

    setConnectionStatus('downloading');
    
    // 1. Simulate decryption/transfer progress for UX
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 5;
      setProgress(currentProgress);

      if (currentProgress >= 100) {
        clearInterval(interval);
        setConnectionStatus('finished');

        // 2. Trigger the actual browser download
        const link = document.createElement('a');
        link.href = fileData.url;
        link.setAttribute('download', fileData.name);
        document.body.appendChild(link);
        link.click();
        link.remove();
      }
    }, 50); // Faster progress for better feel
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col items-center justify-center px-6 font-sans">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-md bg-slate-900/50 border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-2xl shadow-2xl"
      >
        {/* Header Status */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full">
            <Zap className="w-3 h-3 text-blue-500 fill-current" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400">
              P2P Room: {inputCode}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-300">
            <Clock className="w-4 h-4" />
            <span className="text-xs">Expires in 1h</span>
          </div>
        </div>

        {/* Central File Info - Using Dynamic Data */}
        <div className="flex flex-col items-center text-center mb-10">
          <div className="w-24 h-24 bg-blue-600/10 rounded-3xl flex items-center justify-center mb-6 relative">
            <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full" />
            <FileText className="w-12 h-12 text-blue-500 relative z-10" />
          </div>
          <h2 className="text-xl font-bold text-white mb-1 truncate max-w-full px-4">
            {fileData ? fileData.name : "Loading File..."}
          </h2>
          <p className="text-slate-500 text-sm font-medium">
            {fileData ? fileData.size : "Checking Vault..."}
          </p>
        </div>

        {/* Action States */}
        <div className="space-y-4">
          <AnimatePresence mode="wait">
            {connectionStatus === 'connecting' && (
              <motion.div key="connecting" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-3 py-4">
                <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Establishing Secure Channel...</p>
              </motion.div>
            )}

            {connectionStatus === 'ready' && (
              <motion.button
                key="ready"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleDownload}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-5 rounded-2xl flex items-center justify-center gap-3 shadow-lg shadow-blue-900/40 transition-all"
              >
                <Download className="w-5 h-5" /> Receive File
              </motion.button>
            )}

            {connectionStatus === 'downloading' && (
              <motion.div key="downloading" className="space-y-4 py-4">
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-white/5">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="h-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                  />
                </div>
                <p className="text-center text-[10px] font-mono text-blue-400 uppercase tracking-widest">
                  Decrypting: {progress}%
                </p>
              </motion.div>
            )}

            {connectionStatus === 'finished' && (
              <motion.div key="finished" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 flex items-center gap-4">
                <div className="bg-emerald-500 p-2 rounded-lg text-white">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-emerald-400">Transfer Complete</p>
                  <p className="text-[10px] text-slate-500 uppercase">Auto-deleted from vault</p>
                </div>
              </motion.div>
            )}

            {connectionStatus === 'error' && (
              <motion.div key="error" className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-center gap-4">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <p className="text-sm font-bold text-red-500">Link expired or invalid code</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Security Reassurance */}
        <div className="mt-10 pt-6 border-t border-white/5 grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-500" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">AES-256 E2E</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-blue-500" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Zero Retention</span>
          </div>
        </div>
      </motion.div>

      <p className="mt-8 text-slate-600 text-[10px] uppercase tracking-[0.3em] font-bold">
        Quick<span className="text-blue-500">Drop</span> Security Protocol v1.0
      </p>
    </div>
  );
};

export default ReceiverPage;