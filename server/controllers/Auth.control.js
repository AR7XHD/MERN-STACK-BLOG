import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { handlerError } from "../helpers/handlerError.js";
import jwt from "jsonwebtoken";
import { makeCookieOptions } from "../helpers/cookieOptions.js"; // new helper

export const googleLogin = async (req, res, next) => {
  try {
    const { username, email, avatar, sign } = req.body;
    let isNew;
    let user = await User.findOne({ email });

    if (user) {
      isNew = false;
      if (user.authProvider !== "google") {
        return next(handlerError(400, `User already exists with ${user.authProvider}`));
      }
    }

    if (!user && sign === "signUp") {
      isNew = true;
      const password = Math.random().toString();
      const hashedPassword = bcryptjs.hashSync(password, 10);
      user = new User({ username, email, avatar, password: hashedPassword, authProvider: "google" });
      await user.save();
    }

    if (!user && sign === "signIn") {
      return next(handlerError(400, "User not found"));
    }

    if (user && isNew === false && sign === "signUp") {
      return next(handlerError(400, "User already exists"));
    }

    const token = jwt.sign(
      {
        _id: user._id,
        email: user.email,
        authProvider: user.authProvider,
        username: user.username,
        avatar: user.avatar
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const cookieOptions = makeCookieOptions();
    res.cookie("accessToken", token, cookieOptions); // no await

    const newUser = user.toObject({ getters: true });
    delete newUser.password;

    res.status(200).json({
      user: newUser,
      success: true,
      message: isNew ? "User registered successfully" : "User logged in successfully"
    });
  } catch (error) {
    return next(handlerError(500, error.message));
  }
};

export const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const checkUser = await User.findOne({ email }).lean();
    if (checkUser && checkUser.authProvider === "google") {
      return next(handlerError(400, `User already exists with ${checkUser.authProvider}`));
    }
    if (checkUser) {
      return next(handlerError(400, "User already exists"));
    }

    const hashedPassword = bcryptjs.hashSync(password, 10);
    const user = new User({ username, email, password: hashedPassword, authProvider: "email" });
    await user.save();

    const token = jwt.sign(
      { _id: user._id, email: user.email, authProvider: user.authProvider, username: user.username, avatar: user.avatar },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const cookieOptions = makeCookieOptions();
    res.cookie("accessToken", token, cookieOptions);

    const newUser = user.toObject({ getters: true });
    delete newUser.password;

    res.status(201).json({ user: newUser, success: true, message: "User registered successfully" });
  } catch (error) {
    return next(handlerError(500, error.message));
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && user.authProvider !== "email") {
      return next(handlerError(400, `User registered with ${user.authProvider}`));
    }
    if (!user) {
      return next(handlerError(400, "Invalid credentials"));
    }

    const result = await bcryptjs.compare(password, user.password);
    if (!result) {
      return next(handlerError(400, "Invalid credentials"));
    }

    const token = jwt.sign(
      { _id: user._id, email: user.email, authProvider: user.authProvider, username: user.username, avatar: user.avatar },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const cookieOptions = makeCookieOptions();
    res.cookie("accessToken", token, cookieOptions);

    const newUser = user.toObject({ getters: true });
    delete newUser.password;

    res.status(200).json({ user: newUser, success: true, message: "User logged in successfully" });
  } catch (error) {
    return next(handlerError(500, error.message));
  }
};

export const logout = async (req, res, next) => {
  try {
    const cookieOptions = makeCookieOptions();
    // Clear cookie with same options so browser removes it
    res.clearCookie("accessToken", { ...cookieOptions, maxAge: 0 });
    res.status(200).json({ success: true, message: "User logged out successfully" });
  } catch (error) {
    return next(handlerError(500, error.message));
  }
};
