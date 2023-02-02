import AuthContext from "./Context/AuthContext";
import AllRoutes from "./Routes/index.jsx";
function App() {
	return (
		<AuthContext>
			<AllRoutes />
		</AuthContext>
	);
}

export default App;
