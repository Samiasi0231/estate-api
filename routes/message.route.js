import express from "express";
import { addMessage} from "../controller.js/message.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// Routes

router.post("/:chatId", verifyToken, addMessage);


export default router;
