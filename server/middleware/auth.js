// import { handlerError } from "../helpers/handlerError"
import jwt from "jsonwebtoken";
import { handlerError } from "../helpers/handlerError.js";
import User from "../models/user.model.js";


export const auth = async (req,res,next) => {
    const accessToken = req.cookies?.accessToken
    if(!accessToken) {
       return next(handlerError(400,'Unauthorized'))
    }

    const decoded = jwt.verify(accessToken , process.env.JWT_SECRET)
    const userinfo = await User.findOne({_id : decoded._id})
    req.user = userinfo
    // console.log(decoded);
    next()


}