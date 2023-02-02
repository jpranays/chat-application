import React, { useContext, useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { userCnxt } from "../Context/AuthContext";
import { verifyToken } from "../API/auth";

function PersistRoute() {
	const { user, setUser, persist } = useContext(userCnxt);

	const [status, setStatus] = useState({
		loading: user ? false : true,
		error: false,
		done: user ? true : false,
	});

	useEffect(() => {
		!user && persist && verifyToken(setUser, setStatus);
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
