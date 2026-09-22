import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import api from "../../assets/Components/api/axios";
import {
  Plus, QrCode, Upload, Shield,
  Lock, Zap, ServerOff, CheckCircle2, X, Clock, Copy, Check,
  ChevronRight, Fingerprint, Download, ArrowRight
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
      alert("Failed to create room. Please try again.");
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
    { icon: <Lock className="w-5 h-5" />, title: "AES-256 Encryption", desc: "Files encrypted before transmission." },
    { icon: <Shield className="w-5 h-5" />, title: "E2E Protection", desc: "Zero interception, start to finish." },
    { icon: <ServerOff className="w-5 h-5" />, title: "Zero Storage", desc: "Server handles signaling only." },
    { icon: <Zap className="w-5 h-5" />, title: "Auto-Delete", desc: "Files removed post-transfer." }
  ];

  return (
    <div className="relative flex flex-col items-center overflow-hidden min-h-screen"
      style={{ background: 'linear-gradient(180deg, #020817 0%, #060f24 60%, #020817 100%)' }}
    >
      {/* Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-blue-600/6 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 left-0 w-64 h-64 bg-blue-900/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 right-0 w-64 h-64 bg-blue-900/8 blur-[100px] rounded-full pointer-events-none" />

      {/* ── HERO SECTION ── */}
      <section className="relative z-10 w-full max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 pb-16 flex flex-col items-center">

        {/* Badge */}
        <motion.div {...fadeInUp} className="mb-8">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-blue-400 text-xs font-bold uppercase tracking-[0.2em]"
            style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)' }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 pulse-dot" />
            Peer-to-Peer Encrypted
          </span>
        </motion.div>

        {/* Hero Headline */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-center mb-6 max-w-4xl"
        >
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white tracking-tight leading-[1.05]">
            Fast. Secure.{' '}
            <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text"
              style={{ backgroundImage: 'linear-gradient(135deg, #60a5fa, #3b82f6, #1d4ed8)' }}
            >
              No&nbsp;Login.
            </span>
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-slate-400 text-base sm:text-lg text-center mb-14 max-w-xl"
        >
          Share files instantly with 6-digit codes or QR. No accounts. No friction.
          Auto-deleted after transfer.
        </motion.p>

        {/* ── MAIN CARD AREA ── */}
        <AnimatePresence mode="wait">

          {/* ── CREATE ROOM STATE ── */}
          {roomOpened ? (
            <motion.div
              key="setup"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-md"
              style={{
                background: 'rgba(10,22,40,0.7)',
                backdropFilter: 'blur(24px)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '2rem',
                padding: '2rem',
              }}
            >
              <button
                onClick={() => setroomOpened(false)}
                className="mb-6 flex items-center gap-1.5 text-slate-500 hover:text-slate-300 text-sm transition-colors"
              >
                <X className="w-4 h-4" /> Cancel
              </button>

              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)' }}
                >
                  <Fingerprint className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white tracking-tight">Create Session</h2>
                  <p className="text-[10px] text-blue-400 uppercase tracking-[0.25em] font-bold">P2P Encrypted Tunnel</p>
                </div>
              </div>

              <div className="space-y-6 mb-8">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                    Room Name
                  </label>
                  <input
                    type="text"
                    placeholder="E.g. OFFICE_FILES"
                    value={roomName}
                    onChange={(e) => setroomName(e.target.value.toUpperCase())}
                    className="w-full rounded-xl px-4 py-4 font-mono text-blue-400 text-sm outline-none transition-all"
                    style={{
                      background: 'rgba(2,8,23,0.8)',
                      border: '1px solid rgba(255,255,255,0.08)',
                    }}
                    onFocus={e => e.target.style.borderColor = 'rgba(59,130,246,0.5)'}
                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: <Shield className="w-4 h-4 text-blue-400" />, label: "AES-256 E2E" },
                    { icon: <Clock className="w-4 h-4 text-blue-400" />, label: "1H Auto-Wipe" }
                  ].map(item => (
                    <div key={item.label} className="flex items-center gap-2.5 p-3 rounded-xl"
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
                    >
                      {item.icon}
                      <span className="text-[11px] font-bold uppercase text-slate-400 tracking-tighter">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={handleCreate}
                disabled={isCreating}
                className="w-full text-white font-black py-4 rounded-xl flex items-center justify-center gap-3 transition-all active:scale-98 group disabled:opacity-70"
                style={{
                  background: isCreating ? 'rgba(37,99,235,0.5)' : 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                  boxShadow: '0 8px 25px rgba(37,99,235,0.3)',
                }}
              >
                {isCreating ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Initialise Private Tunnel
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </motion.div>

          ) : !shareData ? (

            /* ── UPLOAD + CONNECT STATE ── */
            <motion.div
              key="upload-zone"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.35 }}
              className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-5 gap-5 mb-20"
            >
              {/* Drop Zone */}
              <motion.div
                onClick={handleFileUpload}
                whileHover={{ scale: 1.005 }}
                className="md:col-span-3 relative rounded-[2rem] flex flex-col items-center justify-center cursor-pointer transition-all group overflow-hidden"
                style={{
                  background: 'rgba(10,22,40,0.6)',
                  border: '2px dashed rgba(59,130,246,0.25)',
                  minHeight: '320px',
                  backdropFilter: 'blur(20px)',
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(59,130,246,0.55)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(59,130,246,0.25)'}
              >
                <div className="absolute inset-0 bg-blue-600/3 opacity-0 group-hover:opacity-100 transition-opacity rounded-[2rem]" />
                <div className="relative z-10 flex flex-col items-center px-6 text-center">
                  {uploading ? (
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-14 h-14 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                      <p className="text-blue-400 font-bold uppercase tracking-widest text-xs animate-pulse">Encrypting & Uploading...</p>
                    </div>
                  ) : (
                    <>
                      <div className="w-20 h-20 rounded-3xl flex items-center justify-center mb-6 group-hover:rotate-6 group-hover:scale-110 transition-all duration-500"
                        style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)' }}
                      >
                        <Upload className="w-10 h-10 text-blue-400" />
                      </div>
                      <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Drop file or click to upload</h2>
                      <p className="text-slate-500 text-sm">"No Signup. Just Share."</p>
                      <p className="mt-4 text-[11px] text-slate-600 uppercase tracking-widest">Any file type · Secure transfer</p>
                    </>
                  )}
                </div>
                <input type="file" ref={fileref} className="hidden" onChange={onFileChange} />
              </motion.div>

              {/* Right Panel */}
              <div className="md:col-span-2 flex flex-col gap-4">

                {/* Code Input Card */}
                <div className="rounded-[1.5rem] p-5 sm:p-6 flex-1"
                  style={{
                    background: 'rgba(10,22,40,0.7)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    backdropFilter: 'blur(20px)',
                  }}
                >
                  <div className="flex items-center gap-2.5 mb-4">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                      style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.15)' }}
                    >
                      <QrCode className="w-4 h-4 text-blue-400" />
                    </div>
                    <h3 className="text-base font-bold text-white">Get Connected</h3>
                  </div>

                  <input
                    type="text"
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                    maxLength={6}
                    placeholder="ENTER CODE"
                    className="w-full rounded-xl px-4 py-3.5 text-center font-mono tracking-[0.4em] text-blue-400 text-sm outline-none transition-all mb-4"
                    style={{
                      background: 'rgba(2,8,23,0.8)',
                      border: '1px solid rgba(255,255,255,0.07)',
                    }}
                    onFocus={e => e.target.style.borderColor = 'rgba(59,130,246,0.5)'}
                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.07)'}
                  />

                  <div className="flex gap-3">
                    <button
                      onClick={handleJoinRoom}
                      className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-blue-400 transition-all hover:text-white"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(59,130,246,0.1)'; e.currentTarget.style.borderColor = 'rgba(59,130,246,0.3)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; }}
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                    <button
                      onClick={handleActualRoomJoin}
                      className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-blue-400 transition-all hover:text-white"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(59,130,246,0.1)'; e.currentTarget.style.borderColor = 'rgba(59,130,246,0.3)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; }}
                    >
                      <ArrowRight className="w-4 h-4" />
                      Join Room
                    </button>
                  </div>
                </div>

                {/* Create Room Button */}
                <button
                  onClick={() => setroomOpened(true)}
                  className="w-full text-white font-bold py-4 rounded-[1.5rem] flex items-center justify-center gap-2.5 transition-all hover:opacity-90 active:scale-98"
                  style={{
                    background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                    boxShadow: '0 8px 25px rgba(37,99,235,0.25)',
                  }}
                >
                  <Plus className="w-5 h-5" />
                  Create Private Room
                </button>
              </div>
            </motion.div>

          ) : (

            /* ── SUCCESS / QR STATE ── */
            <motion.div
              key="share-zone"
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="w-full max-w-sm sm:max-w-md mb-20 relative"
              style={{
                background: 'rgba(10,22,40,0.8)',
                backdropFilter: 'blur(24px)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '2rem',
                padding: '2rem',
                boxShadow: '0 30px 60px rgba(0,0,0,0.4)',
              }}
            >
              <button
                onClick={() => setShareData(null)}
                className="absolute top-6 right-6 text-slate-600 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col items-center">
                {/* Secure badge */}
                <div className="flex items-center gap-2 mb-6 px-3 py-1.5 rounded-full"
                  style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)' }}
                >
                  <Shield className="w-3.5 h-3.5 text-blue-400" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400">Secure Channel Active</span>
                </div>

                {/* QR Code */}
                <div className="bg-white p-5 rounded-[1.5rem] mb-6 shadow-2xl">
                  <QRCodeSVG value={shareData.downloadUrl} size={180} level="H" />
                </div>

                {/* Access Code */}
                <div className="w-full rounded-2xl p-5 flex flex-col items-center mb-5"
                  style={{ background: 'rgba(2,8,23,0.6)', border: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-2">Access Code</span>
                  <div className="flex items-center gap-4">
                    <span className="text-4xl font-black tracking-[0.25em] text-white font-mono">{shareData.roomCode}</span>
                    <button onClick={handleCopy} className="transition-colors">
                      {copied
                        ? <Check className="w-5 h-5 text-emerald-400" />
                        : <Copy className="w-5 h-5 text-slate-500 hover:text-blue-400" />
                      }
                    </button>
                  </div>
                </div>

                {/* File meta */}
                <div className="w-full flex flex-wrap items-center justify-between gap-2 text-[11px] font-bold text-slate-600 uppercase">
                  <span className="truncate max-w-[60%]">{shareData.fileName} ({shareData.fileSize})</span>
                  <span className="text-blue-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Expires: 1h
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── SECURITY SECTION ── */}
        <motion.div {...fadeInUp} className="w-full max-w-5xl pt-8" id="security">
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-blue-400 text-[11px] font-bold uppercase tracking-widest mb-4"
              style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.15)' }}
            >
              <Shield className="w-3 h-3" /> Security First
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3 tracking-tight">Security-First Architecture</h2>
            <p className="text-slate-500 text-sm sm:text-base">Your data never touches our disks.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {securityCards.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{ y: -4 }}
                className="p-6 rounded-2xl text-left group cursor-default transition-all"
                style={{
                  background: 'rgba(10,22,40,0.6)',
                  border: '1px solid rgba(255,255,255,0.05)',
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(59,130,246,0.2)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 text-blue-400 group-hover:scale-110 transition-transform"
                  style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.15)' }}
                >
                  {item.icon}
                </div>
                <h4 className="text-white font-bold text-sm mb-1.5">{item.title}</h4>
                <p className="text-slate-500 text-xs leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* CTA row */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12"
          >
            <Link
              to="/FeaturePage"
              className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
              style={{ background: 'linear-gradient(135deg,#2563eb,#1d4ed8)', boxShadow: '0 8px 20px rgba(37,99,235,0.25)' }}
            >
              Explore All Features <ArrowRight className="w-4 h-4" />
            </Link>
            <button
              onClick={handleFileUpload}
              className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-slate-300 hover:text-white transition-all"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <Upload className="w-4 h-4" /> Quick Upload
            </button>
          </motion.div>
        </motion.div>

      </section>
    </div>
  );
};

export default Home;