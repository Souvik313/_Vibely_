import {Router} from 'express';
import { getAllPosts, createNewPost , getAllPostsForUser, getSinglePost , editPost , deletePost, likePost, dislikePost} from '../controllers/post.controller.js';
import { authorize } from '../middleware/auth.middleware.js';
import upload from "../config/multer.js";

const postRouter = Router();

postRouter.get("/all-posts" , getAllPosts);
postRouter.post(
  "/create",
  (req, res, next) => { req.uploadType = "post"; 
                        next(); 
                      },
  upload.single("media"),
  authorize,
  createNewPost
);
postRouter.get("/posts/:id" , authorize , getAllPostsForUser);
postRouter.get("/:id", getSinglePost);
postRouter.patch("/:id" , authorize , editPost);
postRouter.delete("/:id" , authorize , deletePost);
postRouter.post("/like/:id" , authorize , likePost);
postRouter.post("/dislike/:id" , authorize , dislikePost);

export default postRouter;