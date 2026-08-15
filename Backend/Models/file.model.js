import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
    fileName: String,
    path: String, // The path in your GitHub repo
    downloadUrl: String,
    roomCode: String,
    createdAt: { type: Date, default: Date.now } // TTL index: auto-deletes from DB after 1 hour
});

export const FileModel = mongoose.model("File", fileSchema);