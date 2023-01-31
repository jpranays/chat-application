import { Router } from "express";
import protect from "../middleware/auth.js";
import {
	chatIdController,
	chatsController,
	messageByChatIdController,
	messageController,
	searchFriendController,
} from "../controllers/Chats.js";
export const chatsRouter = Router();
chatsRouter.post("/message", protect, messageController);
chatsRouter.get("/messages/:chatId", protect, messageByChatIdController);
chatsRouter.get("/chats", protect, chatsController);
chatsRouter.get("/chatId/:friendId", protect, chatIdController);
chatsRouter.get("/searchFriend/:username", protect, searchFriendController);
