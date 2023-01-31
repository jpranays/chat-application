import * as React from "react";
import Navbar from "./Navbar";

function Dashboard() {
	return (
		<>
			<Navbar pages={["Friends", "Chats", "Blog"]} />
		</>
	);
}

export default Dashboard;
