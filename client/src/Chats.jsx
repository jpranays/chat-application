import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import { io } from "socket.io-client";

import {
	Divider,
	Drawer,
	FormControl,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	TextField,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { userCnxt } from "./AuthContext";
import { getFriends } from "./API/requests";
import { handleLogout } from "./API/auth";
import { getChatId, handleSendMessage } from "./API/chats";
import Navbar from "./Navbar";

const settings = ["Logout"];
let socket;
function Chats() {
	React.useEffect(() => {
		socket = io("http://localhost:3000/");
	}, []);
	const navigate = useNavigate();
	const { user, setUser, setPersist } = React.useContext(userCnxt);

	const [friends, setFriends] = React.useState([]);
	const [message, setMessage] = React.useState("");
	const [currentChat, setCurrentChat] = React.useState(null);
	const [receiver, setReceiver] = React.useState(null);
	const [messages, setMessages] = React.useState([]);
	React.useEffect(() => {
		getFriends(setFriends);
	}, []);
	React.useEffect(() => {
		if (receiver) getChatId(setCurrentChat, setMessages, receiver, socket);
	}, [receiver]);
	React.useEffect(() => {
		socket.on("newMessage", (data) => {
			console.log(data, receiver, currentChat);
			setMessages((prevMessages) => [...prevMessages, data]);
		});
	}, []);
	return (
		<>
			<Navbar pages={["Friends", "Chats"]} />
			{friends.length > 0 ? (
				<div
					className="container"
					style={{
						display: "grid",
						gridTemplateColumns: "250px 1fr",
					}}
				>
					<Box sx={{ width: "100%", maxWidth: 250 }}>
						<div className="list-column">
							{friends.map((friend) => (
								<List key={friend._id}>
									<ListItem disablePadding>
										<ListItemButton
											onClick={() => {
												setReceiver(friend._id);
											}}
											selected={receiver == friend._id}
										>
											<ListItemText primary={friend.username} />
										</ListItemButton>
									</ListItem>
									<Divider />
								</List>
							))}
						</div>
					</Box>
					<div
						className="message-action-area"
						style={{
							height: "90vh",
							width: "100%",
							borderLeft: "1px solid #ccc",
							position: "relative",
							display: "flex",
							flexDirection: "column",
							gap: "10px",
							padding: 5,
						}}
					>
						<>
							<div
								className="message-container"
								style={{
									height: "100%",
									width: "100%",
									display: "flex",
									flexDirection: "column",
									overflowY: "scroll",
								}}
							>
								{messages.length > 0 ? (
									messages.map(({ _id, sender, content }) => (
										<div
											className="message"
											key={_id}
											style={{
												padding: "5px 10px",
												marginLeft: sender == user._id ? "auto" : "0",
											}}
										>
											{content}
										</div>
									))
								) : (
									<Container sx={{ mt: 5 }}>
										<Typography variant="h5" textAlign="center">
											Start chatting !!!
										</Typography>
									</Container>
								)}
							</div>
							<div
								className="message-area"
								style={{
									width: "100%",
									display: "flex",
									gap: "10px",
									marginTop: "auto",
								}}
							>
								<FormControl
									sx={{
										width: "90%",
									}}
								>
									<TextField
										id="outlined-multiline-static"
										placeholder="Type something..."
										multiline
										rows={4}
										value={message}
										onChange={(e) => setMessage(e.target.value)}
									/>
								</FormControl>
								<Button
									variant="contained"
									sx={{
										width: "8%",
										alignSelf: "center",
									}}
									onClick={() => {
										handleSendMessage(
											message,
											currentChat,
											receiver,
											setMessage,
											setMessages,
											socket
										);
									}}
									disabled={!receiver || message.length < 1}
								>
									Send
								</Button>
							</div>
						</>
					</div>
				</div>
			) : (
				<Container sx={{ mt: 5 }}>
					<Typography variant="h5" textAlign="center">
						No friends currently to chat with :(
					</Typography>
				</Container>
			)}
		</>
	);
}

export default Chats;
