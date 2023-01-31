import user from "../models/user.js";
import chat from "../models/chat.js";
export const sendRequestController = async (req, res) => {
	const { id: receiver } = req.body;
	const sender = req.userId;

	const userFound = await user.findOne({ _id: sender });
	if (userFound.friendRequestsSent.includes(receiver)) {
		return res.status(400).json({ message: "Request already sent" });
	}

	await user.updateOne(
		{ _id: receiver },
		{ $push: { friendRequests: sender } }
	);
	await user.updateOne(
		{ _id: sender },
		{ $push: { friendRequestsSent: receiver } }
	);

	res.status(201).json({ message: "Request sent" });
};
export const acceptRequestController = async (req, res) => {
	const { id: sender } = req.body;
	const receiver = req.userId;
	const userFound = await user.findOne({ _id: receiver });
	if (!userFound.friendRequests.includes(sender)) {
		return res.status(400).json({ message: "Request not found" });
	}

	await user.updateOne(
		{ _id: receiver },
		{ $pull: { friendRequests: sender } }
	);
	await user.updateOne(
		{ _id: sender },
		{ $pull: { friendRequestsSent: receiver } }
	);

	await user.updateOne({ _id: receiver }, { $push: { friends: sender } });
	await user.updateOne({ _id: sender }, { $push: { friends: receiver } });
	const newChat = new chat({ users: [sender, receiver] });
	await newChat.save();
	await user.updateOne({ _id: receiver }, { $push: { chats: newChat._id } });
	await user.updateOne({ _id: sender }, { $push: { chats: newChat._id } });
	res.status(201).json({ message: "Request accepted" });
};
export const rejectRequestController = async (req, res) => {
	const { id: sender } = req.body;
	const receiver = req.userId;
	const userFound = await user.findOne({ _id: receiver });
	if (!userFound.friendRequests.includes(sender)) {
		return res.status(400).json({ message: "Request not found" });
	}
	await user.updateOne(
		{ _id: receiver },
		{ $pull: { friendRequests: sender } }
	);
	await user.updateOne(
		{ _id: sender },
		{ $pull: { friendRequestsSent: receiver } }
	);
	res.status(201).json({ message: "Request declined" });
};

export const cancelRequestController = async (req, res) => {
	const { id: receiver } = req.body;
	const sender = req.userId;
	const userFound = await user.findOne({ _id: sender });
	if (!userFound.friendRequestsSent.includes(receiver)) {
		return res.status(400).json({ message: "Request not found" });
	}
	await user.updateOne(
		{ _id: sender },
		{ $pull: { friendRequestsSent: receiver } }
	);
	await user.updateOne(
		{ _id: receiver },
		{ $pull: { friendRequests: sender } }
	);
	res.status(201).json({ message: "Request cancelled" });
};
export const removeFriendController = async (req, res) => {
	const { id } = req.body;
	const userFound = await user.findOne({ _id: req.userId });
	if (!userFound.friends.includes(id)) {
		return res.status(400).json({ message: "Friend not found" });
	}
	await user.updateOne({ _id: req.userId }, { $pull: { friends: id } });
	await user.updateOne({ _id: id }, { $pull: { friends: req.userId } });

	return res.status(201).json({ message: "Friend removed" });
};
export const friendRequestsController = async (req, res) => {
	let { friendRequests } = await user
		.findOne({ _id: req.userId })
		.populate("friendRequests");
	friendRequests = friendRequests.map((user) => {
		return {
			username: user.username,
			_id: user._id,
		};
	});
	res.status(200).json({ friendRequests });
};
export const friendRequestsSentController = async (req, res) => {
	let { friendRequestsSent } = await user
		.findOne({ _id: req.userId })
		.populate("friendRequestsSent");
	friendRequestsSent = friendRequestsSent.map((user) => {
		return {
			username: user.username,
			_id: user._id,
		};
	});

	res.status(200).json({ friendRequestsSent });
};
export const friendsController = async (req, res) => {
	let { friends } = await user.findOne({ _id: req.userId }).populate("friends");
	friends = friends.map((user) => {
		return {
			username: user.username,
			_id: user._id,
		};
	});
	res.status(200).json({ friends });
};
