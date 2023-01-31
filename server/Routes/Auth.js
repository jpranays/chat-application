import { Router } from "express";
import {
	authController,
	loginController,
	logoutController,
	registerController,
} from "../controllers/Auth.js";
export const authRouter = Router();

authRouter.post("/register", registerController);
authRouter.post("/login", loginController);
authRouter.get("/logout", logoutController);
authRouter.get("/auth", authController);
