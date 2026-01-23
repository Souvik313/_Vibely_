import { Router } from 'express';
import { authorize } from '../middleware/auth.middleware.js';
import { createOrGetConversation , getConversationById , getMyConversations} from '../controllers/conversation.controller.js';
const conversationRouter = Router();

conversationRouter.post("/" , authorize , createOrGetConversation);
conversationRouter.get("/:id" , authorize , getConversationById);
conversationRouter.get("/" , authorize , getMyConversations);

export default conversationRouter;