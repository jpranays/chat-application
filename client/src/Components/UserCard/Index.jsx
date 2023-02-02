import React from "react";
import { handleBtnClick } from "../../API/requests";
import { Stack } from "@mui/system";
import { Button, Typography } from "@mui/material";

function UserCard({ user: { username, _id }, action, setUpdate }) {
	return (
		<>
			<Stack
				direction="row"
				spacing={2}
				padding={1.5}
				justifyContent={"center"}
				sx={{
					border: "1px solid #ccc",
					borderRadius: "5px",
				}}
			>
				<Typography variant="h5">{username}</Typography>
				{action === "sendrequest" && (
					<Button
						variant="text"
						color="primary"
						onClick={() => {
							handleBtnClick("sendrequest", _id, setUpdate);
						}}
					>
						Send Request
					</Button>
				)}
				{action === "acceptrequest" && (
					<>
						<Button
							variant="text"
							color="primary"
							onClick={() => {
								handleBtnClick("acceptrequest", _id, setUpdate);
							}}
						>
							Accept
						</Button>
						<Button
							variant="text"
							color="primary"
							onClick={() => {
								handleBtnClick("rejectrequest", _id, setUpdate);
							}}
						>
							Reject
						</Button>
					</>
				)}
				{action === "cancelrequest" && (
					<Button
						variant="text"
						color="primary"
						onClick={() => {
							handleBtnClick("cancelrequest", _id, setUpdate);
						}}
					>
						Cancel
					</Button>
				)}
				{action === "removefriend" && (
					<Button
						variant="text"
						color="primary"
						onClick={() => {
							handleBtnClick("removefriend", _id, setUpdate);
						}}
					>
						Remove
					</Button>
				)}
			</Stack>
		</>
	);
}
export default UserCard;
