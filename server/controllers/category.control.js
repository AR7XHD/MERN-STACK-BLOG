import Category from "../models/categories.model.js";
import { handlerError } from "../helpers/handlerError.js";


export const addCategory = async (req, res, next) => {
    try {
        
        const {name, slug} = req.body;

        const category = await Category.create({name, slug});

        res.status(200).json({
            success: true,
            message: "Category added successfully"
        });
    } catch (error) {
        return next(handlerError(500, error.message));
    }
};

export const getAllCategory = async (req, res, next) => {
    try {
        const category = await Category.find().lean().exec();
        res.status(200).json({
            success: true,
            message: "Category fetched successfully",
            category
        });
    } catch (error) {
        return next(handlerError(500, error.message));
    }
};

export const getCategoryById = async (req, res, next) => {
    try {
        const category = await Category.findById(req.params.id).lean().exec();
        res.status(200).json({
            success: true,
            message: "Category fetched successfully",
            category
        });
    } catch (error) {
        return next(handlerError(500, error.message));
    }
};

export const updateCategory = async (req, res, next) => {
    try {
        const {name, slug} = req.body;
        const category = await Category.findByIdAndUpdate(req.params.id, {name, slug});
        res.status(200).json({
            success: true,
            message: "Category updated successfully"
        });
    } catch (error) {
        return next(handlerError(500, error.message));
    }
};

export const deleteCategory = async (req, res, next) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);
        res.status(200).json({
            success: true,
            message: "Category deleted successfully"
        });
    } catch (error) {
        return next(handlerError(500, error.message));
    }
};