import axios from "axios";
const API_URL = "http://localhost:3000/chats";
export async function getChatId(setCurrentChat, setMessages, receiver, socket) {
	try {
		const {
			data: { _id, users, messages },
		} = await axios.get(`${API_URL}/chatId/${receiver}`, {
			headers: {
				authorization: `${localStorage.getItem("token")}`,
			},
		});
		setCurrentChat(_id);
		socket.emit("join", _id);
		setMessages(messages);
	} catch (error) {
		console.log(error);
	}
}
export async function handleSendMessage(
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
) {
	try {
		const { data } = await axios.post(
			`${API_URL}/message`,
			{
				content: message,
				chat_id: currentChat,
				to: receiver,
				isReplying: isReplying,
				replyMessageId: isReplying ? replyMessageId : null,
			},
			{
				headers: {
					authorization: `${localStorage.getItem("token")}`,
				},
			}
		);
		setMessage("");
		setIsReplying(false);
		setReplyMessage(null);
		setReplyMessageId(null);
		setMessages((prevMessages) => [...prevMessages, data]);
		socket.emit("message", {
			chatId: currentChat,
			message: data,
		});
	} catch (error) {
		console.log(error);
	}
}
export async function handleSearchFriend(
	searchedUser,
	setSearchedUser,
	username
) {
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
	} catch (error) {
		console.log(error);
	}
}
export const getAllRecentChat = async (setRecentChats) => {
	const {
		data: { chats },
	} = await axios.get(`${API_URL}`, {
		headers: {
			authorization: `${localStorage.getItem("token")}`,
		},
	});
	setRecentChats(chats);
};
export const getMessageContent = async (setReplyToContent, replyTo) => {
	const {
		data: { message },
	} = await axios.get(`http://localhost:3000/chats/message/${replyTo}`, {
		headers: {
			authorization: `${localStorage.getItem("token")}`,
		},
	});
	setReplyToContent(message.content);
};
