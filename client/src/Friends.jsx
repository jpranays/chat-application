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
	Grid,
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
function Friends() {
	const [anchorElNav, setAnchorElNav] = React.useState(null);
	const [anchorElUser, setAnchorElUser] = React.useState(null);
	const [open, setOpen] = React.useState(false);
	const handleOpenNavMenu = (event) => {
		setAnchorElNav(event.currentTarget);
	};
	const handleOpenUserMenu = (event) => {
		setAnchorElUser(event.currentTarget);
	};
	const navigate = useNavigate();
	const { user, setUser, setPersist } = React.useContext(userCnxt);

	const handleCloseNavMenu = () => {
		setAnchorElNav(null);
	};

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
	const [friendRequests, setFriendRequests] = React.useState([]);
	const [friendRequestsSent, setFriendRequestsSent] = React.useState([]);
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
				console.log("friends:", userFriends);
				setFriends(userFriends);
			} catch (error) {
				console.log(error);
			}
		}
		async function getFriendRequests() {
			try {
				const {
					data: { friendRequests: userFriendRequests },
				} = await axios.get(`${API_URL}/friendRequests`, {
					headers: {
						authorization: `${localStorage.getItem("token")}`,
					},
				});
				console.log("friendRequests:", userFriendRequests);
				setFriendRequests(userFriendRequests);
			} catch (error) {
				console.log(error);
			}
		}
		async function getFriendRequestsSent() {
			try {
				const {
					data: { friendRequestsSent: userFriendRequestsSent },
				} = await axios.get(`${API_URL}/friendRequestsSent`, {
					headers: {
						authorization: `${localStorage.getItem("token")}`,
					},
				});
				console.log("friendRequestsSent:", userFriendRequestsSent);
				setFriendRequestsSent(userFriendRequestsSent);
			} catch (error) {
				console.log(error);
			}
		}
		getFriendRequests();
		getFriendRequestsSent();

		getFriends();
	}, []);
	const [username, setUsername] = React.useState("");
	const [openAddFriend, setOpenAddFriend] = React.useState(false);
	const [tabValue, setTabValue] = React.useState(0);
	const [searchedUser, setSearchedUser] = React.useState(null);

	async function handleAddFriend() {
		try {
			const { data } = await axios.post(
				`${API_URL}/sendrequest`,
				{
					receiver: searchedUser._id,
				},
				{
					headers: {
						authorization: `${localStorage.getItem("token")}`,
					},
				}
			);
			console.log(data);
			setFriendRequests(userFriendRequests);
		} catch (error) {
			console.log(error);
		}
	}
	function handleTabChange(event, newValue) {
		setTabValue(newValue);
	}
	async function handleSearchFriend() {
		if (searchedUser) {
			return setSearchedUser(null);
		}
		try {
			const { data } = await axios.get(`${API_URL}/searchFriend/${username}`, {
				headers: {
					authorization: `${localStorage.getItem("token")}`,
				},
			});
			setSearchedUser(data);
			console.log(data);
		} catch (error) {
			console.log(error);
		}
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
			<Container sx={{ mt: 5 }}>
				<Grid container spacing={2}>
					<Grid item xs={12} md={6} lg={4}>
						<Button
							variant="contained"
							color="primary"
							onClick={() => {
								setOpenAddFriend(true);
							}}
						>
							Add Friend
						</Button>
						<Dialog
							open={openAddFriend}
							onClose={() => {
								setOpenAddFriend(false);
							}}
							aria-labelledby="form-dialog-title"
						>
							<DialogTitle id="form-dialog-title">Add Friend</DialogTitle>
							{searchedUser ? (
								<UserCard user={searchedUser} action="sendrequest" />
							) : (
								<>
									<DialogContent>
										<DialogContentText>
											Enter the username of the friend you want to add
										</DialogContentText>
										<TextField
											autofill="off"
											autoComplete="off"
											margin="dense"
											id="name"
											placeholder="Username"
											type="text"
											fullWidth
											value={username}
											variant="standard"
											onChange={(e) => setUsername(e.target.value)}
										/>
									</DialogContent>
								</>
							)}
							<DialogActions>
								<Button
									onClick={() => {
										setUsername("");
										setSearchedUser(null);
										setOpenAddFriend(false);
									}}
									color="primary"
								>
									Cancel
								</Button>
								<Button onClick={handleSearchFriend} color="primary">
									Search
								</Button>
							</DialogActions>
						</Dialog>
					</Grid>
				</Grid>
			</Container>

			<Container sx={{ mt: 5 }}>
				<Box sx={{ width: "100%" }}>
					<Box sx={{ borderBottom: 1, borderColor: "divider" }}>
						<Tabs
							value={tabValue}
							onChange={handleTabChange}
							aria-label="basic tabs example"
						>
							<Tab label="Friends" {...a11yProps(0)} />
							<Tab label="Friend Requests" {...a11yProps(1)} />
							<Tab label="Friend Request Sent" {...a11yProps(2)} />
						</Tabs>
						<TabPanel value={tabValue} index={0}>
							{friends.length > 0 ? (
								<Container sx={{ mt: 5 }}>
									<Grid container spacing={2}>
										{friends.map((friend) => (
											<Grid item xs={12} md={6} lg={4} key={friend._id}>
												<UserCard user={friend} action={"removefriend"} />
											</Grid>
										))}
									</Grid>
								</Container>
							) : (
								<Container sx={{ mt: 5 }}>
									<Typography variant="h5" textAlign="center">
										No friends found
									</Typography>
								</Container>
							)}
						</TabPanel>
						<TabPanel value={tabValue} index={1}>
							{friendRequests.length > 0 ? (
								<Container sx={{ mt: 5 }}>
									<Grid container spacing={2}>
										{friendRequests.map((user) => (
											<Grid item xs={12} md={6} lg={4} key={user._id}>
												<UserCard user={user} action="acceptrequest" />
											</Grid>
										))}
									</Grid>
								</Container>
							) : (
								<Container sx={{ mt: 5 }}>
									<Typography variant="h5" textAlign="center">
										No friend requests found
									</Typography>
								</Container>
							)}
						</TabPanel>
						<TabPanel value={tabValue} index={2}>
							{friendRequestsSent.length > 0 ? (
								<Container sx={{ mt: 5 }}>
									<Grid container spacing={2}>
										{friendRequestsSent.map((user) => (
											<Grid item xs={12} md={6} lg={4} key={user._id}>
												<UserCard user={user} action="cancelrequest" />
											</Grid>
										))}
									</Grid>
								</Container>
							) : (
								<Container sx={{ mt: 5 }}>
									<Typography variant="h5" textAlign="center">
										No friend requests sent found
									</Typography>
								</Container>
							)}
						</TabPanel>
					</Box>
				</Box>
			</Container>
		</>
	);
}

function TabPanel(props) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}
		>
			{value === index && <Box sx={{ p: 3 }}>{children}</Box>}
		</div>
	);
}
TabPanel.propTypes = {
	children: PropTypes.node,
	index: PropTypes.number.isRequired,
	value: PropTypes.number.isRequired,
};
function UserCard({ user: { username, _id }, action }) {
	async function handleBtnClick(choice, _id) {
		try {
			const { data } = await axios.post(
				`${API_URL}/${choice}`,
				{
					id: _id,
				},
				{
					headers: {
						authorization: `${localStorage.getItem("token")}`,
					},
				}
			);
			console.log(data);
		} catch (error) {
			console.log(error);
		}
	}
	return (
		<>
			<Stack
				direction="row"
				spacing={2}
				padding={1.5}
				justifyContent={"center"}
				style={{
					border: "1px solid #ccc",
					borderRadius: "5px",
				}}
			>
				<Typography variant="h5">{username}</Typography>
				{action === "sendrequest" && (
					<Button
						variant="text"
						color="primary"
						onClick={() => {
							handleBtnClick("sendrequest", _id);
						}}
					>
						Send Request
					</Button>
				)}
				{action === "acceptrequest" && (
					<>
						<Button
							variant="text"
							color="primary"
							onClick={() => {
								handleBtnClick("acceptrequest", _id);
							}}
						>
							Accept
						</Button>
						<Button
							variant="text"
							color="primary"
							onClick={() => {
								handleBtnClick("rejectrequest", _id);
							}}
						>
							Reject
						</Button>
					</>
				)}
				{action === "cancelrequest" && (
					<Button
						variant="text"
						color="primary"
						onClick={() => {
							handleBtnClick("cancelrequest", _id);
						}}
					>
						Cancel
					</Button>
				)}
				{action === "removefriend" && (
					<Button
						variant="text"
						color="primary"
						onClick={() => {
							handleBtnClick("removefriend", _id);
						}}
					>
						Remove
					</Button>
				)}
			</Stack>
		</>
	);
}

function a11yProps(index) {
	return {
		id: `simple-tab-${index}`,
		"aria-controls": `simple-tabpanel-${index}`,
	};
}
export default Friends;
