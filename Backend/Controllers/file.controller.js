import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import cron from 'node-cron';
import { FileModel } from "../Models/file.model.js"
import { RoomModel } from "../Models/room.model.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOADS_DIR = path.join(__dirname, '..', 'uploads');

// Helper to save file locally
const saveLocalFile = async (fileBuffer, originalName, req) => {
    const uniqueFileName = `${Date.now()}-${originalName}`;
    const filePath = path.join(UPLOADS_DIR, uniqueFileName);
    
    try {
        await fs.mkdir(UPLOADS_DIR, { recursive: true });
        await fs.writeFile(filePath, fileBuffer);
        
        // Construct the download URL based on the current request
        const protocol = req.protocol === 'https' ? 'https' : (req.get('x-forwarded-proto') || req.protocol);
        const host = req.get('host');
        const downloadUrl = `${protocol}://${host}/uploads/${uniqueFileName}`;
        
        return { downloadUrl, fileName: uniqueFileName, localPath: filePath };
    } catch (error) {
        console.error("Local Save Error:", error);
        throw error;
    }
};

// Main Controller
export const filesaver = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const { downloadUrl, fileName, localPath } = await saveLocalFile(req.file.buffer, req.file.originalname, req);
        const roomCodeg = Math.floor(100000 + Math.random() * 900000).toString();
        
        const details = new FileModel({
            fileName: req.file.originalname,
            path: localPath,
            downloadUrl: downloadUrl,
            roomCode: roomCodeg,
        });
        await details.save();
        
        res.status(200).json({
            message: "File uploaded successfully",
            downloadUrl,
            roomCode: roomCodeg
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error at uploading file', error });
    }
};

export const sendinginfo = async (req, res) => {
    try {
        const { inputCode } = req.params;
        const file = await FileModel.findOne({ roomCode: inputCode })
        if (file) {
            console.log("File found wuth these code.", file.fileName);
            res.status(200).json({
                message: "File found successfully",
                downloadUrl: file.downloadUrl,
                roomCode: file.roomCode,
                fileName: file.fileName
            })
        }
        else {
            console.log("No file matches this code.");
            res.status(400).json({ message: "File not found" })
        }
    } catch (error) {
        console.log("Error at sending info ", error)
        res.status(500).json({ message: "Internal Server Error ", error })
    }
}

export const uploadToRoom = async (req, res) => {
    try {
        const { roomCode } = req.body;
        const fileBuffer = req.file.buffer;
        const originalName = req.file.originalname;

        const { downloadUrl, localPath } = await saveLocalFile(fileBuffer, originalName, req);

        const updatedRoom = await RoomModel.findOneAndUpdate(
            { roomCode: roomCode },
            {
                $push: {
                    files: {
                        fileName: originalName,
                        path: localPath,
                        downloadUrl: downloadUrl
                    }
                }
            },
            { new: true }
        );

        res.status(200).json({ message: "File added to room", room: updatedRoom });
    } catch (error) {
        res.status(500).json({ message: "Upload failed", error });
    }
};

export const creatingRoom = async (req, res) => {
    try {
        const roomCodeg = Math.floor(100000 + Math.random() * 900000).toString()
        const { roomName } = req.body;
        const newRoom = new RoomModel({
            roomCode: roomCodeg,
            roomName: roomName
        })
        await newRoom.save()
        res.status(200).json({
            message: "Room created successfully",
            roomCode: roomCodeg,
            roomName: roomName
        })
    } catch (error) {
        console.log("Error at creating room ", error)
        res.status(500).json({ message: "Error at creating room ", error })
    }
}

export const uploadingFilesforRoom = async (req, res) => {
    try {
        const { roomnum } = req.params;

        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const fileBuffer = req.file.buffer;
        const originalName = req.file.originalname;

        const { downloadUrl, localPath } = await saveLocalFile(fileBuffer, originalName, req);

        const room = await RoomModel.findOneAndUpdate(
            { roomCode: roomnum },
            {
                $push: {
                    files: {
                        fileName: originalName,
                        path: localPath,
                        downloadUrl: downloadUrl,
                        updatedAt: Date.now()
                    }
                }
            },
            { returnDocument: 'after' } 
        );

        if (!room) {
            return res.status(404).json({ message: "No room found with this code" });
        }

        return res.status(200).json({
            message: "File shared in room successfully",
            room
        });

    } catch (error) {
        console.log(error, "error at uploading for room");
        res.status(500).json({ message: "Error at uploading for room", error });
    }
};

export const sendingRoomInfo = async (req, res) => {
    try {
        const { roomnum } = req.params;
        const room = await RoomModel.findOne({ roomCode: roomnum });

        if (!room) {
            return res.status(404).json({ message: "Room not found with this code" });
        }

        res.status(200).json({ message: "Room found successfully", room });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error at fetching room info", error });
    }
};

// CRON JOBS for Local File Cleanup
cron.schedule('*/10 * * * *', async () => {
    console.log("Cleanup cycle started...");
    const onehourago = new Date(Date.now() - 60 * 60 * 1000);

    try {
        // 1. Clean up individual files
        const files = await FileModel.find({ createdAt: { $lt: onehourago } });
        for (const file of files) {
            try {
                await fs.unlink(file.path);
            } catch (err) {
                console.error(`Failed to delete local file ${file.path}:`, err.message);
            }
            await FileModel.findByIdAndDelete(file._id);
            console.log(`Successfully deleted old vault file: ${file.fileName}`);
        }

        // 2. Clean up expired rooms and their files
        const expiredrooms = await RoomModel.find({ createdAt: { $lt: onehourago } });
        for (const room of expiredrooms) {
            console.log(`Cleaning expired room ${room.roomCode}`);
            for (const file of room.files) {
                try {
                    await fs.unlink(file.path);
                } catch (error) {
                    console.error(`Failed to delete local file ${file.path}:`, error.message);
                }
            }
            await RoomModel.findByIdAndDelete(room._id);
            console.log("Successfully deleted room ", room.roomCode);
        }
    } catch (error) {
        console.error("Cron Job Main Error:", error);
    }
});
