import express from "express";
import { addComment, getAllComments, CommentCount, getComments, deleteComment } from "../controllers/comments.control.js";
const CommentRouter = express.Router();
import {auth} from "../middleware/auth.js"
import { adminauth } from "../middleware/adminauth.js";

CommentRouter.post("/add", auth , addComment);
CommentRouter.get("/allcomments/:id", getAllComments);
CommentRouter.get("/commentcount/:id", CommentCount);
CommentRouter.get("/get-comments", auth, getComments);
CommentRouter.delete("/delete-comment/:id", auth, deleteComment);


export default CommentRouter;
