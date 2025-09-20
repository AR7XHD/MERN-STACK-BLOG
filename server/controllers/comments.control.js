import Comment from "../models/comment.model.js";
import { handlerError } from "../helpers/handlerError.js";

export const addComment = async (req, res, next) => {
    try {
        // console.log("req.body",req.body);
        const {comment, author, blog} = req.body;

        const newComment = await Comment.create({comment, author, blog});
        
        res.status(201).json({
            success: true,
            message: "Comment added successfully"
        });
    } catch (error) {
        return next(handlerError(500, error.message));
    }
}

export const getAllComments = async (req, res, next) => {
    try {
        const {id} = req.params;
        
        const comments = await Comment.find({blog: id}).sort({createdAt: -1}).populate("author","username profilePicture").populate("blog","title").lean();
        res.status(200).json({
            success: true,
            message: "Comments fetched successfully",
            comments
        });
    } catch (error) {
        return next(handlerError(500, error.message));
    }
}

export const CommentCount = async (req, res, next) => {
    try {
        const {id} = req.params;
        
        const count = await Comment.countDocuments({blog: id});
        res.status(200).json({
            success: true,
            message: "Comment count fetched successfully",
            count
        });
    } catch (error) {
        return next(handlerError(500, error.message));
    }
}

export const getComments = async (req, res, next) => {
    try {
        const Currentuser = req.user
        // console.log(Currentuser)
        let comments;
        if(Currentuser.role== "admin"){
        comments = await Comment.find().sort({createdAt: -1}).populate("author","username profilePicture").populate("blog","title").lean();
    }
    else {
        comments = await Comment.find({author: Currentuser._id}).sort({createdAt: -1}).populate("author","username profilePicture").populate("blog","title").lean();
    }
        res.status(200).json({
            success: true,
            message: "Comments fetched successfully",
            comments
        });
        
    } catch (error) {
        return next(handlerError(500, error.message));
    }
}

    export const deleteComment = async (req, res, next) => {
        try {
            const comment = await Comment.findByIdAndDelete(req.params.id);
            res.status(200).json({
                success: true,
                message: "Comment deleted successfully"
            });
        } catch (error) {
            return next(handlerError(500, error.message));
        }
    }