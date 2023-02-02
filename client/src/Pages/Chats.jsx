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
	IconButton,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	TextField,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { userCnxt } from "../Context/AuthContext";
import { getFriends } from "../API/requests";
import { getChatId, handleSendMessage } from "../API/chats";
import Navbar from "../Components/Navbar/Index";
import Message from "../Components/Message/Index";
import CloseIcon from "@mui/icons-material/Close";
let socket;
function Chats() {
	const messageAreaRef = React.useRef(null);
	const params = useParams();

	const { user } = React.useContext(userCnxt);
	const [friends, setFriends] = React.useState([]);
	const [message, setMessage] = React.useState("");
	const [currentChat, setCurrentChat] = React.useState(params.chatId || null);
	const [receiver, setReceiver] = React.useState(params.userId || null);
	const [messages, setMessages] = React.useState([]);

	const [isReplying, setIsReplying] = React.useState(false);
	const [replyMessage, setReplyMessage] = React.useState(null);
	const [replyMessageId, setReplyMessageId] = React.useState(null);

	function handleReply(_id, content) {
		setIsReplying(true);
		setReplyMessage(content);
		setReplyMessageId(_id);
	}
	React.useEffect(() => {
		socket = io("http://localhost:3000/");
	}, []);
	React.useEffect(() => {
		getFriends(setFriends);
	}, []);
	React.useEffect(() => {
		if (receiver) getChatId(setCurrentChat, setMessages, receiver, socket);
	}, [receiver]);
	React.useEffect(() => {
		socket.on("newMessage", (data) => {
			setMessages((prevMessages) => [...prevMessages, data]);
		});
	}, []);
	React.useEffect(() => {
		if (messages.length > 0)
			messageAreaRef.current.scrollTop = messageAreaRef.current.scrollHeight;
	}, [messages]);

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
									gap: "10px",
									padding: 5,
								}}
								ref={messageAreaRef}
							>
								{messages.length > 0 ? (
									messages.map(({ _id, sender, content, isReply, replyTo }) => (
										<Message
											key={_id}
											_id={_id}
											content={content}
											sender={sender}
											user={user}
											isReply={isReply}
											replyTo={replyTo}
											handleReply={handleReply}
										/>
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
										style={{
											position: "relative",
										}}
									/>
									{isReplying && (
										<div
											style={{
												position: "absolute",
												top: -44,
												left: 0,
												width: "100%",
												background: "rgba(25, 118, 210, 0.08)",
												borderRadius: "10px 10px 0px 0px",
												padding: 10,
												paddingLeft: 20,
												color: "dimgray",
												fontWeight: "light",
											}}
										>
											{replyMessage}
											<IconButton
												aria-label="cancel-reply"
												color="warning"
												sx={{
													position: "absolute",
													left: "95%",
													top: "12%",
												}}
												onClick={() => {
													setIsReplying(false);
												}}
											>
												<CloseIcon />
											</IconButton>
										</div>
									)}
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
											socket,
											isReplying,
											replyMessageId,
											setIsReplying,
											setReplyMessage,
											setReplyMessageId
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
