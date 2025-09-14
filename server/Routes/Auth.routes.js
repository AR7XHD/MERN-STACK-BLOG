import express from "express";
const AuthRouter = express.Router();
import { register, login, logout, googleLogin } from "../controllers/Auth.control.js";
import {auth} from "../middleware/auth.js"



AuthRouter.post("/register", register);
AuthRouter.post("/login", login);
AuthRouter.get("/logout", logout);
AuthRouter.post("/google-login", googleLogin);

export default AuthRouter;
