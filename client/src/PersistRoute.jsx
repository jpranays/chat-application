import React, { useContext, useEffect, useState } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { userCnxt } from "./AuthContext";
import axios from "axios";

function PersistRoute() {
	const { user, setUser, persist } = useContext(userCnxt);

	const [status, setStatus] = useState({
		loading: user ? false : true,
		error: false,
		done: user ? true : false,
	});

	useEffect(() => {
		async function verifyToken() {
			try {
				if (localStorage.getItem("token")) {
					let token = localStorage.getItem("token");
					if (token) {
						const {
							data: { user },
						} = await axios.get("http://localhost:3000/auth", {
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
		!user && persist && verifyToken();
		if (!user && !persist) {
			setStatus({
				loading: false,
				error: true,
				done: false,
			});
		}
	}, []);
	return (
		<>
			{!status.loading ? (
				status.done ? (
					<Outlet />
				) : (
					status.error && <Navigate to="/login" />
				)
			) : null}
		</>
	);
}

export default PersistRoute;
