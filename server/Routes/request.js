import { Router } from "express";
import {
	acceptRequestController,
	cancelRequestController,
	friendRequestsController,
	friendRequestsSentController,
	friendsController,
	rejectRequestController,
	removeFriendController,
	sendRequestController,
} from "../controllers/Request.js";
import protect from "../middleware/auth.js";
export const requestRouter = Router();

requestRouter.post("/sendrequest", protect, sendRequestController);
requestRouter.post("/acceptrequest", protect, acceptRequestController);
requestRouter.post("/rejectrequest", protect, rejectRequestController);
requestRouter.post("/cancelrequest", protect, cancelRequestController);
requestRouter.post("/removefriend", protect, removeFriendController);
requestRouter.get("/friends", protect, friendsController);
requestRouter.get("/friendRequests", protect, friendRequestsController);
requestRouter.get("/friendRequestsSent", protect, friendRequestsSentController);
