import user from "../models/user.js";
import chat from "../models/chat.js";
import message from "../models/message.js";
export const messageController = async (req, res) => {
	const { content, chat_id } = req.body;
	const sender = req.userId;
	const newMessage = new message({ content, sender, chat_id });
	await newMessage.save();
	await chat.updateOne(
		{ _id: chat_id },
		{ $push: { messages: newMessage._id, lastMessage: newMessage._id } }
	);
	res.status(201).json({
		_id: newMessage._id,
		content: newMessage.content,
		sender: newMessage.sender,
	});
};
export const messageByChatIdController = async (req, res) => {
	const messages = await message
		.find({ chat_id: req.params.chatId })
		.populate("sender");
	res.status(200).json({ messages });
};
export const chatsController = async (req, res) => {
	const chats = await chat
		.find({ users: { $in: [req.userId] } })
		.populate("users");
	res.status(200).json({ chats });
};
export const chatIdController = async (req, res) => {
	const { friendId } = req.params;
	const chatFound = await chat.findOne({
		users: { $all: [req.userId, friendId] },
	});
	if (!chatFound) {
		return res.status(400).json({ message: "Chat not found" });
	}
	res.status(200).json({
		_id: chatFound._id,
		users: chatFound.users,
		messages: (await chatFound.populate("messages")).messages,
	});
};
export const searchFriendController = async (req, res) => {
	const { username } = req.params;
	const userFound = await user.findOne({ username });
	if (!userFound) {
		return res.status(400).json({ message: "User not found" });
	}
	res.status(200).json({
		username: userFound.username,
		_id: userFound._id,
	});
};
