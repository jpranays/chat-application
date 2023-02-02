import React, { useContext, useEffect } from "react";
import { userCnxt } from "../Context/AuthContext";
import { Outlet, Navigate } from "react-router-dom";

function PrivateRoute() {
	const { user } = useContext(userCnxt);

	return <>{user ? <Outlet /> : <Navigate to="/login" />}</>;
}

export default PrivateRoute;
