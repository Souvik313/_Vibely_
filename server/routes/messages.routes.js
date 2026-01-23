import { Router } from "express";
import { getMessages , sendMessage } from "../controllers/message.controller.js";
import { authorize } from "../middleware/auth.middleware.js";

const messageRouter = Router();

messageRouter.post("/" , authorize , sendMessage);
messageRouter.get("/:conversationId" , authorize , getMessages);

export default messageRouter;