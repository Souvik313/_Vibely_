import mongoose from "mongoose";
import { Router } from "express";
import { createNewComment, getCommentsForPost, getComment, likeComment, dislikeComment, editComment, deleteComment, getRepliesForComment, replyToComment } from "../controllers/comment.controller.js";
import { authorize } from "../middleware/auth.middleware.js";

const commentRouter = Router();

commentRouter.post("/:postId", authorize, createNewComment);
commentRouter.get("/post/:postId", getCommentsForPost); 
commentRouter.get("/:id", getComment);
commentRouter.patch("/:id", authorize, editComment); 
commentRouter.delete("/:id", authorize, deleteComment); 

commentRouter.post("/like/:id", authorize, likeComment);
commentRouter.post("/dislike/:id", authorize, dislikeComment);

commentRouter.post("/reply/:id", authorize , replyToComment);
commentRouter.get("/replies/:id", getRepliesForComment);

export default commentRouter;
