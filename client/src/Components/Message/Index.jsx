import React from "react";
import ReplyIcon from "@mui/icons-material/Reply";
import { IconButton } from "@mui/material";
import { getMessageContent } from "../../API/chats";
import { userCnxt } from "../../Context/AuthContext";
import "./style.css";
function Index({ content, sender, _id, isReply, replyTo, handleReply }) {
	const { user } = React.useContext(userCnxt);
	const [replyToContent, setReplyToContent] = React.useState("");
	React.useEffect(() => {
		if (isReply) {
			getMessageContent(setReplyToContent, replyTo);
		}
	}, []);

	return (
		<div
			className="message"
			key={_id}
			style={{
				marginLeft: sender == user._id ? "auto" : "0",
			}}
		>
			{isReply && <div className="replyTo">{replyToContent}</div>}
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
