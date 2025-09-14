import express from "express";
const BlogRouter = express.Router();

import upload from "../config/multer.js";
import { auth } from "../middleware/auth.js"; // keep as-is (auth for dashboard)
import {
  addBlog,
  getAllBlog,       // protected: dashboard / user-specific or admin
  deleteBlog,
  getBlog,          // protected: used by dashboard/editing
  updateBlog,
  SinglePageBlog,   // public
  RelatedBlog,      // public
  getBlogByCategory,// public
  searchBlog,       // public
  AllBlogs          // public
} from "../controllers/blog.control.js";

/**
 * Protected routes (dashboard / admin / author)
 * - auth runs BEFORE multer to prevent unauthenticated uploads
 */
BlogRouter.post("/add-blog", auth, upload.single("file"), addBlog);
BlogRouter.get("/all-blog", auth, getAllBlog);            // consider renaming to /dashboard/blogs
BlogRouter.get("/get-blog/:id", auth, getBlog);           // protected single blog for editing
BlogRouter.put("/update-blog/:id", auth, upload.single("file"), updateBlog);
BlogRouter.delete("/delete-blog/:id", auth, deleteBlog);

/**
 * Public routes (visitor-facing)
 */
BlogRouter.get("/single-blog/:category/:blog/:id", SinglePageBlog);
BlogRouter.get("/related-blog/:category/:id", RelatedBlog);
BlogRouter.get("/get-blog-by-category/:category", getBlogByCategory);
BlogRouter.get("/search", searchBlog); // e.g. /search?query=term
BlogRouter.get("/blogs", AllBlogs);    // list all public blogs

export default BlogRouter;
