import Comment from "../models/comment.model.js";
import Post from "../models/post.model.js";
import mongoose from "mongoose";
export const createNewComment = async(req , res , next) => {
    try {
        const userId = req.user._id;
        const postId = req.params.postId;
        const {text} = req.body;

        const post = await Post.findById(postId);
        if(!post){
            return res.status(400).json({
                success: false,
                message: "No post found"
            })
        }

        if(!text){
            return res.status(400).json({
                success: false,
                message: "Comment cannot be empty"
            })
        }

        const newComment = await Comment.create({
            user: userId,
            post: postId,
            text: text,
        })
        post.commentsCount += 1;
        await post.save();
        const populatedComment = await Comment.findById(newComment._id)
                                    .populate("user", "name profilePicture");

        res.status(201).json({
            success: true,
            message: "New comment posted!",
            comment: populatedComment
        })

    } catch (error) {
        console.log(error);
        next(error);
    }
};

export const getCommentsForPost = async(req , res , next) => {
    try{
        const postId = req.params.postId;
        const post = await Post.findById(postId);

        if(!post){
            return res.status(404).json({
                success: false,
                message: "No post found"
            })
        }

        const comments = await Comment.find({ post: postId })
            .populate("user", "name profilePicture")
            .sort({ createdAt: -1 });

        if(comments.length === 0){
            return res.status(200).json({
                success: true,
                message: "No comments yet",
                comments: []
            })
        }

        res.status(200).json({
            success: true,
            message: "Comments fetched successfully",
            comments: comments
        })

    } catch (error) {
        console.log(error);
        next(error);
    }
};

export const getComment = async(req , res , next) => {
    try {
        const commentId = req.params.id;
        const comment = await Comment.findById(commentId).populate("user" , "name profilePicture");

        if(!comment){
            return res.status(404).json({
                success: false,
                message: "Comment not found"
            })
        }

        res.status(200).json({
            success: true,
            message: "Comment fetched successfully!",
            comment: comment
        })
    } catch (error) {
        console.log(error);
        next(error);
    }
};

export const editComment = async(req , res , next) => {
    try {
        const commentId = req.params.id;
        const userId = req.user._id;
        const {text} = req.body;

        if(!text || text.trim().length === 0){
            return res.status(400).json({
                success: false,
                message: "Comment text cannot be empty"
            })
        }

        const comment = await Comment.findById(commentId);
        if(!comment){
            return res.status(404).json({
                success: false,
                message: "No commment found"
            })
        }

        if(comment.user.toString() !== userId.toString()){
            return res.status(400).json({
                success: false,
                message: "You are not authorized to edit this comment"
            })
        }

        comment.text = text;
        await comment.save();

        const updatedComment = await Comment.findById(commentId)
                                .populate("user" , "name profilePicture");
        return res.status(200).json({
            success: true,
            message: "Comment updated successfully!",
            updatedComment: updatedComment
        })
    } catch (error) {
        console.log(error);
        next(error);
    }
};

export const deleteComment = async (req, res, next) => {
    try {
        const commentId = req.params.id;
        const user = req.user._id;

        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({
                success: false,
                message: "No such comment found"
            });
        }

        if (comment.user.toString() !== user.toString()) {
            return res.status(400).json({
                success: false,
                message: "You are not authorised to delete this comment"
            });
        }

        // 🔥 FIX: Find parent comment by ObjectId, not string
        const parentComment = await Comment.findOne({
            replies: new mongoose.Types.ObjectId(commentId)
        });

        if (parentComment) {
            parentComment.replies = parentComment.replies.filter(
                id => id.toString() !== commentId.toString()
            );
            await parentComment.save();
        }

        const deletedComment = await Comment.findByIdAndDelete(commentId);

        res.status(200).json({
            success: true,
            message: "Comment deleted successfully",
            deletedComment
        });

    } catch (error) {
        console.log(error);
        next(error);
    }
};

export const likeComment = async(req , res , next) => {
    try {
        const commentId = req.params.id;
        const userId = req.user._id;
        const comment = await Comment.findById(commentId);

        if(!comment){
            return res.status(404).json({
                success: false,
                message: "No such comment found"
            })
        }
        if(comment.user.toString() === userId.toString()){
            return res.status(400).json({
                success: false,
                message: "You cannot like your own comment"
            })
        }
        if(comment.likes.includes(userId)){
            return res.status(400).json({
                success: false,
                message: "You have already liked this comment"
            })
        }
        if (comment.dislikes.includes(userId)) {
            comment.dislikes = comment.dislikes.filter(user => user.toString() !== userId.toString());
        }

        comment.likes.push(userId);
        await comment.save();

        res.status(200).json({
            success: true,
            message: "Comment liked successfully",
            likesCount: comment.likes.length,
            dislikesCount : comment.dislikes.length,
            likes: comment.likes,
            dislikes: comment.dislikes,
        })
    } catch (error) {
        console.log(error);
        next(error);
    }
};

export const dislikeComment = async(req , res , next) => {
    try {
        const commentId = req.params.id;
        const user = req.user._id;
        const comment = await Comment.findById(commentId);

        if(!comment){
            return res.status(404).json({
                success: false,
                message: "No such comment found"
            })
        }
        if(comment.user.toString() === user.toString()){
            return res.status(400).json({
                success: false,
                message: "You cannot dislike your own comment"
            })
        }

        if(comment.dislikes.includes(user)){
            return res.status(400).json({
                success: false,
                message: "You have already disliked this comment"
            })
        }

        if(comment.likes.includes(user)){
            comment.likes = comment.likes.filter(userId => userId.toString() !== user.toString())
        }
        comment.dislikes.push(user);
        await comment.save();
        res.status(200).json({
            success: true,
            message: "Disliked comment successfully",
            likesCount: comment.likes.length,
            dislikesCount: comment.dislikes.length,
            likes: comment.likes,
            dislikes: comment.dislikes
        })

    } catch (error) {
        console.log(error);
        next(error);
    }
};

export const replyToComment = async(req , res , next) => {
    try{
        const parentCommentId = req.params.id;
        const user = req.user._id;
        const {text} = req.body;
        if(!user){
            return res.status(400).json({
                success: false,
                message: "User not logged in"
            })
        }
        if(!text || text.trim()===""){
            return res.status(400).json({
                success: false,
                message: "Reply text cannot be empty"
            })
        }

        const parentComment = await Comment.findById(parentCommentId);
        if(!parentComment){
            return res.status(404).json({
                success: false,
                message: "No such comment found"
            })
        }
        const newReply = await Comment.create({
            user: user,
            post: parentComment.post, // ensure reply stays linked to same post
            text,
            likes: [],
            dislikes: [],
            replies: []
        });
        parentComment.replies.push(newReply._id);
        await parentComment.save();

        const populatedReply = await Comment.findById(newReply._id).populate("user" , "name profilePicture");
        res.status(200).json({
            success: true,
            message: "Reply added successfully",
            reply: populatedReply
        })
    }
    catch(error) {
        console.log(error.message);
        next(error);
    }
}

export const getRepliesForComment = async (req, res, next) => {
  try {
    const commentId = req.params.id;

    const parentComment = await Comment.findById(commentId);
    if (!parentComment) {
      return res.status(404).json({
        success: false,
        message: "No such comment found",
      });
    }
    const replies = await Comment.find({ _id: { $in: parentComment.replies } })
      .populate("user", "name profilePicture")
      .sort({ createdAt: 1 });

    return res.status(200).json({
      success: true,
      message: "Replies fetched successfully",
      replyCount: replies.length,
      replies: replies,
    });

  } catch (error) {
    console.log(error);
    next(error);
  }
};