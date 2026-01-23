import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    user: {
        type:mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    type: {
        type: String,
        enum: ["message", "follow", "like", "comment"]
    },
    referenceId: {
        type: mongoose.Schema.Types.ObjectId
    },
    isRead: {
        type: Boolean,
        default: false
    }
} , {timestamps: true});

const notificationModel = mongoose.model("Notification" , notificationSchema);
export default notificationModel;