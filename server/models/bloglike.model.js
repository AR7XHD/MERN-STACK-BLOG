import mongoose from "mongoose";

const bloglikeSchema = new mongoose.Schema({
    blog: {type: mongoose.Schema.Types.ObjectId, ref: "Blog", required: true},
    author: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
},{timestamps: true});

const BlogLike = mongoose.model("BlogLike", bloglikeSchema, "bloglikes");

export default BlogLike;

