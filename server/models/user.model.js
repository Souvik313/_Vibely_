import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    profilePicture: {
        type: String,
        default: ""
    },
    bio: {
        type: String,
        default: "",
        maxlength: 300
    },
    savedPosts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
    }],
    online: {
        type: Boolean,
        default: false
    },
    lastSeen: {
        type: Date
    }
} , {timestamps: true});

const User = mongoose.model("User" , userSchema);
export default User;