import express from "express";
const UserRouter = express.Router();
import { getUser,updateUser, getUsers, deleteUser } from "../controllers/user.control.js";
import upload from "../config/multer.js";
import {auth} from "../middleware/auth.js"
import {adminauth} from "../middleware/adminauth.js"



UserRouter.get("/get-user/:userid", auth, getUser);
UserRouter.put("/update-user/:userid" , auth ,upload.single("profilePicture"), updateUser);
UserRouter.get("/get-users" ,adminauth , getUsers);
UserRouter.delete("/delete-user/:userid" ,adminauth, deleteUser);
export default UserRouter;
