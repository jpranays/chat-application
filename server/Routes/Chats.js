import { Router } from "express";
import protect from "../middleware/auth.js";
import {
	chatIdController,
	chatsController,
	messageByChatIdController,
	messageController,
	messageByIdController,
	searchFriendController,
} from "../controllers/Chats.js";
export const chatsRouter = Router();
chatsRouter.post("/message", protect, messageController);
chatsRouter.get("/message/:id", protect, messageByIdController);
chatsRouter.get("/messages/:chatId", protect, messageByChatIdController);
chatsRouter.get("/", protect, chatsController);
chatsRouter.get("/chatId/:friendId", protect, chatIdController);
chatsRouter.get("/searchFriend/:username", protect, searchFriendController);
