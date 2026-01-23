import mongoose from 'mongoose';
import {Router} from 'express';
import { getAllUsers , getUser , editUserData, getSavedPosts , savePost , unsavePost } from '../controllers/user.controller.js';
import { authorize } from '../middleware/auth.middleware.js';
import { setUploadType } from '../middleware/uploadType.js';
import upload from '../config/multer.js';
const userRouter = Router();

userRouter.get("/users" , getAllUsers);
userRouter.get("/user/:id" , getUser);
userRouter.patch(
  "/update/:id",
  authorize,
  setUploadType("profile"),
  upload.single("profilePicture"),
  editUserData
);
userRouter.post("/save/:id" , authorize , savePost);
userRouter.delete("/unsave/:id" , authorize , unsavePost);
userRouter.get("/saved-posts" , authorize , getSavedPosts);

export default userRouter;