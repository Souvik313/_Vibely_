import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  content: {
    type: String,
    trim: true
  },
  media: {
    type: String,
  },
  mediaType: {
    type: String,
    enum: ["image" , "video" , "youtube"],
    default: null
  },
  likes: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: []
    }
  ],
  likesCount : {
    type: Number,
    default: 0
  },
  dislikes :[{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  dislikesCount: {
    type: Number,
    default: 0
  },
  commentsCount: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

const Post = mongoose.model("Post" , postSchema);
export default Post;