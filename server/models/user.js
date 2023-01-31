import { Schema, model } from "mongoose";

const userSchema = new Schema({
	username: {
		type: String,
		required: true,
		unique: true,
		trim: true,
		minlength: 3,
	},
	password: {
		type: String,
		required: true,
		trim: true,
		minlength: 6,
	},
	friends: [
		{
			type: Schema.Types.ObjectId,
			ref: "User",
		},
	],
	friendRequests: [
		{
			type: Schema.Types.ObjectId,
			ref: "User",
		},
	],
	friendRequestsSent: [
		{
			type: Schema.Types.ObjectId,
			ref: "User",
		},
	],
	chats: [
		{
			type: Schema.Types.ObjectId,
			ref: "Chat",
		},
	],
});

export default model("User", userSchema);
