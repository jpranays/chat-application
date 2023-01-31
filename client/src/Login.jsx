import React, { useContext } from "react";
import {
	Alert,
	Box,
	Button,
	FormControl,
	FormHelperText,
	Input,
	InputLabel,
	Snackbar,
	Typography,
} from "@mui/material";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import "./register.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { userCnxt } from "./AuthContext";

function Login() {
	const [snackbar, setSnackbar] = React.useState({
		open: false,
		message: "something went wrong",
		severity: "error",
	});
	const API_URL = "http://localhost:3000";
	const validationSchema = Yup.object({
		username: Yup.string().required(),
		password: Yup.string().required(),
	});
	const { setUser, setPersist } = useContext(userCnxt);
	const navigate = useNavigate();
	async function handleLogin({ username, password }) {
		try {
			const {
				data: { user, token },
			} = await axios.post(`${API_URL}/login`, {
				username,
				password,
			});
			setUser(user);
			console.log(user);
			navigate("/dashboard");
			setSnackbar({
				...snackbar,
				open: false,
			});
			setPersist(localStorage.getItem("token"));
			localStorage.setItem("token", token);
		} catch (error) {
			const { data } = error.response;
			console.log(data);
			setSnackbar({
				open: true,
				message: data.message || "Something went wrong",
				severity: "error",
			});
		}
	}
	return (
		<div className="form-container">
			<Snackbar
				open={snackbar.open}
				anchorOrigin={{
					vertical: "top",
					horizontal: "center",
				}}
			>
				<Alert
					severity={snackbar.severity}
					sx={{ width: "100%" }}
					onClose={() => {
						setSnackbar({
							...snackbar,
							open: false,
						});
					}}
				>
					{snackbar.message}
				</Alert>
			</Snackbar>
			<Formik
				initialValues={{
					username: "",
					password: "",
					confirmPassword: "",
				}}
				onSubmit={(formValues) => {
					handleLogin(formValues);
				}}
				validationSchema={validationSchema}
			>
				<Form
					style={{
						display: "grid",
						gridTemplateColumns: "1fr",
						gap: "15px",
						width: 300,
						boxShadow: "0 0 10px 0 rgba(0,0,0,0.2)",
						padding: "30px 20px",
						borderRadius: "5px",
					}}
					autoComplete="off"
					autoSave="off"
					autoCorrect="off"
					noValidate
				>
					<Typography variant="h6" component="div" gutterBottom>
						Login
					</Typography>
					<Field name="username">
						{({ field, form }) => {
							return (
								<FormControl
									error={Boolean(form.touched.username && form.errors.username)}
								>
									<InputLabel>Username</InputLabel>
									<Input type="text" {...field} />
									<FormHelperText>
										<ErrorMessage name="username" />
									</FormHelperText>
								</FormControl>
							);
						}}
					</Field>
					<Field name="password">
						{({ field, form }) => {
							return (
								<FormControl
									error={Boolean(form.touched.password && form.errors.password)}
								>
									<InputLabel>Password</InputLabel>
									<Input type="password" {...field} />
									<FormHelperText>
										<ErrorMessage name="password" />
									</FormHelperText>
								</FormControl>
							);
						}}
					</Field>
					<Button type="submit" variant="contained" color="primary">
						Login
					</Button>
					<span>
						No account? <Link to={"/register"}>Register</Link>
					</span>
				</Form>
			</Formik>
		</div>
	);
}

export default Login;
