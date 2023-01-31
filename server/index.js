import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import "dotenv/config";
import user from "./models/user.js";
import jwt from "jsonwebtoken";
import protect from "./middleware/auth.js";
import message from "./models/message.js";
import chat from "./models/chat.js";
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "*");
	if (req.method === "OPTIONS") {
		res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
		return res.status(200).json({});
	}
	next();
});

app.get("/", (req, res) => {
	res.send("Hello World!");
});
app.post("/register", async (req, res) => {
	let { username, password } = req.body;
	const userFound = await user.findOne({ username });
	if (userFound) {
		return res.status(400).json({ message: "Username already exists" });
	}
	password = await bcrypt.hash(password, 10);
	const newUser = new user({ username, password });
	await newUser.save();
	res.status(201).json({ message: "User created" });
});
app.post("/login", async (req, res) => {
	let { username, password } = req.body;
	const userFound = await user.findOne({ username });
	if (!userFound) {
		return res
			.status(400)
			.json({ message: "Username or password is incorrect" });
	}
	const passwordMatch = await bcrypt.compare(password, userFound.password);
	if (!passwordMatch) {
		return res
			.status(400)
			.json({ message: "Username or password is incorrect" });
	}
	const token = jwt.sign(
		{ id: userFound._id, username: userFound.username },
		process.env.JWT_SECRET,
		{
			expiresIn: "1d",
		}
	);
	res.status(200).json({
		user: {
			id: userFound._id,
			username: userFound.username,
		},
		token,
	});
});
app.get("/logout", (req, res) => {
	res.status(200).json({ message: "Logged out" });
});
app.get("/auth", (req, res) => {
	try {
		const token = req.headers["authorization"];
		if (!token) {
			return res.status(401).json({ message: "No token provided" });
		}
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		res.status(200).json({
			user: {
				_id: decoded.id,
				username: decoded.username,
			},
		});
	} catch (error) {
		res.status(401).json({ message: "Something went wrong" });
	}
});
app.post("/sendrequest", protect, async (req, res) => {
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
});
app.post("/acceptrequest", protect, async (req, res) => {
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
});
app.post("/rejectrequest", protect, async (req, res) => {
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
});
app.post("/cancelrequest", protect, async (req, res) => {
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
});
app.post("/removefriend", protect, async (req, res) => {
	const { id } = req.body;
	const userFound = await user.findOne({ _id: req.userId });
	if (!userFound.friends.includes(id)) {
		return res.status(400).json({ message: "Friend not found" });
	}
	await user.updateOne({ _id: req.userId }, { $pull: { friends: id } });
	await user.updateOne({ _id: id }, { $pull: { friends: req.userId } });

	return res.status(201).json({ message: "Friend removed" });
});

app.post("/message", protect, async (req, res) => {
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
});
app.get("/messages/:chatId", protect, async (req, res) => {
	const messages = await message
		.find({ chat_id: req.params.chatId })
		.populate("sender");
	res.status(200).json({ messages });
});
app.get("/chats", protect, async (req, res) => {
	// get all chats of user where user is in users array
	const chats = await chat
		.find({ users: { $in: [req.userId] } })
		.populate("users");
	res.status(200).json({ chats });
});

app.get("/friends", protect, async (req, res) => {
	let { friends } = await user.findOne({ _id: req.userId }).populate("friends");
	friends = friends.map((user) => {
		return {
			username: user.username,
			_id: user._id,
		};
	});
	res.status(200).json({ friends });
});
app.get("/friendRequests", protect, async (req, res) => {
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
});
app.get("/friendRequestsSent", protect, async (req, res) => {
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
});

app.get("/chatId/:friendId", protect, async (req, res) => {
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
});
app.get("/searchFriend/:username", protect, async (req, res) => {
	const { username } = req.params;
	const userFound = await user.findOne({ username });
	if (!userFound) {
		return res.status(400).json({ message: "User not found" });
	}
	res.status(200).json({
		username: userFound.username,
		_id: userFound._id,
	});
});

mongoose.set("strictQuery", false);
mongoose
	.connect(process.env.DB_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		app.listen(3000, () => {
			console.log("Server is running on port 3000");
		});
	});
