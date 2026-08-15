import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import api from "../../assets/Components/api/axios"
import axios from 'axios';
import {
  Plus, QrCode, Share2, Upload, Shield,
  Lock, Zap, ServerOff, Monitor, Smartphone,
  Cpu, CheckCircle2, X, Download, Clock, Copy, Check,
  ChevronRight,
  Fingerprint
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

const Home = () => {
  const fileref = useRef(null);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [shareData, setShareData] = useState(null); // Stores { downloadUrl, roomCode, fileName }
  const [copied, setCopied] = useState(false);
  const [roomOpened, setroomOpened] = useState(false)
  const [roomName, setroomName] = useState()
  const [inputCode, setInputCode] = useState("");
  const [isCreating, setisCreating] = useState()
  const navigate = useNavigate();

  // Trigger file selection
  const handleFileUpload = () => {
    fileref.current.click();
  };

  // Handle file selection and API upload
  const onFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setUploading(true);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      // Hits the endpoint we set up in your index.js and file.route.js
      const response = await api.post("/", formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      // Data from your file.controller.js
      setShareData({
        ...response.data,
        fileName: selectedFile.name,
        fileSize: (selectedFile.size / (1024 * 1024)).toFixed(2) + " MB"
      });
      setUploading(false);
    } catch (error) {
      console.error("Upload Error:", error);
      alert("Failed to upload file to the vault.");
      setUploading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shareData.roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  const handleJoinRoom = async () => {
    if (inputCode.length == 6) {
      navigate(`/ReceiverPage/${inputCode}`)
    }
    else {
      alert("Enter a valid 6 digit code")
      console.log("Enter a valid 6 digit code")
    }
  }

  const [roomCodenew, setroomCodenew] = useState()

  const handleCreate = async () => {
    console.log("Handle create room")
    console.log("NAME o froom is ", roomName)
    try {
      const res = await api.post("/createroom", { roomName: roomName })
      console.log(res)
      const roomnum = res.data.roomCode

      navigate(`/RoomDashboard/${roomnum}`)

    } catch (error) {
      console.log("Error at handlecreate at home page")
      console.log(error)
    }
  }

  const handleroom = () => {
    console.log("clicked")
    setroomOpened(true);
  }

  const handleActualRoomJoin = async ()=>{
    if (inputCode.length == 6 ){
      navigate(`/RoomDashboard/${inputCode}`)
    }
    else{
      alert("Enter a valid input code")
      console.log("Invalid room code entered")
    }
  }

  return (
    <div className="relative bg-slate-950 flex flex-col items-center px-6 overflow-hidden selection:bg-blue-500/30 min-h-screen">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />

      {/* --- HERO & UPLOAD SECTION --- */}
      <section className="relative pt-20 pb-20 z-10 w-full max-w-7xl flex flex-col items-center">
        <motion.div {...fadeInUp} className="text-center mb-16">
          <span className="px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-[0.2em] mb-6 inline-block">
            Peer-to-Peer Encrypted
          </span>
          <h1 className="text-6xl md:text-8xl font-black text-white mb-6 tracking-tight">
            Fast. Secure. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">No Login.</span>
          </h1>
        </motion.div>

        <AnimatePresence mode="wait">
          {
            roomOpened ? (<motion.div
              key="setup"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="flex flex-col"
            >
              <div className="flex items-center gap-4 mb-10">
                <div className="p-4 bg-blue-600/10 rounded-2xl border border-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.1)]">
                  <Fingerprint className="w-8 h-8 text-blue-500" />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-white tracking-tight">Create Session</h2>
                  <p className="text-[10px] text-blue-500 uppercase tracking-[0.3em] font-bold">P2P Encrypted Tunnel</p>
                </div>
              </div>

              <div className="space-y-8 mb-12">
                <div className="space-y-3">
                  {/* Updated Label to ask for Room Name */}
                  <label className="text-[10px] font-bold text-slate-300 uppercase tracking-widest ml-1">
                    What would you like to name this room?
                  </label>
                  <input
                    type="text"
                    placeholder="E.G. OFFICE_FILES or PROJECT_ALPHA"
                    value={roomName}
                    onChange={(e) => setroomName(e.target.value.toUpperCase())}
                    className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-5 text-blue-400 font-mono focus:border-blue-500/50 outline-none transition-all placeholder:text-slate-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-5 bg-slate-950/50 rounded-2xl border border-white/5 flex items-center gap-3 group hover:border-blue-500/20 transition-colors">
                    <Shield className="w-5 h-5 text-blue-500" />
                    <span className="text-[11px] font-bold uppercase text-slate-400 tracking-tighter">AES-256 E2E</span>
                  </div>
                  <div className="p-5 bg-slate-950/50 rounded-2xl border border-white/5 flex items-center gap-3 group hover:border-blue-500/20 transition-colors">
                    <Clock className="w-5 h-5 text-blue-500" />
                    <span className="text-[11px] font-bold uppercase text-slate-400 tracking-tighter">1H Auto-Wipe</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCreate}
                disabled={isCreating}
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-black py-6 rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-blue-900/40 transition-all active:scale-95 group"
              >
                {isCreating ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Initialise Private Tunnel <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>
                )}
              </button>
            </motion.div>)

              : !shareData ? (
                /* --- UPLOAD STATE --- */
                <motion.div
                  key="upload-zone"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="w-full max-w-4xl grid md:grid-cols-5 gap-6 mb-24"
                >
                  <motion.div
                    onClick={handleFileUpload}
                    whileHover={{ scale: 1.01 }}
                    className="md:col-span-3 bg-slate-900/40 border-2 border-dashed border-blue-500/30 rounded-[2.5rem] p-12 flex flex-col items-center justify-center relative group cursor-pointer transition-all hover:border-blue-500/60 h-[400px]"
                  >
                    <div className="absolute inset-0 bg-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-[2.5rem]" />
                    <div className="relative z-10 flex flex-col items-center">
                      {uploading ? (
                        <div className="flex flex-col items-center gap-4">
                          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                          <p className="text-blue-500 font-bold uppercase tracking-widest text-xs animate-pulse">Encrypting & Uploading...</p>
                        </div>
                      ) : (
                        <>
                          <div className="w-20 h-20 bg-blue-600/10 rounded-3xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform duration-500">
                            <Upload className="w-10 h-10 text-blue-500" />
                          </div>
                          <h2 className="text-2xl font-bold text-white mb-2">Click or drag files</h2>
                          <p className="text-slate-500 text-sm italic">"No Signup. Just Share."</p>
                        </>
                      )}
                    </div>
                    <input type="file" ref={fileref} className="hidden" onChange={onFileChange} />
                  </motion.div>

                  <div className="md:col-span-2 flex flex-col gap-6">
                    <div className="bg-slate-900/60 border border-white/5 rounded-[2rem] p-8 flex-1 backdrop-blur-xl">
                      <QrCode className="w-8 h-8 text-blue-500 mb-4" />
                      <h3 className="text-lg font-bold text-white mb-2">Let's get connected</h3>
                      <div className="relative">
                        <input
                          type="text"
                          value={inputCode}
                          onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                          maxLength={6}
                          placeholder="ENTER CODE"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-4 text-center font-mono tracking-[0.5em] text-blue-400 outline-none focus:border-blue-500/50 transition-all pr-12"
                        />
                        {/* Quick Join Arrow inside the input */}
                        {/* <button
                          onClick={handleJoinRoom}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-blue-500 transition-colors p-1"
                        >
                          <ChevronRight className="w-6 h-6" />
                        </button> */}
                      </div>

                      <p className="mt-4 text-[10px] text-slate-200 uppercase tracking-widest text-center">
                        Instant connection via unique codes
                      </p>
                    </div>
                 <div className='flex items-center justify-around'>
                     <button
                      onClick={handleJoinRoom} // Big Join Button
                      className="bg-slate-900 hover:bg-slate-800 border border-white/5 text-blue-500 font-bold py-6 rounded-[2rem] transition-all flex items-center justify-center gap-3 group"
                    >
                      <Zap className="w-6 h-6 group-hover:fill-blue-500 transition-all" />
                     Downlaod your file
                    </button>
                     <button
                      onClick={handleActualRoomJoin} // Big Join Button
                      className="bg-slate-900 hover:bg-slate-800 border border-white/5 text-blue-500 font-bold py-6 rounded-[2rem] transition-all flex items-center justify-center gap-3 group"
                    >
                      <Zap className="w-6 h-6 group-hover:fill-blue-500 transition-all" />
                     Join room
                    </button>
                 </div>

                    <button onClick={() => { handleroom() }} className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-6 rounded-[2rem] shadow-xl shadow-blue-900/20 transition-all flex items-center justify-center gap-3">
                      <Plus className="w-6 h-6" /> Create Private Room
                    </button>

                  </div>
                </motion.div>
              ) : (
                /* --- SUCCESS / QR STATE --- */
                <motion.div
                  key="share-zone"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full max-w-xl bg-slate-900/40 border border-white/10 rounded-[3rem] p-10 backdrop-blur-2xl shadow-2xl relative mb-24"
                >
                  <button onClick={() => setShareData(null)} className="absolute top-8 right-8 text-slate-500 hover:text-white transition-colors">
                    <X className="w-6 h-6" />
                  </button>

                  <div className="flex flex-col items-center">
                    <div className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-4 py-1.5 rounded-full mb-8">
                      <Shield className="w-4 h-4 text-blue-500" />
                      <span className="text-[11px] font-bold uppercase tracking-widest text-blue-400">Secure Channel Active [cite: 60]</span>
                    </div>

                    <div className="bg-white p-6 rounded-[2.5rem] mb-10 shadow-2xl">
                      <QRCodeSVG value={shareData.downloadUrl} size={200} level="H" />
                    </div>

                    <div className="w-full bg-slate-950/50 border border-white/5 rounded-2xl p-6 flex flex-col items-center mb-8">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Access Code</span>
                      <div className="flex items-center gap-4">
                        <span className="text-4xl font-black tracking-[0.2em] text-white font-mono">{shareData.roomCode}</span>
                        <button onClick={handleCopy} className="text-blue-500">
                          {copied ? <Check className="w-6 h-6 text-emerald-500" /> : <Copy className="w-6 h-6" />}
                        </button>
                      </div>
                    </div>

                    <div className="w-full flex items-center justify-between px-2 text-[11px] font-bold text-slate-500 uppercase">
                      <span>{shareData.fileName} ({shareData.fileSize})</span>
                      <span className="text-blue-500 flex items-center gap-1"><Clock className="w-3 h-3" /> Expires: 1h</span>
                    </div>
                  </div>
                </motion.div>
              )}
        </AnimatePresence>



        {/* --- SECURITY FLOW & OTHER SECTIONS (Kept as in your previous version) --- */}
        <motion.div {...fadeInUp} className="w-full max-w-7xl pt-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4 tracking-tight">Security-First Architecture</h2>
            <p className="text-slate-400">Your data never touches our disks.</p>
          </div>
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { icon: <Lock />, title: "Encryption", desc: "Files encrypted with AES before transmission. [cite: 59]" },
              { icon: <Shield />, title: "E2E Protection", desc: "Zero data interception from initiation to deletion. [cite: 63]" },
              { icon: <ServerOff />, title: "Zero Storage", desc: "Our server only handles signaling, not files. [cite: 46]" },
              { icon: <Zap />, title: "Auto-Delete", desc: "Devices auto-delete files post-transfer. [cite: 62]" }
            ].map((item, i) => (
              <div key={i} className="p-8 rounded-3xl bg-slate-900/30 border border-white/5 hover:border-blue-500/20 transition-all group text-left">
                <div className="text-blue-500 mb-4 group-hover:scale-110 transition-transform">{item.icon}</div>
                <h4 className="text-white font-bold mb-2">{item.title}</h4>
                <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;