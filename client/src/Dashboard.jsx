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

import {
	Divider,
	Drawer,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
} from "@mui/material";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { userCnxt } from "./AuthContext";
const pages = ["Friends", "Chats", "Blog"];
const API_URL = "http://localhost:3000";

const settings = ["Logout"];
function Dashboard() {
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
	const { setUser, setPersist } = React.useContext(userCnxt);

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
							sx={{
								mr: 2,
								display: { xs: "flex", md: "none" },
								flexGrow: 1,
								fontFamily: "monospace",
								fontWeight: 700,
								letterSpacing: ".3rem",
								color: "inherit",
								textDecoration: "none",
								cursor: "pointer",
							}}
							onClick={() => {
								navigate("/");
							}}
						>
							Chat App
						</Typography>
						<Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
							{pages.map((page) => (
								<Button
									key={page}
									onClick={() => {
										navigate(`/${page.toLowerCase()}`, {
											replace: true,
										});
									}}
									sx={{ my: 2, color: "white", display: "block" }}
								>
									{page}
								</Button>
							))}
						</Box>

						<Box sx={{ flexGrow: 0 }}>
							<Tooltip title="Open settings">
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
		</>
	);
}

export default Dashboard;
