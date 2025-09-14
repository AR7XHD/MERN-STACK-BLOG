// import { handlerError } from "../helpers/handlerError"
import jwt from "jsonwebtoken";
import { handlerError } from "../helpers/handlerError.js";
import User from "../models/user.model.js";


export const adminauth = async (req,res,next) => {
    try{
    const accessToken = req.cookies?.accessToken
    if(!accessToken) {
       return next(handlerError(400,'Unauthorized'))
    }

    const decoded = jwt.verify(accessToken , process.env.JWT_SECRET)

    const userinfo = await User.findOne({_id : decoded._id})
    // console.log(userinfo)
    if(userinfo.role !== "admin") {
        return next(handlerError(400,'Unauthorized'))
    }
    else {
        req.user = userinfo ;
    // console.log(decoded);
    next()
    }
    }
    catch(error) {
        return next(handlerError(500, error.message));

    }

    }
    

    