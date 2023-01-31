import jwt from "jsonwebtoken";
import "dotenv/config";

export default (req, res, next) => {
	const token = req.headers["authorization"];
	if (!token) {
		return res.status(401).json({ message: "No token provided" });
	}
	const decoded = jwt.verify(token, process.env.JWT_SECRET);
	req.userId = decoded.id;
	next();
};
