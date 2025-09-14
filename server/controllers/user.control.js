// controllers/user.controller.js
import User from "../models/user.model.js";
import Blog from "../models/blog.model.js";
import Comment from "../models/comment.model.js";
import BlogLike from "../models/bloglike.model.js";
import { handlerError } from "../helpers/handlerError.js";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

// Helper: Upload buffer to Cloudinary
const uploadToCloudinary = async (buffer, folder = "mern-blog") => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { folder, resource_type: "image" },
            (error, result) => {
                if (result) resolve(result);
                else reject(error);
            }
        );
        streamifier.createReadStream(buffer).pipe(uploadStream);
    });
};

// Controller: Update User
export const updateUser = async (req, res, next) => {
    try {

        // console.log(req.body.file);
        const data = JSON.parse(req.body.data);
        const { userid } = req.params;

        const user = await User.findById(userid);
        if (!user) return next(handlerError(400, "User not found"));

        user.email = data.email;
        user.username = data.name;
        user.bio = data.bio;

        if (data.password) {
            user.password = bcryptjs.hashSync(data.password, 10);
        }

        // Memory upload to Cloudinary
        if (req.file) {
            console.log("📤 Uploading new image to Cloudinary from memory...");

            // Delete old image from Cloudinary if exists
            if (user.profilePicture) {
                try {
                    const publicId = user.profilePicture
                        .split("/")
                        .slice(-1)[0]
                        .split(".")[0]; // Extract public ID
                    await cloudinary.uploader.destroy(`mern-blog/${publicId}`, { resource_type: "image" });
                    console.log("🗑 Old image deleted from Cloudinary");
                } catch (err) {
                    console.warn("⚠️ Could not delete old image:", err.message);
                }
            }

            // Upload new image
            const uploadResult = await uploadToCloudinary(req.file.buffer, "mern-blog");
            console.log("✅ Cloudinary upload successful:", uploadResult.secure_url);
            user.profilePicture = uploadResult.secure_url;
        }

        await user.save();

        // Generate JWT
        const token = jwt.sign(
            {
                _id: user._id,
                email: user.email,
                authProvider: user.authProvider,
                username: user.username,
                profilePicture: user.profilePicture
            },
            process.env.JWT_SECRET
        );

        res.cookie("accessToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            path: "/",
        });

        const newUser = user.toObject({ getters: true });
        delete newUser.password;

        res.status(200).json({
            user: newUser,
            success: true,
            message: "User updated successfully"
        });

    } catch (error) {
        console.error("❌ Error in updateUser:", error);
        return next(handlerError(500, error.message));
    }
};

// Controller: Get User
export const getUser = async (req, res, next) => {
    try {
        const { userid } = req.params;
        const user = await User.findById(userid).lean().exec();

        if (!user) return next(handlerError(400, "User not found"));

        res.status(200).json({
            user,
            success: true,
            message: "User found successfully"
        });
    } catch (error) {
        return next(handlerError(500, error.message));
    }
};

export const getUsers = async (req, res, next)=> {
    try {
        const users = await User.find().lean().exec();
        
        res.status(200).json({
            users,
            success: true,
            message: "Users found successfully"
        });
        
    } catch (error) {
        return next(handlerError(500, error.message));
    }
}

export const deleteUser = async (req, res, next) => {
    try {
    const {userid} = req.params;
    const user = await User.findByIdAndDelete(userid);
    const blog = await Blog.deleteMany({author: userid});
    const comment = await Comment.deleteMany({author: userid});
    const bloglike = await BlogLike.deleteMany({author: userid});
    
    res.status(200).json({
        success: true,
        message: "User deleted successfully"
    });
    } catch (error) {
        return next(handlerError(500, error.message));
    }
}