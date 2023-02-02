import axios from "axios";
const API_URL = "http://localhost:3000/requests";
export async function handleAddFriend(searchedUser) {
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
	} catch (error) {
		console.log(error);
	}
}
export async function getFriends(setFriends) {
	try {
		const {
			data: { friends: userFriends },
		} = await axios.get(`${API_URL}/friends`, {
			headers: {
				authorization: `${localStorage.getItem("token")}`,
			},
		});

		setFriends(userFriends);
	} catch (error) {
		console.log(error);
	}
}

export async function getFriendRequests(setFriendRequests) {
	try {
		const {
			data: { friendRequests: userFriendRequests },
		} = await axios.get(`${API_URL}/friendRequests`, {
			headers: {
				authorization: `${localStorage.getItem("token")}`,
			},
		});
		setFriendRequests(userFriendRequests);
	} catch (error) {
		console.log(error);
	}
}
export async function getFriendRequestsSent(setFriendRequestsSent) {
	try {
		const {
			data: { friendRequestsSent: userFriendRequestsSent },
		} = await axios.get(`${API_URL}/friendRequestsSent`, {
			headers: {
				authorization: `${localStorage.getItem("token")}`,
			},
		});
		setFriendRequestsSent(userFriendRequestsSent);
	} catch (error) {
		console.log(error);
	}
}

export async function handleBtnClick(choice, _id, setUpdate) {
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
		setUpdate((prev) => !prev);
	} catch (error) {
		console.log(error);
	}
}
