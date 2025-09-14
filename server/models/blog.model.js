import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, trim: true, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    image: { type: String },
    content: { type: String, trim: true, required: true }, // ✅ add content back
  },
  { timestamps: true }
);

const Blog = mongoose.model("Blog", blogSchema, "blogs");

export default Blog;
