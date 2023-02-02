import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import PropTypes from "prop-types";
import {
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Grid,
	Tab,
	Tabs,
	TextField,
} from "@mui/material";
import {
	getFriendRequests,
	getFriendRequestsSent,
	getFriends,
} from "../API/requests";
import { handleSearchFriend } from "../API/chats";
import Navbar from "../Components/Navbar/Index";
import UserCard from "../Components/UserCard/Index";

function Friends() {
	const [friends, setFriends] = React.useState([]);
	const [friendRequests, setFriendRequests] = React.useState([]);
	const [friendRequestsSent, setFriendRequestsSent] = React.useState([]);
	const [update, setUpdate] = React.useState(false);
	const [username, setUsername] = React.useState("");
	const [openAddFriend, setOpenAddFriend] = React.useState(false);
	const [tabValue, setTabValue] = React.useState(0);
	const [searchedUser, setSearchedUser] = React.useState(null);

	React.useEffect(() => {
		getFriendRequests(setFriendRequests);
		getFriendRequestsSent(setFriendRequestsSent);
		getFriends(setFriends);
	}, [update]);

	function handleTabChange(event, newValue) {
		setTabValue(newValue);
		setUpdate(!update);
	}

	return (
		<>
			<Navbar pages={["Friends", "Chats"]} />
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
								<UserCard
									user={searchedUser}
									action="sendrequest"
									setUpdate={setUpdate}
								/>
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
								<Button
									onClick={() => {
										handleSearchFriend(searchedUser, setSearchedUser, username);
									}}
									color="primary"
								>
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
												<UserCard
													user={friend}
													action={"removefriend"}
													setUpdate={setUpdate}
												/>
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
												<UserCard
													user={user}
													action="acceptrequest"
													setUpdate={setUpdate}
												/>
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
												<UserCard
													user={user}
													action="cancelrequest"
													setUpdate={setUpdate}
												/>
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

function a11yProps(index) {
	return {
		id: `simple-tab-${index}`,
		"aria-controls": `simple-tabpanel-${index}`,
	};
}
export default Friends;
