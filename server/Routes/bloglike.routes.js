import express from "express";
const BlogLikeRouter = express.Router();
import {auth} from "../middleware/auth.js"

import { dolike } from "../controllers/bloglike.control.js";
import { getAll } from "../controllers/bloglike.control.js";

BlogLikeRouter.post("/add", auth , dolike);
// BlogLikeRouter.get("/count", getAll);
BlogLikeRouter.get("/count/:blogid", getAll);
BlogLikeRouter.get("/count/:blogid/:userid", getAll);

export default BlogLikeRouter;
