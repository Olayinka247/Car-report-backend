import createHttpError from "http-errors";
import { verifyAccessToken } from "./tools.js";

// JWtMiddleware to check if a user is authorized, and only gives authorize users access to the route
export const JWTMiddleware = async (req, res, next) => {
  if (!req.headers.authorization) {
    next(
      createHttpError(401, "No token provided, Please provide bearer token")
    );
  } else {
    try {
      const token = req.headers.authorization.replace("Bearer ", "");
      const payload = await verifyAccessToken(token);
      req.user = {
        _id: payload._id,
      };
      next();
    } catch (error) {
      next(createHttpError(401, "Invalid token"));
    }
  }
};

// JWTMiddlewareAdmin gives admin previledges
export const JWTMiddlewareAdmin = async (req, res, next) => {
  if (!req.headers.authorization) {
    next(
      createHttpError(401, "No token provided, Please provide bearer token")
    );
  } else {
    try {
      const token = req.headers.authorization.replace("Bearer ", "");
      const payload = await verifyAccessToken(token);
      if (payload.role !== "admin") {
        next(createHttpError(401, "Admin Only"));
      } else {
        req.user = {
          _id: payload._id,
        };
        next();
      }
    } catch (error) {
      next(createHttpError(401, "Invalid token"));
    }
  }
};
