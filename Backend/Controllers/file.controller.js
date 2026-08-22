import { Octokit } from "@octokit/rest";
import dotenv from "dotenv";
dotenv.config();
import cron from 'node-cron';

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
import { FileModel } from "../Models/file.model.js"
import { RoomModel } from "../Models/room.model.js";

// GitHub Logic
const uploadtogithub = async (fileBuffer, fileName) => {
    const content = fileBuffer.toString("base64");
    try {
        const res = await octokit.repos.createOrUpdateFileContents({
            owner: "VipulGupta2610",
            repo: "QuickDrop-Storage",
            path: `temp-shares/${Date.now()}-${fileName}`,
            message: `${fileName} added on ${Date.now()}`,
            content: content
        });
        return res.data.content.download_url; // Return the raw file URL
    } catch (error) {
        console.error("GitHub Error:", error);
        throw error;
    }
};

// Main Controller
export const filesaver = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        // Call the GitHub function
        const downloadUrl = await uploadtogithub(req.file.buffer, req.file.originalname);

        // Here you would save downloadUrl and roomCode to MongoDB [cite: 37]
        const roomCodeg = Math.floor(100000 + Math.random() * 900000).toString()
        const details = new FileModel({
            fileName: req.file.originalname,
            path: `temp-shares/${Date.now()}-${req.file.originalname}`,
            downloadUrl: downloadUrl,
            roomCode: roomCodeg,
        })
        await details.save()
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

cron.schedule('*/10 * * * *', async () => {
    console.log("Private room files cleanup started")
    const onehourago = new Date(Date.now() - 60 * 60 * 1000)
    try {
        const expiredrooms = await RoomModel.find({ createdAt: { $lt: onehourago } })
        if (expiredrooms.length === 0) {
            console.log("No expiry rooms found")
            return
        }
        for (const room of expiredrooms) {
            console.log(`Cleaning room ${room.roomCode}`)
            for (const file of room.files) {
                try {
                    const { data } = await octokit.repos.getContent({
                        owner: "VipulGupta2610",
                        repo: "QuickDrop-Storage",
                        path: file.path
                    })
                    await octokit.repos.deleteFile({
                        owner: "VipulGupta2610",
                        repo: "QuickDrop-Storage",
                        path: file.path,
                        message: "Session expired: Auto-deleting file",
                        sha: data.sha
                    });
                } catch (error) {
                    console.error("Failed to delete file from GitHub", error.message);
                }
            }
            await RoomModel.findByIdAndDelete(room._id)
            console.log("Successfully deleted room ", room.roomCode)
        }
    } catch (error) {
        console.log("Error at deleting old files of room ", error)
    }
})

cron.schedule('*/10 * * * *', async () => {
    console.log("Cleanup cycle started...");
    const onehourago = new Date(Date.now() - 60 * 60 * 1000);

    try {
        // 1. Double check your field name in the model (createdAt vs createdat)
        const files = await FileModel.find({ createdAt: { $lt: onehourago } });

        if (files.length === 0) {
            console.log("No expired files found in database.");
            return;
        }

        for (const file of files) {
            try {
                // 2. Fetch the SHA from GitHub (Required for deletion)
                const { data } = await octokit.repos.getContent({
                    owner: "VipulGupta2610",
                    repo: "QuickDrop-Storage",
                    path: file.path // Ensure this path is exactly what's on GitHub
                });

                // 3. Delete from GitHub
                await octokit.repos.deleteFile({
                    owner: "VipulGupta2610",
                    repo: "QuickDrop-Storage",
                    path: file.path,
                    message: "Session expired: Auto-deleting file",
                    sha: data.sha
                });

                // 4. Delete from MongoDB
                await FileModel.findByIdAndDelete(file._id);
                console.log(`Successfully deleted from Vault: ${file.fileName}`);

            } catch (innerError) {
                // If file is not found on GitHub, just remove it from MongoDB
                if (innerError.status === 404) {
                    await FileModel.findByIdAndDelete(file._id);
                    console.log(`File not on GitHub, removed from DB: ${file.fileName}`);
                } else {
                    console.error(`Failed to delete ${file.fileName}:`, innerError.message);
                }
            }
        }
    } catch (error) {
        console.error("Cron Job Main Error:", error);
    }
});

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
        const { roomCode } = req.body; // Frontend sends the code they are currently in
        const fileBuffer = req.file.buffer;
        const fileName = req.file.originalname;

        // 1. Upload to GitHub as usual
        const githubData = await uploadtogithub(fileBuffer, fileName);

        // 2. Find the room and add the file info to the array
        const updatedRoom = await RoomModel.findOneAndUpdate(
            { roomCode: roomCode },
            {
                $push: {
                    files: {
                        fileName: fileName,
                        path: githubData.path,
                        downloadUrl: githubData.downloadUrl
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
        const fileName = req.file.originalname;

        // 1. Upload to GitHub
        const downloadurl = await uploadtogithub(fileBuffer, fileName);

        // 2. Update Room (Fixed the Mongoose warning here)
        const room = await RoomModel.findOneAndUpdate(
            { roomCode: roomnum },
            {
                $push: {
                    files: {
                        fileName: fileName,
                        path: `temp-shares/${Date.now()}-${req.file.originalname}`,
                        downloadUrl: downloadurl,
                        updatedAt: Date.now()
                    }
                }
            },
            { returnDocument: 'after' } // Modern replacement for { new: true }
        );

        if (!room) {
            return res.status(404).json({ message: "No room found with this code" });
        }

        // 3. CRITICAL: Send the success response back to frontend
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
