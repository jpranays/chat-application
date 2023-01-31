import { Schema, model } from "mongoose";

const chatSchema = new Schema({
	users: [
		{
			type: Schema.Types.ObjectId,
			ref: "User",
		},
	],
	messages: [
		{
			type: Schema.Types.ObjectId,
			ref: "Message",
		},
	],
	latestMessage: {
		type: Schema.Types.ObjectId,
		ref: "Message",
	},
});

export default model("Chat", chatSchema);
