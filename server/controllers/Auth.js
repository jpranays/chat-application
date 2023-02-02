import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import user from "../models/user.js";
export const registerController = async (req, res) => {
	let { username, password } = req.body;
	const userFound = await user.findOne({ username });
	if (userFound) {
		return res.status(400).json({ message: "Username already exists" });
	}
	password = await bcrypt.hash(password, 10);
	const newUser = new user({ username, password });
	await newUser.save();
	res.status(201).json({ message: "User created" });
};
export const loginController = async (req, res) => {
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
			_id: userFound._id,
			username: userFound.username,
		},
		token,
	});
};
export const logoutController = (req, res) => {
	res.status(200).json({ message: "Logged out" });
};
export const authController = (req, res) => {
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
};
