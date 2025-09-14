import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    blog: {type: mongoose.Schema.Types.ObjectId, ref: "Blog", required: true},
    author: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    comment: {type: String, required: true, trim: true},
},{timestamps: true});

const Comment = mongoose.model("Comment", commentSchema, "comments");

export default Comment;

