
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FileText, Download, Users, Zap,
  ChevronLeft, FilePlus, Loader2,
  Code, Copy, CheckCircle, XCircle
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
      setTimeout(() => setUploadStatus("idle"), 1500);
    }
  };

  if (loading) {
    return (
      <div className="h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-white" />
      </div>
    );
  }

  return (
    <div className="h-screen bg-black text-white flex">

      {/* SIDEBAR */}
      <div className="w-[280px] border-r border-white/10 p-6 flex flex-col justify-between">

        <div>
          <button
            onClick={() => navigate(-1)}
            className="mb-6 text-sm text-slate-400 hover:text-white"
          >
            ← Back
          </button>

          <h1 className="text-xl font-bold mb-1">
            {roomInfo?.roomName || "Room"}
          </h1>

          <p className="text-xs text-slate-500 mb-6">
            Secure File Space
          </p>

          <div className="bg-white/5 rounded-xl p-4">
            <p className="text-xs text-slate-400 mb-1">Room Code</p>

            <div
              onClick={copytext}
              className="flex items-center justify-between cursor-pointer"
            >
              <span className="font-mono text-lg">{roomnum}</span>

              {tick ? (
                <CheckCircle className="w-4 h-4 text-green-400" />
              ) : (
                <Copy className="w-4 h-4 text-slate-500" />
              )}
            </div>
          </div>

          <div className="mt-6 space-y-2 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" /> Collaborative
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4" /> Fast Sync
            </div>
          </div>
        </div>

        <div className="text-xs text-slate-600">
          {files.length} Files
        </div>
      </div>

      {/* MAIN */}
      <div className="flex-1 flex flex-col">

        {/* TOP BAR */}
        <div className="h-16 border-b border-white/10 flex items-center px-6 text-sm text-slate-400">
          Shared Files
        </div>

        {/* CONTENT */}
        <div className="flex flex-1">

          {/* FILE LIST */}
          <div className="flex-1 p-6 space-y-3 overflow-y-auto">

            {files.map((file, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-between bg-white/5 px-4 py-3 rounded-xl hover:bg-white/10 transition"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-blue-400" />
                  <span className="text-sm">{file.fileName}</span>
                </div>

                <a href={file.downloadUrl} target="_blank">
                  <Download className="w-4 h-4 text-slate-400 hover:text-white" />
                </a>
              </motion.div>
            ))}

            {files.length === 0 && (
              <div className="text-center text-slate-500 mt-20">
                No files yet
              </div>
            )}
          </div>

          {/* UPLOAD PANEL */}
          <div className="w-[300px] border-l border-white/10 p-6">

            <div
              onClick={() => !isUploading && fileInputRef.current.click()}
              className="h-[200px] bg-white/5 border border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-white/10 transition"
            >
              <AnimatePresence mode="wait">

                {isUploading ? (
                  <Loader2 className="animate-spin w-6 h-6" />
                ) : uploadStatus === "success" ? (
                  <CheckCircle className="text-green-400 w-8 h-8" />
                ) : uploadStatus === "error" ? (
                  <XCircle className="text-red-400 w-8 h-8" />
                ) : (
                  <>
                    <FilePlus className="w-6 h-6 mb-2 text-blue-400" />
                    <p className="text-xs text-slate-400">
                      Upload File
                    </p>
                  </>
                )}

              </AnimatePresence>

              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileUpload}
              />
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default RoomDashboard;

