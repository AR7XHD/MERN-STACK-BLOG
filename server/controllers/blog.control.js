import Blog from "../models/blog.model.js";
import { handlerError } from "../helpers/handlerError.js";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";
import { encode } from "entities";
import User from "../models/user.model.js";
import Category from "../models/categories.model.js";

const uploadToCloudinary = async (buffer, folder = "mern-blog") => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "auto" },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

export const addBlog = async (req, res, next) => {
  try {
    const { data } = req.body; // JSON string containing author, title, slug, category, content
    const file = req.file;
    const parsed = JSON.parse(data || "{}");
    const { author, title, slug, category, content } = parsed;

    // basic validation - you can rely on front-end zod validation but double-check here
    if (!author || !title || !slug || !category) {
      return next(handlerError(400, "Missing required fields"));
    }

    // encode content to avoid accidental entity issues (optional)
    const encodedContent = content ? encode(content) : "";

    let image = "";

    if (file) {
      try {
        console.log("📤 Uploading new image to Cloudinary...");
        const uploadResult = await uploadToCloudinary(file.buffer, "mern-blog");
        console.log("✅ Cloudinary upload successful:", uploadResult.secure_url);
        image = uploadResult.secure_url;
      } catch (error) {
        return next(handlerError(500, error.message));
      }
    }

    const blog = await Blog.create({
      author,
      title,
      slug,
      category,
      content: encodedContent,
      image,
    });

    return res.status(201).json({
      success: true,
      message: "Blog added successfully",
      blog,
    });
  } catch (error) {
    return next(handlerError(500, error.message));
  }
};

export const getAllBlog = async (req, res, next) => {
  try {
    const user = req.user;
    const currentUser = await User.findById(user._id).lean().exec();
    let blog;

    if (currentUser.role === "admin") {
      blog = await Blog.find()
        .populate("author", "username profilePicture")
        .populate("category", "name slug")
        .lean()
        .exec();
    } else {
      blog = await Blog.find({ author: currentUser._id })
        .populate("author", "username profilePicture")
        .populate("category", "name slug")
        .lean()
        .exec();
    }

    res.status(200).json({
      success: true,
      message: "Blogs fetched successfully",
      blog,
    });
  } catch (error) {
    return next(handlerError(500, error.message));
  }
};

export const deleteBlog = async (req, res, next) => {
  try {
    // Optionally: delete image from Cloudinary if exists
    const blog = await Blog.findById(req.params.id).lean().exec();
    if (!blog) return next(handlerError(404, "Blog not found"));

    if (blog.image) {
      try {
        // extract publicId from cloudinary url (best effort)
        const parts = blog.image.split("/");
        const last = parts[parts.length - 1];
        const publicId = last.split(".")[0];
        await cloudinary.uploader.destroy(`mern-blog/${publicId}`, { resource_type: "image" });
      } catch (err) {
        console.warn("Could not delete cloudinary image:", err.message);
      }
    }

    await Blog.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Blog deleted successfully",
    });
  } catch (error) {
    return next(handlerError(500, error.message));
  }
};

export const getBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate("author", "username profilePicture")
      .populate("category", "name")
      .lean()
      .exec();

    if (!blog) return next(handlerError(404, "Blog not found"));

    res.status(200).json({
      success: true,
      message: "Blog fetched successfully",
      blog,
    });
  } catch (error) {
    return next(handlerError(500, error.message));
  }
};

export const updateBlog = async (req, res, next) => {
  try {
    const { data } = req.body;
    const file = req.file;
    const parsed = JSON.parse(data || "{}");
    const { author, title, slug, category, content } = parsed;

    if (!author || !title || !slug || !category) {
      return next(handlerError(400, "Missing required fields"));
    }

    // find existing blog
    const existing = await Blog.findById(req.params.id).exec();
    if (!existing) return next(handlerError(404, "Blog not found"));

    // if new file provided and existing has image -> attempt to remove old image
    let image = existing.image || "";

    if (file) {
      if (existing.image) {
        try {
          const parts = existing.image.split("/");
          const last = parts[parts.length - 1];
          const publicId = last.split(".")[0];
          await cloudinary.uploader.destroy(`mern-blog/${publicId}`, { resource_type: "image" });
          console.log("🗑 Old image deleted from Cloudinary");
        } catch (err) {
          console.warn("⚠️ Could not delete old image:", err.message);
        }
      }

      try {
        const uploadResult = await uploadToCloudinary(file.buffer, "mern-blog");
        image = uploadResult.secure_url;
      } catch (error) {
        return next(handlerError(500, error.message));
      }
    }

    const encodedContent = content ? encode(content) : existing.content || "";

    await Blog.findByIdAndUpdate(
      req.params.id,
      {
        author,
        title,
        slug,
        category,
        content: encodedContent,
        image,
      },
      { new: true }
    ).exec();

    return res.status(200).json({
      success: true,
      message: "Blog updated successfully",
    });
  } catch (error) {
    return next(handlerError(500, error.message));
  }
};

export const SinglePageBlog = async (req, res, next) => {
  try {
    const { category: categorySlug, blog: blogSlug, id } = req.params;

    const blog = await Blog.findOne({ _id: id })
      .populate("author", "username profilePicture")
      .populate("category", "name slug")
      .lean()
      .exec();

    if (!blog) return next(handlerError(404, "Blog not found"));

    res.status(200).json({
      success: true,
      message: "Blog fetched successfully",
      blog,
    });
  } catch (error) {
    return next(handlerError(500, error.message));
  }
};

export const RelatedBlog = async (req, res, next) => {
  try {
    const { category, id } = req.params;
    const categoryData = await Category.findOne({ slug: category }).lean().exec();
    if (!categoryData) return next(handlerError(404, "Category not found"));

    const blog = await Blog.find({ category: categoryData._id, _id: { $ne: id } })
      .populate("author", "username profilePicture")
      .populate("category", "name slug")
      .lean()
      .exec();

    res.status(200).json({
      success: true,
      message: "Blog fetched successfully",
      blog,
    });
  } catch (error) {
    return next(handlerError(500, error.message));
  }
};

export const getBlogByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;
    const categoryData = await Category.findOne({ slug: category }).lean().exec();
    if (!categoryData) return next(handlerError(404, "Category not found"));

    const blog = await Blog.find({ category: categoryData._id })
      .populate("author", "username profilePicture")
      .populate("category", "name slug")
      .lean()
      .exec();

    res.status(200).json({
      success: true,
      message: "Blog fetched successfully",
      blog,
    });
  } catch (error) {
    return next(handlerError(500, error.message));
  }
};

export const searchBlog = async (req, res, next) => {
  try {
    const { query } = req.query;
    const blog = await Blog.find({ title: { $regex: query, $options: "i" } })
      .populate("author", "username profilePicture")
      .populate("category", "name slug")
      .lean()
      .exec();

    res.status(200).json({
      success: true,
      message: "Blog fetched successfully",
      blog,
    });
  } catch (error) {
    return next(handlerError(500, error.message));
  }
};

export const AllBlogs = async (req, res, next) => {
  try {
    const blog = await Blog.find()
      .populate("author", "username profilePicture role")
      .populate("category", "name slug")
      .lean()
      .exec();

    res.status(200).json({
      success: true,
      message: "Blogs fetched successfully",
      blog,
    });
  } catch (error) {
    return next(handlerError(500, error.message));
  }
};
