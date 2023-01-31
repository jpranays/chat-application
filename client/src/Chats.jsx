import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import ChatIcon from "@mui/icons-material/Chat";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import PropTypes from "prop-types";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import {
	Chip,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Divider,
	Drawer,
	FormControl,
	FormHelperText,
	Grid,
	Input,
	InputLabel,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Tab,
	Tabs,
	TextField,
} from "@mui/material";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { userCnxt } from "./AuthContext";
import { Stack } from "@mui/system";
const pages = ["Friends", "Chats", "Blog"];
const API_URL = "http://localhost:3000";

const settings = ["Logout"];
function Chats() {
	const [anchorElUser, setAnchorElUser] = React.useState(null);
	const [open, setOpen] = React.useState(false);

	const handleOpenUserMenu = (event) => {
		setAnchorElUser(event.currentTarget);
	};
	const navigate = useNavigate();
	const { user, setUser, setPersist } = React.useContext(userCnxt);

	const handleCloseUserMenu = () => {
		setAnchorElUser(null);
	};

	async function handleLogout() {
		try {
			await axios.get(`${API_URL}/logout`);
			setUser(null);
			setPersist(false);
			navigate("/login");
			localStorage.removeItem("token");
		} catch (error) {
			console.log(error);
		} finally {
			navigate("/login");
		}
	}
	const [friends, setFriends] = React.useState([]);
	const [message, setMessage] = React.useState("");
	const [currentChat, setCurrentChat] = React.useState(null);
	const [receiver, setReceiver] = React.useState(null);
	const [messages, setMessages] = React.useState([]);
	React.useEffect(() => {
		async function getFriends() {
			try {
				const {
					data: { friends: userFriends },
				} = await axios.get(`${API_URL}/friends`, {
					headers: {
						authorization: `${localStorage.getItem("token")}`,
					},
				});

				setFriends(userFriends);
			} catch (error) {
				console.log(error);
			}
		}
		getFriends();
	}, []);
	React.useEffect(() => {
		async function getChatId() {
			try {
				const {
					data: { _id, users, messages },
				} = await axios.get(`${API_URL}/chatId/${receiver}`, {
					headers: {
						authorization: `${localStorage.getItem("token")}`,
					},
				});
				setCurrentChat(_id);
				setMessages(messages);
			} catch (error) {
				console.log(error);
			}
		}
		if (receiver) getChatId();
	}, [receiver]);
	function handleSendMessage() {
		async function sendMessage() {
			try {
				const { data } = await axios.post(
					`${API_URL}/message`,
					{
						content: message,
						chat_id: currentChat,
						to: receiver,
					},
					{
						headers: {
							authorization: `${localStorage.getItem("token")}`,
						},
					}
				);
				setMessage("");
				console.log(messages, data);
				setMessages((prevMessages) => [...prevMessages, data]);
			} catch (error) {
				console.log(error);
			}
		}
		sendMessage();
	}

	return (
		<>
			<AppBar position="static">
				<Container maxWidth="xl">
					<Toolbar disableGutters>
						<ChatIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
						<Typography
							variant="h6"
							noWrap
							component="a"
							href="/"
							sx={{
								mr: 2,
								display: { xs: "none", md: "flex" },
								fontFamily: "monospace",
								fontWeight: 700,
								letterSpacing: ".3rem",
								color: "inherit",
								textDecoration: "none",
							}}
						>
							Chat App
						</Typography>

						<Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
							<IconButton
								size="large"
								aria-label="account of current user"
								aria-controls="menu-appbar"
								aria-haspopup="true"
								onClick={() => {
									setOpen(true);
								}}
								color="inherit"
							>
								<MenuIcon />
							</IconButton>
							<Drawer
								anchor={"left"}
								open={open}
								sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}
								onClose={() => {
									setOpen(false);
								}}
							>
								<Box
									sx={{
										width: 250,
									}}
									role="presentation"
								>
									<IconButton
										size="large"
										aria-label="account of current user"
										aria-controls="menu-appbar"
										aria-haspopup="true"
										onClick={() => {
											setOpen(false);
										}}
										color="inherit"
										sx={{}}
									>
										<MenuIcon />
									</IconButton>
									<Divider />
									<List>
										{pages.map((text, index) => (
											<ListItem
												key={text}
												disablePadding
												onClick={() => {
													navigate(`/${text.toLowerCase()}`);
												}}
												sx={{
													backgroundColor: "transparent",
												}}
											>
												<ListItemButton>
													<ListItemIcon>
														{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
													</ListItemIcon>
													<ListItemText primary={text} />
												</ListItemButton>
											</ListItem>
										))}
									</List>
									<Divider />
								</Box>
							</Drawer>
						</Box>
						<ChatIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />
						<Typography
							variant="h5"
							noWrap
							component="a"
							href="/"
							sx={{
								mr: 2,
								display: { xs: "flex", md: "none" },
								flexGrow: 1,
								fontFamily: "monospace",
								fontWeight: 700,
								letterSpacing: ".3rem",
								color: "inherit",
								textDecoration: "none",
							}}
						>
							Chat App
						</Typography>
						<Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
							{pages.map((page) => (
								<Button
									key={page}
									onClick={() => {
										navigate(`/${page.toLowerCase()}`);
									}}
									sx={{
										my: 2,
										color: "white",
										display: "block",
									}}
								>
									{page}
								</Button>
							))}
						</Box>

						<Box sx={{ flexGrow: 0 }}>
							<Tooltip title={user.username}>
								<IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
									<Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
								</IconButton>
							</Tooltip>
							<Menu
								sx={{ mt: "45px" }}
								id="menu-appbar"
								anchorEl={anchorElUser}
								anchorOrigin={{
									vertical: "top",
									horizontal: "right",
								}}
								keepMounted
								transformOrigin={{
									vertical: "top",
									horizontal: "right",
								}}
								open={Boolean(anchorElUser)}
								onClose={handleCloseUserMenu}
							>
								<MenuItem onClick={handleLogout}>
									<Typography textAlign="center">Logout</Typography>
								</MenuItem>
							</Menu>
						</Box>
					</Toolbar>
				</Container>
			</AppBar>
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
									onClick={handleSendMessage}
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
