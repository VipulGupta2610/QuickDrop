import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FileText, Download, Users, Zap,
  ChevronLeft, FilePlus, Loader2,
  Copy, CheckCircle, XCircle, Shield, Clock, Menu, X, Eye
} from 'lucide-react';
import api from '../../assets/Components/api/axios';

const RoomDashboard = () => {
  const { roomnum } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [uploadStatus, setUploadStatus] = useState("idle");
  const [files, setFiles] = useState([]);
  const [roomInfo, setRoomInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [tick, settick] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const fetchRoomData = async () => {
    try {
      const res = await api.get(`/RoomDashboard/${roomnum}`);
      if (res.data.room) {
        setFiles(res.data.room.files || []);
        setRoomInfo(res.data.room);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (roomnum) fetchRoomData();
    const interval = setInterval(fetchRoomData, 10000);
    return () => clearInterval(interval);
  }, [roomnum]);

  const copytext = async () => {
    try {
      await navigator.clipboard.writeText(roomnum);
      settick(true);
      setTimeout(() => settick(false), 2000);
    } catch {
      alert(`Room Code: ${roomnum}`);
    }
  };

  const handleFileUpload = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    setIsUploading(true);
    setUploadStatus("idle");
    const formData = new FormData();
    formData.append('file', selectedFile);
    try {
      await api.post(`/RoomDashboard/${roomnum}`, formData);
      setUploadStatus("success");
      fetchRoomData();
    } catch {
      setUploadStatus("error");
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadStatus("idle"), 2000);
    }
  };

  const downloadFile = async (url, fileName) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.setAttribute('download', fileName || 'quickdrop-file');
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(blobUrl), 5000);
    } catch (error) {
      console.error("Download error:", error);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName || 'quickdrop-file');
      link.setAttribute('target', '_blank');
      document.body.appendChild(link);
      link.click();
      link.remove();
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-blue-400" />
          <p className="text-slate-500 text-sm uppercase tracking-widest">Loading Room...</p>
        </div>
      </div>
    );
  }

  const SidebarContent = () => (
    <div className="flex flex-col justify-between h-full">
      <div>
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-sm text-slate-500 hover:text-white transition-colors group"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back
        </button>

        <div className="mb-6">
          <h1 className="text-xl font-bold text-white truncate mb-1">
            {roomInfo?.roomName || "Room"}
          </h1>
          <p className="text-xs text-slate-500">Secure File Space</p>
        </div>

        {/* Room Code */}
        <div
          onClick={copytext}
          className="rounded-xl p-4 cursor-pointer transition-all mb-6 group"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
          onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(59,130,246,0.3)'}
          onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'}
        >
          <p className="text-[11px] text-slate-500 uppercase tracking-widest mb-2">Room Code</p>
          <div className="flex items-center justify-between">
            <span className="font-mono text-xl text-white tracking-wider">{roomnum}</span>
            {tick
              ? <CheckCircle className="w-4 h-4 text-emerald-400" />
              : <Copy className="w-4 h-4 text-slate-500 group-hover:text-blue-400 transition-colors" />
            }
          </div>
        </div>

        {/* Room Info Tags */}
        <div className="space-y-2.5">
          {[
            { icon: <Users className="w-3.5 h-3.5" />, label: "Collaborative Access" },
            { icon: <Zap className="w-3.5 h-3.5" />, label: "10s Auto Refresh" },
            { icon: <Shield className="w-3.5 h-3.5" />, label: "E2E Encrypted" },
            { icon: <Clock className="w-3.5 h-3.5" />, label: "Auto-delete: 1h" },
          ].map(tag => (
            <div key={tag.label} className="flex items-center gap-2.5 text-xs text-slate-500">
              <span className="text-blue-400">{tag.icon}</span>
              {tag.label}
            </div>
          ))}
        </div>
      </div>

      <div className="pt-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
        <p className="text-xs text-slate-600">{files.length} file{files.length !== 1 ? 's' : ''} shared</p>
      </div>
    </div>
  );

  return (
    <div className="h-screen flex overflow-hidden text-slate-200">

      {/* ── SIDEBAR (Desktop) ── */}
      <aside
        className="hidden md:flex flex-col w-64 lg:w-72 flex-shrink-0 p-6 border-r"
        style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(5,12,30,0.8)' }}
      >
        <SidebarContent />
      </aside>

      {/* ── MOBILE SIDEBAR OVERLAY ── */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-72 z-50 md:hidden p-6 flex flex-col border-r"
              style={{ background: '#050c1e', borderColor: 'rgba(255,255,255,0.07)' }}
            >
              <button
                onClick={() => setSidebarOpen(false)}
                className="absolute top-4 right-4 text-slate-500 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── MAIN CONTENT ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Top Bar */}
        <div
          className="flex-shrink-0 h-14 flex items-center justify-between px-4 sm:px-6 border-b"
          style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(5,12,30,0.6)' }}
        >
          <div className="flex items-center gap-3">
            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-1.5 text-slate-500 hover:text-white transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <span className="text-sm font-semibold text-white hidden sm:inline">{roomInfo?.roomName || 'Room'}</span>
              <span className="text-xs text-slate-500 hidden sm:inline mx-2">·</span>
              <span className="text-xs text-slate-500">Shared Files</span>
            </div>
          </div>

          {/* Upload trigger */}
          <button
            onClick={() => !isUploading && fileInputRef.current?.click()}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-blue-400 transition-all"
            style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.15)' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(59,130,246,0.4)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(59,130,246,0.15)'}
          >
            {isUploading
              ? <Loader2 className="w-4 h-4 animate-spin" />
              : uploadStatus === 'success'
              ? <CheckCircle className="w-4 h-4 text-emerald-400" />
              : uploadStatus === 'error'
              ? <XCircle className="w-4 h-4 text-red-400" />
              : <FilePlus className="w-4 h-4" />
            }
            <span className="hidden sm:inline">Upload File</span>
          </button>
          <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} />
        </div>

        {/* File List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {files.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center h-full gap-4 text-center"
            >
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px dashed rgba(255,255,255,0.1)' }}
              >
                <FilePlus className="w-8 h-8 text-slate-600" />
              </div>
              <div>
                <p className="text-slate-500 text-sm font-medium">No files yet</p>
                <p className="text-slate-700 text-xs mt-1">Upload a file to share with the room</p>
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 rounded-xl text-sm font-bold text-blue-400 transition-all mt-2"
                style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)' }}
              >
                Upload First File
              </button>
            </motion.div>
          ) : (
            <div className="space-y-2.5 max-w-3xl">
              <AnimatePresence>
                {files.map((file, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="flex items-center justify-between px-4 py-3.5 rounded-xl group transition-all"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.05)' }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(59,130,246,0.2)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: 'rgba(59,130,246,0.1)' }}
                      >
                        <FileText className="w-4 h-4 text-blue-400" />
                      </div>
                      <span className="text-sm text-slate-300 truncate">{file.fileName}</span>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                      <a
                        href={file.downloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-500 hover:text-white hover:text-purple-400 transition-all cursor-pointer"
                        style={{ background: 'rgba(255,255,255,0.04)' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(147,51,234,0.1)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">View</span>
                      </a>
                      
                      <button
                        onClick={() => downloadFile(file.downloadUrl, file.fileName)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-500 hover:text-white hover:text-blue-400 transition-all cursor-pointer"
                        style={{ background: 'rgba(255,255,255,0.04)' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(59,130,246,0.1)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Download</span>
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoomDashboard;
