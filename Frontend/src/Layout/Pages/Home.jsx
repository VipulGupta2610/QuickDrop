import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import api from "../../assets/Components/api/axios";
import {
  Plus, QrCode, Shield,
  Lock, Zap, ServerOff, X, Clock, Copy, Check,
  ChevronRight, Fingerprint, Download, ArrowRight, UploadCloud, FolderLock
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

const Home = () => {
  const fileref = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [shareData, setShareData] = useState(null);
  const [copied, setCopied] = useState(false);
  const [roomOpened, setroomOpened] = useState(false);
  const [roomName, setroomName] = useState('');
  const [inputCode, setInputCode] = useState('');
  const [isCreating, setisCreating] = useState(false);
  const navigate = useNavigate();

  const handleFileUpload = () => fileref.current.click();

  const onFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);
    try {
      const response = await api.post("/", formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setShareData({
        ...response.data,
        fileName: selectedFile.name,
        fileSize: (selectedFile.size / (1024 * 1024)).toFixed(2) + " MB"
      });
    } catch (error) {
      console.error("Upload Error:", error);
      alert("Failed to upload file to the vault.");
    } finally {
      setUploading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shareData.roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleJoinRoom = () => {
    if (inputCode.length === 6) navigate(`/ReceiverPage/${inputCode}`);
    else alert("Enter a valid 6-digit code");
  };

  const handleCreate = async () => {
    if (!roomName.trim()) { alert("Please enter a room name"); return; }
    setisCreating(true);
    try {
      const res = await api.post("/createroom", { roomName });
      navigate(`/RoomDashboard/${res.data.roomCode}`);
    } catch (error) {
      console.error("Error creating room:", error);
      alert("Failed to create room.");
    } finally {
      setisCreating(false);
    }
  };

  const handleActualRoomJoin = () => {
    if (inputCode.length === 6) navigate(`/RoomDashboard/${inputCode}`);
    else alert("Enter a valid 6-digit room code");
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  const securityCards = [
    { icon: <Lock className="w-6 h-6" />, title: "AES-256 Encryption", desc: "Military-grade encryption applied locally before transmission." },
    { icon: <Shield className="w-6 h-6" />, title: "E2E Protection", desc: "Absolute privacy. Zero data interception guaranteed." },
    { icon: <ServerOff className="w-6 h-6" />, title: "Zero Storage", desc: "Our servers route data, but never store your files." },
    { icon: <Zap className="w-6 h-6" />, title: "Auto-Delete", desc: "Files vanish completely the moment the transfer completes." }
  ];

  return (
    <div className="relative flex flex-col items-center min-h-screen pt-12 sm:pt-20 pb-24 px-4 sm:px-6 lg:px-8">
      
      {/* ─── HERO ─── */}
      <section className="relative z-10 w-full max-w-6xl mx-auto flex flex-col items-center">
        
        <motion.div {...fadeInUp} className="mb-6">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 backdrop-blur-md border border-blue-500/30 text-blue-300 text-[11px] font-bold tracking-widest uppercase shadow-[0_0_20px_rgba(59,130,246,0.3)] animate-pulse">
            <Shield className="w-4 h-4" />
            Peer-to-Peer Encrypted
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-center mb-6 max-w-4xl"
        >
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-tight leading-tight">
            Fast. Secure. <span className="bg-gradient-to-br from-blue-400 to-purple-400 bg-clip-text text-transparent">No Login.</span>
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-slate-300 text-lg sm:text-xl text-center mb-16 max-w-2xl leading-relaxed"
        >
          Share files instantly with a 6-digit code or QR code. No accounts, no friction. Auto-deleted after transfer.
        </motion.p>

        {/* ─── MAIN INTERACTIVE AREA ─── */}
        <div className="w-full max-w-5xl mx-auto mb-24">
          <AnimatePresence mode="wait">

            {/* ═══ CREATE ROOM PANEL ═══ */}
            {roomOpened ? (
              <motion.div
                key="setup"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.05)] w-full max-w-xl mx-auto p-8 sm:p-10 relative"
              >
                <button onClick={() => setroomOpened(false)} className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors">
                  <X className="w-6 h-6" />
                </button>

                <div className="flex flex-col items-center text-center mb-10">
                  <div className="flex items-center justify-center bg-gradient-to-br from-blue-500/20 to-purple-600/20 border border-white/10 text-blue-300 rounded-2xl transition-transform duration-300 w-16 h-16 mb-4">
                    <FolderLock className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-2">Create Private Session</h2>
                  <p className="text-sm text-blue-400 font-medium">Establish a secure P2P encrypted tunnel</p>
                </div>

                <div className="space-y-8 mb-10">
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-3 ml-1">Session Name</label>
                    <input
                      type="text"
                      placeholder="e.g. PROJECT_FILES"
                      value={roomName}
                      onChange={(e) => setroomName(e.target.value.toUpperCase())}
                      className="w-full bg-slate-950/70 border border-white/10 text-slate-50 rounded-2xl transition-all duration-300 focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-400/15 focus:bg-slate-900/80 placeholder:text-slate-500 font-mono px-6 py-5 text-xl tracking-widest text-center"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.05)] p-4 flex flex-col items-center justify-center gap-2">
                      <Shield className="w-6 h-6 text-blue-400" />
                      <span className="text-sm font-bold text-slate-300">AES-256 E2E</span>
                    </div>
                    <div className="bg-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.05)] p-4 flex flex-col items-center justify-center gap-2">
                      <Clock className="w-6 h-6 text-purple-400" />
                      <span className="text-sm font-bold text-slate-300">1H Auto-Wipe</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleCreate}
                  disabled={isCreating}
                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-br from-blue-600 to-indigo-500 text-white font-semibold rounded-2xl transition-all duration-300 shadow-[0_4px_15px_rgba(37,99,235,0.3),inset_0_1px_0_rgba(255,255,255,0.2)] hover:shadow-[0_8px_25px_rgba(37,99,235,0.5),inset_0_1px_0_rgba(255,255,255,0.3)] hover:-translate-y-0.5 hover:brightness-110 active:scale-95 w-full py-5 text-xl font-bold shadow-lg"
                >
                  {isCreating ? (
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>Initialise Tunnel <ChevronRight className="w-6 h-6 ml-2" /></>
                  )}
                </button>
              </motion.div>

            ) : !shareData ? (

              /* ═══ UPLOAD + CONNECT PANEL ═══ */
              <motion.div
                key="upload-zone"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.05)] w-full overflow-hidden"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-white/10">
                  
                  {/* ── Left: Upload ── */}
                  <div className="p-8 sm:p-12 flex flex-col">
                    <div className="mb-8">
                      <h3 className="text-2xl font-bold text-white mb-2">Send Files</h3>
                      <p className="text-slate-400">Share files instantly via secure P2P.</p>
                    </div>

                    <div
                      onClick={handleFileUpload}
                      className="flex-1 bg-slate-900/40 backdrop-blur-lg border-2 border-dashed border-blue-400/30 rounded-[2rem] transition-all duration-300 hover:border-blue-400/80 hover:bg-slate-800/60 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] flex flex-col items-center justify-center cursor-pointer p-8 relative group min-h-[300px]"
                    >
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl group-hover:bg-blue-500/30 transition-all duration-500"></div>
                      
                      <div className="relative z-10 flex flex-col items-center text-center w-full">
                        {uploading ? (
                          <div className="flex flex-col items-center gap-6">
                            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                            <p className="text-blue-400 font-bold uppercase tracking-widest text-sm animate-pulse">Encrypting...</p>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-center justify-center bg-gradient-to-br from-blue-500/20 to-purple-600/20 border border-white/10 text-blue-300 rounded-2xl transition-transform duration-300 w-20 h-20 mb-6 group-hover:scale-110 group-hover:-translate-y-2 transition-transform duration-500">
                              <UploadCloud className="w-10 h-10 text-white" />
                            </div>
                            <h4 className="text-xl font-bold text-white mb-3">Click or Drag Files</h4>
                            <p className="text-slate-400 text-sm mb-6 max-w-xs">Any file type supported. Zero size limits.</p>
                            <div className="inline-flex items-center justify-center gap-2 bg-white/5 border border-white/10 text-slate-300 font-semibold rounded-2xl transition-all duration-300 hover:bg-blue-400/10 hover:border-blue-400/30 hover:text-white hover:-translate-y-0.5 px-6 py-2 pointer-events-none">
                              Select File
                            </div>
                          </>
                        )}
                      </div>
                      <input type="file" ref={fileref} className="hidden" onChange={onFileChange} />
                    </div>
                  </div>

                  {/* ── Right: Connect ── */}
                  <div className="p-8 sm:p-12 flex flex-col bg-slate-900/20">
                    <div className="mb-8">
                      <h3 className="text-2xl font-bold text-white mb-2">Receive Files</h3>
                      <p className="text-slate-400">Enter a code or join a private room.</p>
                    </div>

                    <div className="flex-1 flex flex-col justify-center space-y-8">
                      <div>
                        <label className="block text-sm font-semibold text-slate-300 mb-3 ml-1">Transfer Code</label>
                        <input
                          type="text"
                          value={inputCode}
                          onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                          maxLength={6}
                          placeholder="e.g. 123456"
                          className="w-full bg-slate-950/70 border border-white/10 text-slate-50 rounded-2xl transition-all duration-300 focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-400/15 focus:bg-slate-900/80 placeholder:text-slate-500 font-mono px-6 py-5 text-center tracking-[0.2em] text-2xl font-bold mb-4"
                        />
                        <div className="grid grid-cols-2 gap-4">
                          <button onClick={handleJoinRoom} className="inline-flex items-center justify-center gap-2 bg-gradient-to-br from-blue-600 to-indigo-500 text-white font-semibold rounded-2xl transition-all duration-300 shadow-[0_4px_15px_rgba(37,99,235,0.3),inset_0_1px_0_rgba(255,255,255,0.2)] hover:shadow-[0_8px_25px_rgba(37,99,235,0.5),inset_0_1px_0_rgba(255,255,255,0.3)] hover:-translate-y-0.5 hover:brightness-110 active:scale-95 py-4 text-base shadow-md">
                            <Download className="w-4 h-4 mr-2" /> Download
                          </button>
                          <button onClick={handleActualRoomJoin} className="inline-flex items-center justify-center gap-2 bg-white/5 border border-white/10 text-slate-300 font-semibold rounded-2xl transition-all duration-300 hover:bg-blue-400/10 hover:border-blue-400/30 hover:text-white hover:-translate-y-0.5 py-4 text-base bg-white/5">
                            Join Room <ArrowRight className="w-4 h-4 ml-2" />
                          </button>
                        </div>
                      </div>

                      <div className="relative flex items-center py-2">
                        <div className="flex-grow border-t border-white/10"></div>
                        <span className="flex-shrink-0 mx-4 text-slate-500 text-sm font-medium uppercase tracking-wider">or</span>
                        <div className="flex-grow border-t border-white/10"></div>
                      </div>

                      <button onClick={() => setroomOpened(true)} className="inline-flex items-center justify-center gap-2 bg-white/5 border border-white/10 text-slate-300 font-semibold rounded-2xl transition-all duration-300 hover:bg-blue-400/10 hover:border-blue-400/30 hover:text-white hover:-translate-y-0.5 w-full py-5 text-lg border-blue-500/30 text-blue-400 hover:text-white hover:bg-blue-500/20">
                        <Plus className="w-5 h-5 mr-2" /> Create Private Session
                      </button>
                    </div>
                  </div>

                </div>
              </motion.div>

            ) : (

              /* ═══ SUCCESS / QR CODE ═══ */
              <motion.div
                key="share-zone"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.05)] w-full max-w-xl mx-auto p-10 relative"
              >
                <button onClick={() => setShareData(null)} className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors">
                  <X className="w-6 h-6" />
                </button>

                <div className="flex flex-col items-center text-center">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 backdrop-blur-md border border-blue-500/30 text-blue-300 text-[11px] font-bold tracking-widest uppercase mb-10 animate-pulse-glow">
                    <Shield className="w-4 h-4" />
                    Secure Channel Active
                  </div>

                  <div className="bg-white p-8 rounded-[2rem] mb-10 shadow-2xl hover:scale-105 transition-transform duration-300">
                    <QRCodeSVG value={shareData.downloadUrl} size={220} level="H" />
                  </div>

                  <div className="w-full bg-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.05)] !bg-slate-900/50 p-6 flex flex-col items-center mb-8 border-dashed">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Access Code</span>
                    <div className="flex items-center gap-5">
                      <span className="text-5xl font-black tracking-[0.2em] text-white font-mono">{shareData.roomCode}</span>
                      <button onClick={handleCopy} className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors">
                        {copied ? <Check className="w-7 h-7 text-emerald-400" /> : <Copy className="w-7 h-7 text-blue-400" />}
                      </button>
                    </div>
                  </div>

                  <div className="w-full flex items-center justify-between px-4 py-3 bg-white/5 rounded-xl text-sm font-bold text-slate-300">
                    <span className="truncate max-w-[65%] flex items-center gap-3">
                      <Download className="w-5 h-5 text-blue-400" />
                      {shareData.fileName}
                    </span>
                    <span className="flex items-center gap-2 text-purple-400">
                      <Clock className="w-4 h-4" /> 1h
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ─── SECURITY SECTION ─── */}
        <motion.div {...fadeInUp} className="w-full max-w-6xl pt-20 border-t border-white/10" id="security">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Security-First Architecture</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">Your data is yours alone. Everything is ephemeral, encrypted, and leaves no trace.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {securityCards.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="bg-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.05)] transition-all duration-300 hover:bg-slate-800/70 hover:border-blue-400/30 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.1)] p-8 text-left group"
              >
                <div className="flex items-center justify-center bg-gradient-to-br from-blue-500/20 to-purple-600/20 border border-white/10 text-blue-300 rounded-2xl transition-transform duration-300 w-14 h-14 mb-6 text-white">
                  {item.icon}
                </div>
                <h4 className="text-white font-bold text-lg mb-3">{item.title}</h4>
                <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
          
          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-20">
            <Link to="/FeaturePage" className="inline-flex items-center justify-center gap-2 bg-gradient-to-br from-blue-600 to-indigo-500 text-white font-semibold rounded-2xl transition-all duration-300 shadow-[0_4px_15px_rgba(37,99,235,0.3),inset_0_1px_0_rgba(255,255,255,0.2)] hover:shadow-[0_8px_25px_rgba(37,99,235,0.5),inset_0_1px_0_rgba(255,255,255,0.3)] hover:-translate-y-0.5 hover:brightness-110 active:scale-95 px-10 py-4 text-lg">
              Explore All Features <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </motion.div>

      </section>
    </div>
  );
};

export default Home;