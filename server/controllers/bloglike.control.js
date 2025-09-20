import { handlerError } from "../helpers/handlerError.js";
import BlogLike from "../models/bloglike.model.js";

export const dolike = async (req, res, next) => {
    try {
        const { blog, author } = req.body;
        let like;
        like = await BlogLike.findOne({blog: blog, author: author}).lean();
        if(!like){
            like = await BlogLike.create({ blog, author });
            
        }else {
            like = await BlogLike.deleteOne({blog: blog, author: author});
           
        }
       const userCount = await BlogLike.countDocuments({blog: blog, author: author});
       const totalCount = await BlogLike.countDocuments({blog: blog});
        return res.status(200).json({ success: true, like, totalCount, userCount, message: "Count fetched successfully" });

    } catch (error) {
        return next(handlerError(500, error.message));
    }
};

export const getAll = async (req, res, next) => {
    try {
        const { blogid, userid } = req.params;
        const totalCount = await BlogLike.countDocuments({ blog: blogid });

        if (userid) {
            const userCount = await BlogLike.countDocuments({ blog: blogid, author: userid });
            return res.status(200).json({ success: true, totalCount, userCount, message: "Count fetched successfully" });
        }

        res.status(200).json({ success: true, totalCount, message: "Count fetched successfully" });
    } catch (error) {
        return next(handlerError(500, error.message));
    }
};
