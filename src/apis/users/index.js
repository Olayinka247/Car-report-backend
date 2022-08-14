import express from "express";
import userModel from "./models.js";
import createError from "http-errors";
import { generateAccessToken } from "../../auth/tools.js";
import { JWTMiddleware, JWTMiddlewareAdmin } from "../../auth/token.js";

const userRouter = express.Router();

//GET /users and exclude the user with token
userRouter.get(
  "/",
  JWTMiddleware,
  JWTMiddlewareAdmin,
  async (req, res, next) => {
    try {
      const users = await userModel.find({ _id: { $ne: req.user._id } });
      res.send(users);
    } catch (err) {
      next(err);
    }
  }
);

// GET /users/:userId
userRouter.get("/me", JWTMiddleware, async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user._id);
    if (!user) {
      next(createError(404, `User  not found!`));
    }
    res.send(user);
  } catch (err) {
    next(err);
  }
});

// POST /users
userRouter.post("/register", async (req, res, next) => {
  try {
    const newUser = new userModel(req.body);
    const { _id } = await newUser.save();
    res.status(201).send({ _id });
  } catch (err) {
    next(err);
  }
});

// PUT /users/:userId
userRouter.put("/:userId", JWTMiddleware, async (req, res, next) => {
  try {
    const user = await userModel.findByIdAndUpdate(
      req.params.userId,
      req.body,
      { new: true, runValidators: true }
    );
    if (!user) {
      next(createError(404, `User with id ${req.params.userId} not found!`));
    }
    res.send(user);
  } catch (err) {
    next(err);
  }
});

// DELETE /users/:userId
userRouter.delete("/:userId", JWTMiddleware, async (req, res, next) => {
  try {
    const user = await userModel.findByIdAndDelete(req.params.userId);
    if (!user) {
      next(createError(404, `User with id ${req.params.userId} not found!`));
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

//login a user with email and password
userRouter.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.checkCredentials(email, password);
    if (!user) {
      next(createError(401, "Invalid credentials"));
    } else {
      const accessToken = await generateAccessToken({
        _id: user._id,
      });
      res.send({ accessToken });
    }
  } catch (err) {
    next(err);
  }
});

export default userRouter;
