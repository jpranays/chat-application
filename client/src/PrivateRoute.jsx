import React, { useContext, useEffect } from "react";
import { userCnxt } from "./AuthContext";
import { Outlet, Navigate } from "react-router-dom";

function PrivateRoute() {
	console.log("In Private Route");
	const { user } = useContext(userCnxt);

	return <>{user ? <Outlet /> : <Navigate to="/login" />}</>;
}

export default PrivateRoute;
