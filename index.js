import bcrypt from "bcrypt";
import "dotenv/config";
import express from "express";
import { validationResult } from "express-validator";
import mongoose from "mongoose";

import userModel from "./models/userModel.js";
import { registerValidation } from "./validations/userValidation.js";

const PORT = process.env.PORT || 4001;
const app = express();

app.use(express.json());

app.post("/auth/register", registerValidation, async (req, res) => {
	try {
		const error = validationResult(req);
		if (!error.isEmpty()) {
			return res.status(400).json({ message: error });
		}

		const { fullName, email, password, avatarUrl } = req.body;
		const hash = await bcrypt.hash(password, 10);
		const userDoc = new userModel({
			fullName,
			email,
			passwordHash: hash,
			avatarUrl,
		});
		const user = await userDoc.save();
		res.json(user);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

const server = () => {
	try {
		mongoose
			.connect(process.env.DB_URL)
			.then(() => console.log("Data Base connected"))
			.catch((e) => console.log(e));

		app.listen(PORT, () => {
			console.log(`Server is running on port: ${PORT}`);
		});
	} catch (err) {
		console.log(err);
	}
};

server();
