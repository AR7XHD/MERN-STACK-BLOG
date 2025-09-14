import express from "express";
import { addCategory, getAllCategory, getCategoryById, updateCategory, deleteCategory } from "../controllers/category.control.js";
const CategoryRouter = express.Router();
import {adminauth} from "../middleware/adminauth.js"








CategoryRouter.post("/add", adminauth, addCategory);
CategoryRouter.get("/all-category" , getAllCategory);
CategoryRouter.put("/update-category/:id",adminauth, updateCategory);
CategoryRouter.delete("/delete-category/:id",adminauth, deleteCategory);
CategoryRouter.get("/get-category/:id",adminauth, getCategoryById);

export default CategoryRouter;
