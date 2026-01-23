import User from "../models/user.model.js";
import Post from "../models/post.model.js";
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();

    res.status(200).json({
      success: true,
      message: users.length === 0 ? "No users found" : "Users fetched successfully",
      users
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No such user found"
      });
    }

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const editUserData = async (req, res, next) => {
  try {
    const loggedInUser = req.user._id;
    const userId = req.params.id;
    const profilePictureUrl = req.file ? req.file.path : null;

    if (loggedInUser.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const { name, bio } = req.body;

    if (name) user.name = name;
    if (profilePictureUrl) user.profilePicture = profilePictureUrl;
    if (bio) user.bio = bio;

    await user.save();

    res.status(200).json({ success: true, message: "User updated", updatedUser: user });
  } catch (err) {
    next(err);
  }
};

export const savePost = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const postId = req.params.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found"
      });
    }

    const user = await User.findById(userId);

    if (user.savedPosts.includes(postId)) {
      return res.status(400).json({
        success: false,
        message: "Post already saved"
      });
    }

    user.savedPosts.push(postId);
    await user.save();

    res.status(200).json({
      success: true,
      message: "Post saved successfully"
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const unsavePost = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const postId = req.params.id;

    const user = await User.findById(userId);

    if (!user.savedPosts.includes(postId)) {
      return res.status(400).json({
        success: false,
        message: "Post is not saved"
      });
    }

    user.savedPosts = user.savedPosts.filter(
      (id) => id.toString() !== postId.toString()
    );
    await user.save();

    res.status(200).json({
      success: true,
      message: "Post removed from saved list"
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const getSavedPosts = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).populate({
      path: "savedPosts",
      populate: {
        path: "user",
        select: "name profilePicture"
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.status(200).json({
      success: true,
      savedPosts: user.savedPosts
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

