import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const verifyToken = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password -refreshToken");

      if (!req.user) {
        res.status(401);
        throw new Error("Not authorized, user not found");
      }

      if (!req.user.isActive) {
        res.status(403);
        throw new Error("User account is inactive");
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      next(new Error("Not authorized, token failed"));
    }
  }

  if (!token) {
    res.status(401);
    next(new Error("Not authorized, no token"));
  }
};

export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (req.user && roles.includes(req.user.role)) {
      next();
    } else {
      res.status(403);
      next(new Error("Not authorized as this role"));
    }
  };
};
