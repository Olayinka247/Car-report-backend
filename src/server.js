import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import listEndpoints from "express-list-endpoints";
import {
  badRequestHandler,
  notFoundHandler,
  genericErrorHandler,
  unAuthorizedHandler,
} from "./errorHandlers.js";
import userRouter from "./apis/users/index.js";

const server = express();
const port = process.env.PORT || 3001;

//Middlewares
server.use(cors());
server.use(express.json());

//Routes
server.use("/users", userRouter);

//Error Handlers
server.use(badRequestHandler);
server.use(notFoundHandler);
server.use(unAuthorizedHandler);
server.use(genericErrorHandler);

//connect to mongoDB
mongoose.connect(process.env.MONGO_CONNECTION_URL);
mongoose.connection.on("connected", () => {
  console.log("Successfully Connected to MongoDB");
  server.listen(port, () => {
    console.table(listEndpoints(server));
    console.log(`Server is running on port ${port}`);
  });
});

server.on("error", (err) => {
  console.log("ERROR DETECTOR", err);
});
