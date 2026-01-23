import convoModel from "../models/conversation.model.js";

export const createOrGetConversation = async(req , res , next) => {
    try{
    const {receiverId} = req.body;
    const senderId = req.user._id;

    if(!receiverId) {
        return res.status(400).json({
            success: false,
            message: "Receiver required"
        })
    }

    let conversation = await convoModel.findOne({
        participants: { $all: [senderId, receiverId] }
    });

    if(!conversation) {
        conversation = await convoModel.create({
            participants : [senderId , receiverId]
        })
    }

    res.status(200).json({
        success: true,
        message: "Conversation created successfully",
        conversation: conversation
    })
} catch(error) {
    console.log(error);
    next(error);
}
}

export const getConversationById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const conversation = await convoModel
      .findById(id)
      .populate("participants", "name profilePicture")
      .populate({
        path: "lastMessage",
        populate: { path: "sender", select: "name profilePicture" },
      });

    if (!conversation) {
      return res.status(404).json({ success: false, message: "Conversation not found" });
    }

    res.status(200).json({ success: true, conversation: conversation });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const getMyConversations = async(req , res, next) => {
    try {
        const userId = req.user._id;
        const conversations = await convoModel.find({participants: userId})
                                .populate("participants", "name profilePicture")
                                .populate({
                                    path: "lastMessage",
                                    populate: { path: "sender", select: "name profilePicture" },
                                });
        if(conversations.length === 0){
            return res.status(404).json({
                success: true,
                message: "No conversations done yet"
            })
        }

        res.status(200).json({
            success: true,
            message: "Conversations fetched successfully!",
            conversations: conversations
        })
    } catch (error) {
        console.log(error);
        next(error);
    }
}