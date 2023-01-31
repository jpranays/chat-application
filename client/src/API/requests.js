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
		console.log(data);
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
		console.log("friendRequests:", userFriendRequests);
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
		console.log("friendRequestsSent:", userFriendRequestsSent);
		setFriendRequestsSent(userFriendRequestsSent);
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
export async function handleBtnClick(choice, _id) {
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
		console.log(data);
	} catch (error) {
		console.log(error);
	}
}
