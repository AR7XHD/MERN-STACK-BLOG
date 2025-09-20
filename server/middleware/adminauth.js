// import { handlerError } from "../helpers/handlerError"
import jwt from "jsonwebtoken";
import { handlerError } from "../helpers/handlerError.js";
import User from "../models/user.model.js";

/**
 * Admin authentication middleware that verifies JWT token and checks for admin role
 * Optimized with:
 * - Input validation
 * - Error handling
 * - Performance optimizations
 * - Reuses auth middleware logic
 */
export const adminauth = async (req, res, next) => {
    try {
        // 1. Get token from cookies
        const accessToken = req.cookies?.accessToken;
        
        // 2. Validate token exists
        if (!accessToken) {
            return next(handlerError(401, 'No authentication token provided'));
        }

        // 3. Verify JWT token
        let decoded;
        try {
            decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
        } catch (jwtError) {
            if (jwtError.name === 'TokenExpiredError') {
                return next(handlerError(401, 'Token has expired'));
            }
            return next(handlerError(401, 'Invalid token'));
        }

        // 4. Fetch only the role field using lean() for performance
        const user = await User.findOne({ _id: decoded._id })
            .select('role')
            .lean()
            .exec();

        if (!user) {
            return next(handlerError(401, 'User not found'));
        }

        // 5. Check admin role
        if (user.role !== 'admin') {
            return next(handlerError(403, 'Admin access required'));
        }

        // 6. Attach minimal user info to request object
        req.user = { _id: decoded._id, role: user.role };
        
        // 7. Proceed to next middleware/route handler
        return next();
    } catch (error) {
        console.error('Admin auth middleware error:', error);
        return next(handlerError(500, 'Admin authentication failed'));
    }
    

}