import * as React from "react";
import Navbar from "../Components/Navbar/Index";
import { Box, Container, Typography } from "@mui/material";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllRecentChat } from "../API/chats";
import { ReactComponent as DashboardSVG } from "../Assests/dashboard.svg";

function Dashboard() {
	const [recentChats, setRecentChats] = React.useState([]);
	useEffect(() => {
		getAllRecentChat(setRecentChats);
	}, []);
	return (
		<>
			<Navbar pages={["Friends", "Chats"]} />
			<Container sx={{ mt: 10 }}>
				{recentChats.length > 0 ? (
					recentChats.map((chat) => (
						<Link
							to={`/chats/${chat.chat_id}/${chat.user._id}`}
							key={chat.chat_id}
						>
							<Box
								sx={{
									display: "flex",
									flexDirection: "row",
									alignItems: "center",
									justifyContent: "space-between",
									border: "1px solid #ccc",
									borderRadius: "5px",
									p: 2,
									mb: 2,
									width: 300,
								}}
								key={chat.chat_id}
							>
								<Typography variant="h6">
									continue chat with {chat.user.username}
								</Typography>
								<Typography variant="h6">{chat.lastMessage}</Typography>
							</Box>
						</Link>
					))
				) : (
					<Container
						sx={{
							display: "flex",
							justifyContent: "center",
							position: "relative",
						}}
					>
						<DashboardSVG style={{ height: 500 }} />
						<Typography
							variant="h5"
							textAlign="center"
							fontFamily="cursive"
							sx={{
								position: "absolute",
								right: 0,
								width: 200,
								fontSize: 40,
								lineHeight: 2,
							}}
						>
							Start chatting with your friends
						</Typography>
					</Container>
				)}
			</Container>
		</>
	);
}

export default Dashboard;
