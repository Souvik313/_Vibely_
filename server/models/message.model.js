import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({

    conversation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Conversation",
        required: true
    },

    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    text: {
        type: String,
        trim: true
    },

    media: {
        type: String
    },

    mediaType: {
        type: String,
        enum: ["text", "image", "video", "audio"],
        default: "text"
    },

    seenBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],

    deletedFor: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }]
} , {timestamps : true});

const messageModel = mongoose.model("Message" , messageSchema);
export default messageModel;