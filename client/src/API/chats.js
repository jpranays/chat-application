import axios from "axios";
const API_URL = "http://localhost:3000/chats";
export async function getChatId(setCurrentChat, setMessages, receiver) {
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
export async function handleSendMessage(
	message,
	currentChat,
	receiver,
	setMessage,
	setMessages
) {
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
		setMessages((prevMessages) => [...prevMessages, data]);
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
		console.log(data);
	} catch (error) {
		console.log(error);
	}
}
