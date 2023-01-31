import React from "react";
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
import { Link } from "react-router-dom";
function Register() {
	const [snackbar, setSnackbar] = React.useState({
		open: false,
		message: "User created",
		severity: "success",
	});
	const API_URL = "http://localhost:3000";
	const validationSchema = Yup.object({
		username: Yup.string().required().min(3).max(10),
		password: Yup.string().required().min(5).max(15),
		confirmPassword: Yup.string()
			.required()
			.equals([Yup.ref("password")], "Passwords dont match"),
	});
	async function handleRegister({ username, password }) {
		try {
			const { data } = await axios.post(`${API_URL}/register`, {
				username,
				password,
			});
			setSnackbar({
				open: true,
				message: data.message,
				severity: "success",
			});
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
					handleRegister(formValues);
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
						Create an account
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
					<Field name="confirmPassword">
						{({ field, form }) => {
							return (
								<FormControl
									error={Boolean(
										form.touched.confirmPassword && form.errors.confirmPassword
									)}
								>
									<InputLabel>Confirm Password</InputLabel>
									<Input type="password" {...field} />
									<FormHelperText>
										<ErrorMessage name="confirmPassword" />
									</FormHelperText>
								</FormControl>
							);
						}}
					</Field>
					<Button type="submit" variant="contained" color="primary">
						Register
					</Button>
					<span>
						Already an user? <Link to={"/login"}>Login</Link>
					</span>
				</Form>
			</Formik>
		</div>
	);
}

export default Register;
