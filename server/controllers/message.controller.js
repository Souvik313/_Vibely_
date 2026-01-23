import messageModel from "../models/message.model.js";
import convoModel from "../models/conversation.model.js";

export const sendMessage = async (req, res, next) => {
  try {
    const { conversationId, text } = req.body;

    if (!conversationId || !text?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Conversation ID and message text are required",
      });
    }
    const conversation = await convoModel.findById(conversationId);
    if (!conversation){
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    const message = await messageModel.create({
      conversation: conversationId,
      sender: req.user._id,
      text: text.trim(),
    });

    await convoModel.findByIdAndUpdate(conversationId, {
      lastMessage: message._id,
      updatedAt: new Date(),
    });

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: message,
    });
  } catch (error) {
    next(error);
  }
};

export const getMessages = async (req, res, next) => {
  try {
    const { conversationId } = req.params;

    const messages = await messageModel.find({ conversation: conversationId })
                        .populate("sender", "name profilePicture")
                        .sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      messages: messages,
    });
  } catch (error) {
    next(error);
  }
};