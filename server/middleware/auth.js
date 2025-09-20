import jwt from "jsonwebtoken";
import { handlerError } from "../helpers/handlerError.js";
import User from "../models/user.model.js";

/**
 * Authentication middleware that verifies JWT token and attaches user to request
 * Optimized with:
 * - Input validation
 * - Error handling
 * - Performance optimizations
 */
export const auth = async (req, res, next) => {
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

        // 4. Fetch user with only necessary fields using lean()
        const user = await User.findOne({ _id: decoded._id })
            .select('_id username email role profilePicture authProvider')
            .lean()
            .exec();

        if (!user) {
            return next(handlerError(401, 'User not found'));
        }

        // 5. Attach user to request object
        req.user = user;
        
        // 6. Proceed to next middleware/route handler
        return next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        return next(handlerError(500, 'Authentication failed'));
    }
};