import Post from "../models/post.model.js";

export const createNewPost = async (req, res, next) => {
  try {
    const user = req.user._id;
    const { content, mediaUrl: clientMediaUrl } = req.body;

    let media = null;
    let mediaType = null;

    // If file uploaded from computer
    if (req.file) {
      media = req.file.path;
      mediaType = req.file.mimetype.startsWith("video") ? "video" : "image";
    }

    // If media URL provided from frontend
    else if (clientMediaUrl && clientMediaUrl.trim() !== "") {
      media = clientMediaUrl;

      // Detect type by URL
      if (clientMediaUrl.includes("youtube.com") || clientMediaUrl.includes("youtu.be")) {
        mediaType = "youtube";
      } 
      else if (clientMediaUrl.match(/\.(mp4|mov|avi|mkv)$/i)) {
        mediaType = "video";
      } 
      else if (clientMediaUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
        mediaType = "image";
      } 
      else {
        mediaType = "unknown"; // allow any external link
      }
    }

    // Validation
    if (!content && !media) {
      return res.status(400).json({
        success: false,
        message: "Posts cannot be empty. Add content or media.",
      });
    }

    const newPost = await Post.create({
      user: user,
      content: content || "",
      media: media,
      mediaType: mediaType
    });

    res.status(200).json({
      success: true,
      message: "Post created successfully",
      post: newPost,
    });

  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const getAllPosts = async(req , res , next) => {
    try {
        const posts = await Post.find().sort({createdAt : -1}).populate("user" , "name profilePicture");
        if(posts.length === 0){
            return res.status(404).json({
                success: false,
                message: "No posts found"
            })
        }

        res.status(200).json({
            success: true,
            message: "All posts fetched successfully",
            posts: posts
        })
    } catch (error) {
        console.log(error);
        next(error);
    }
}

export const getAllPostsForUser = async(req , res , next) => {
    try {
        const fetchPostsFor = req.params.id;
        const posts = await Post.find({ user: fetchPostsFor }).sort({ createdAt: -1 });
        if(posts.length === 0){
            return res.status(200).json({
                success: true,
                message: "User has no posts yet",
                posts: []
            })
        }

        res.status(200).json({
            success: true,
            message: "Posts fetched successfully for user",
            posts: posts
        })
    } catch (error) {
        console.log(error);
        next(error)
    }
};

export const getSinglePost = async(req , res , next) => {
    try {
        const postId = req.params.id;
        const post = await Post.findById(postId)
                    .populate("user" , "name profilePicture");
        if(!post){
            return res.status(404).json({
                success: false,
                message: "No such post found"
            })
        }
        res.status(200).json({
            success: true,
            message: "Post fetched successfully",
            post: post
        })
    } catch (error) {
        console.log(error);
        next(error);
    }
}

export const editPost = async(req , res , next) => {
    try {
        const postId = req.params.id;
        const user = req.user._id;
        const {content} = req.body;

        const mediaUrl = req.file ? req.file.path : null;
        const mediaType = req.file ? req.file.mimetype.startsWith("video") ?
                                    "video"
                                    : "image"
                                : null;
        const post = await Post.findById(postId);
        if(!post){
            return res.status(404).json({
                success: false,
                message: "No such post found"
            })
        }

        if(post.user.toString() !== user.toString()){
            return res.status(400).json({
                success: false,
                message: "You are not authorized to edit this post"
            })
        }

        if(!mediaUrl && !content){
            return res.status(400).json({
                success: false,
                message: "Post content cannot be empty. Attach media or content"
            })
        } 

        if(content){
            post.content = content;
        }
        if(mediaUrl){
            post.media = mediaUrl;
            post.mediaType = mediaType;
        }

        const updatedPost = await post.save();
        res.status(200).json({
            success: true,
            message:"Post updated successfully",
            updatedPost: updatedPost
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
};

export const deletePost = async(req , res , next) => {
    try {
        const postId = req.params.id;
        const user = req.user._id;
        const post = await Post.findById(postId);
        if(!post){
            return res.status(404).json({
                success: false,
                message: "No such post found"
            })
        }

        if(post.user.toString() !== user.toString()){
            return res.status(403).json({
                success: false,
                message: "You are not authorized to delete this post"
            })
        }

        const deletedPost = await Post.findByIdAndDelete(postId);
        res.status(200).json({
            success: true,
            message: "Post deleted successfully",
            deletedPost: deletedPost
        })
    } catch (error) {
        console.log(error);
        next(error);
    }
};

export const likePost = async(req , res , next) => {
    try {
        const postId = req.params.id;
        const user = req.user._id;
        const post = await Post.findById(postId);
        if(!post){
            return res.status(404).json({
                success: false,
                message: "No such post found"
            })
        }

        if(post.user.toString() === user.toString()){
            return res.status(403).json({
                success: false,
                message: "You can't like your own post"
            })
        }

        if(post.likes.includes(user.toString())){
            return res.status(400).json({
                success: false,
                message: "You have already liked this post"
            })
        }
        if(post.dislikes.includes(user.toString())){
            post.dislikes = post.dislikes.filter(userId => userId.toString() !== user.toString());
            if(post.dislikesCount > 0){
                post.dislikesCount--;
            }
        }
        post.likes.push(user.toString());
        post.likesCount = (post.likesCount || 0)+1;
        await post.save();

        res.status(200).json({
            success: true,
            message: "Liked post successfully",
            post: post
        })
    } catch (error) {
        console.log(error);
        next(error);
    }
};

export const dislikePost = async(req , res , next) =>  {
    try {
        const postId = req.params.id;
        const user = req.user._id;
        const post = await Post.findById(postId);
        if(!post){
            return res.status(404).json({
                success: false,
                message: "No such post found"
            })
        }

        if(post.user.toString() === user.toString()){
            return res.status(403).json({
                success: false,
                message: "You cannot dislike your own post"
            })
        }

        if(post.dislikes.includes(user.toString())){
            return res.status(400).json({
                success: false,
                message: "You have already disliked this post"
            })
        }
        if(post.likes.includes(user.toString())){
            post.likes = post.likes.filter(userId => userId.toString() !== user.toString());
            if(post.likesCount > 0){
                post.likesCount--;
            }
        }
        post.dislikes.push(user.toString());
        post.dislikesCount = (post.dislikesCount || 0)+1;
        await post.save();

        res.status(200).json({
            success: true,
            message: "Disliked post successfully",
            post: post
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
}