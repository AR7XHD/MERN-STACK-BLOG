import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {type: String, required: true, trim: true},
    email: {type: String, unique: true, trim: true, required: true},
    authProvider: {type: String, enum: ["email", "google"], default: "email"},
    password: {type: String, required: true, trim: true},
    role: {type: String, enum: ["user", "admin"], default: "user"},
    createdAt: {
        type: Date,
        default: Date.now,
    }, 
    bio: {type: String, default: ""},
    profilePicture: {type: String, default: ""},
});

const User = mongoose.model("User", userSchema, "users");

export default User;
