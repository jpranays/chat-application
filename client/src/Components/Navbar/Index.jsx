import {
	AppBar,
	Box,
	Button,
	Container,
	Drawer,
	IconButton,
	List,
	ListItemButton,
	ListItemText,
	Menu,
	MenuItem,
	Toolbar,
	Tooltip,
	Typography,
} from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import MenuIcon from "@mui/icons-material/Menu";
import Avatar from "@mui/material/Avatar";

import { Divider, ListItem } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import { userCnxt } from "../../Context/AuthContext";
import { handleLogout } from "../../API/auth";

function Navbar({ pages }) {
	const [anchorElUser, setAnchorElUser] = React.useState(null);
	const [open, setOpen] = React.useState(false);
	const handleOpenUserMenu = (event) => {
		setAnchorElUser(event.currentTarget);
	};
	const navigate = useNavigate();
	const handleCloseUserMenu = () => {
		setAnchorElUser(null);
	};
	const { user, setPersist, setUser } = React.useContext(userCnxt);

	return (
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

					<Box
						sx={{
							flexGrow: 1,
							display: {
								xs: "flex",
								md: "none",
							},
						}}
					>
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
							<MenuItem
								onClick={() => {
									handleLogout(setUser, setPersist, navigate);
								}}
							>
								<Typography textAlign="center">Logout</Typography>
							</MenuItem>
						</Menu>
					</Box>
				</Toolbar>
			</Container>
		</AppBar>
	);
}

export default Navbar;
