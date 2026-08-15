import express from "express";
import multer from "multer";
import { creatingRoom, filesaver, sendinginfo, sendingRoomInfo, uploadingFilesforRoom } from "../Controllers/file.controller.js";

const router = express.Router();

// Configure multer to store file in memory (required for GitHub buffer)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/", upload.single("file"), filesaver);
router.get("/ReceiverPage/:inputCode" , sendinginfo);
router.post("/createroom" , creatingRoom);
router.post(`/RoomDashboard/:roomnum`, upload.single("file"),uploadingFilesforRoom)
router.get(`/RoomDashboard/:roomnum`, sendingRoomInfo)

export default router;