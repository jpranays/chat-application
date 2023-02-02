import * as React from "react";
import Navbar from "../Components/Navbar/Index";
import { Box, Container, Typography } from "@mui/material";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllRecentChat } from "../API/chats";

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
						<Link to={`/chats/${chat.chat_id}/${chat.user._id}`}>
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
					<Box
						sx={{
							width: "100%",
						}}
					>
						<Box
							sx={{ borderBottom: 2, paddingBottom: 3, borderColor: "divider" }}
						>
							<Container sx={{ mt: 5 }}>
								<Typography variant="h5" textAlign="center">
									Start chatting with your friends
								</Typography>
							</Container>
						</Box>
					</Box>
				)}
			</Container>
		</>
	);
}

export default Dashboard;
