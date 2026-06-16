import express from "express";
import { verifyToken } from "../middleware/auth.js";
import {
  sendMessage,
  getMessages,
  deleteMessage
} from "../controllers/chat.controller.js";

const router = express.Router();

router.post("/send", verifyToken, sendMessage);

router.get("/:userId1/:userId2", getMessages);

router.delete("/delete/:messageId", verifyToken, deleteMessage);

export default router;
