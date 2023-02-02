import React from "react";
import ReplyIcon from "@mui/icons-material/Reply";
import { IconButton } from "@mui/material";
import axios from "axios";
function Index({ content, sender, user, _id, isReply, replyTo, handleReply }) {
	const [replyToContent, setReplyToContent] = React.useState("");
	React.useEffect(() => {
		if (isReply) {
			(async () => {
				const {
					data: { message },
				} = await axios.get(`http://localhost:3000/chats/message/${replyTo}`, {
					headers: {
						authorization: `${localStorage.getItem("token")}`,
					},
				});
				setReplyToContent(message.content);
			})();
		}
	}, []);

	return (
		<div
			className="message"
			key={_id}
			style={{
				padding: "5px 10px",
				marginLeft: sender == user._id ? "auto" : "0",
				border: "1px solid #ccc",
				borderRadius: "15px",
				width: "fit-content",
				display: "flex",
				alignItems: "center",
				gap: "10px",
				fontWeight: 500,
			}}
		>
			{isReply && (
				<div
					style={{
						padding: "5px 10px",
						border: "1px solid #ccc",
						borderRadius: "15px",
						width: "fit-content",
						display: "flex",
						alignItems: "center",
						gap: "10px",
						fontWeight: 500,
					}}
				>
					{replyToContent}
				</div>
			)}
			{content}
			<IconButton
				aria-label="reply"
				color="primary"
				onClick={() => {
					handleReply(_id, content);
				}}
			>
				<ReplyIcon />
			</IconButton>
		</div>
	);
}

export default Index;
