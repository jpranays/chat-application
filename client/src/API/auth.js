import axios from "axios";
const API_URL = "http://localhost:3000/users";
export async function handleRegister({ username, password }, setSnackbar) {
	try {
		const { data } = await axios.post(`${API_URL}/register`, {
			username,
			password,
		});
		setSnackbar({
			open: true,
			message: data.message,
			severity: "success",
		});
	} catch (error) {
		const { data } = error.response;
		setSnackbar({
			open: true,
			message: data.message || "Something went wrong",
			severity: "error",
		});
	}
}
export async function handleLogin(
	{ username, password },
	setSnackbar,
	setUser,
	navigate,
	setPersist
) {
	try {
		const {
			data: { user, token },
		} = await axios.post(`${API_URL}/login`, {
			username,
			password,
		});
		setUser(user);
		navigate("/dashboard");
		setPersist(localStorage.getItem("token"));
		localStorage.setItem("token", token);
	} catch (error) {
		const { data } = error.response;
		setSnackbar({
			open: true,
			message: data.message || "Something went wrong",
			severity: "error",
		});
	}
}
export async function handleLogout(setUser, setPersist, navigate) {
	try {
		await axios.get(`${API_URL}/logout`);
		setUser(null);
		setPersist(false);
		navigate("/login");
		localStorage.removeItem("token");
	} catch (error) {
		console.log(error);
	} finally {
		navigate("/login");
	}
}
export async function verifyToken(setUser, setStatus) {
	try {
		if (localStorage.getItem("token")) {
			let token = localStorage.getItem("token");
			if (token) {
				const {
					data: { user },
				} = await axios.get(`${API_URL}/auth`, {
					headers: {
						authorization: token,
					},
				});
				setUser(user);
				setStatus({
					loading: false,
					error: false,
					done: true,
				});
			} else {
				setStatus({
					loading: false,
					error: true,
					done: false,
				});
			}
		} else {
			setStatus({
				loading: false,
				error: true,
				done: false,
			});
		}
	} catch (err) {
		setStatus({
			loading: false,
			error: true,
			done: false,
		});
	}
}
