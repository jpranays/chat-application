import React, { createContext, useState } from "react";
export const userCnxt = createContext();
function AuthContext({ children }) {
	const [user, setUser] = useState(null);
	const [persist, setPersist] = useState(
		localStorage.getItem("token") || false
	);
	return (
		<userCnxt.Provider value={{ user, setUser, persist, setPersist }}>
			{children}
		</userCnxt.Provider>
	);
}

export default AuthContext;
