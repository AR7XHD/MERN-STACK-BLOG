import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name: {type: String, required: true, trim: true},
    slug: {type: String, unique: true, trim: true, required: true},
    createdAt: {
        type: Date,
        default: Date.now,
    }, 
    
});

const Category = mongoose.model("Category", categorySchema, "categories");

export default Category;

