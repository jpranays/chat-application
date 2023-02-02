import React from "react";
import PersistRoute from "./PersistRoute";
import { Route, Routes } from "react-router-dom";
import Dashboard from "../Pages/Dashboard";
import Friends from "../Pages/Friends";
import Chats from "../Pages/Chats";
import Register from "../Pages/Register";
import Login from "../Pages/Login";
import PrivateRoute from "./PrivateRoute";

function Index() {
	return (
		<Routes>
			<Route element={<PersistRoute />}>
				<Route element={<PrivateRoute />}>
					<Route path="/" element={<Dashboard />} />
				</Route>
				<Route element={<PrivateRoute />}>
					<Route path="/dashboard" element={<Dashboard />} />
				</Route>
				<Route element={<PrivateRoute />}>
					<Route path="/friends" element={<Friends />} />
				</Route>
				<Route element={<PrivateRoute />}>
					<Route path="/chats" element={<Chats />} />
				</Route>
				<Route element={<PrivateRoute />}>
					<Route path="/chats/:chatId/:userId" element={<Chats />} />
				</Route>
			</Route>
			<Route path="/register" element={<Register />} />
			<Route path="/login" element={<Login />} />
		</Routes>
	);
}

export default Index;
