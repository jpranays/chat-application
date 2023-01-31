import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
import { authRouter } from "./Routes/Auth.js";
import { requestRouter } from "./Routes/request.js";
import { chatsRouter } from "./Routes/Chats.js";

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

app.use("/users", authRouter);
app.use("/requests", requestRouter);
app.use("/chats", chatsRouter);

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
