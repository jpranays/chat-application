import { Route, Routes } from "react-router-dom";
import Dashboard from "./Dashboard";
import Login from "./Login";
import Register from "./Register";
import Chats from "./Chats";
import AuthContext from "./AuthContext";
import PrivateRoute from "./PrivateRoute";
import PersistRoute from "./PersistRoute";
import { useEffect } from "react";
import Friends from "./Friends";

function App() {
	return (
		<AuthContext>
			<Routes>
				<Route element={<PersistRoute />}>
					<Route element={<PrivateRoute />}>
						<Route path="/" element={<Dashboard />} />
						<Route path="/dashboard" element={<Dashboard />} />
						<Route path="/friends" element={<Friends />} />
						<Route path="/chats" element={<Chats />} />
					</Route>
				</Route>
				<Route path="/register" element={<Register />} />
				<Route path="/login" element={<Login />} />
			</Routes>
		</AuthContext>
	);
}

export default App;
