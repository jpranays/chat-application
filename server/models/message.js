import { Schema, model } from "mongoose";

const messageSchema = new Schema({
	content: {
		type: String,
		required: true,
		trim: true,
		minlength: 1,
	},
	sender: {
		type: Schema.Types.ObjectId,
		ref: "User",
	},
	chat: {
		type: Schema.Types.ObjectId,
		ref: "Chat",
	},
});

export default model("Message", messageSchema);
