import express from "express";

import { StatusCodes } from "http-status-codes";

import userRouter from "./userRoute";
import authRouter from "./authRoute";
import chatRouter from "./chatRoute";
import messageRouter from "./messageRoute";
import { loggerWithNameSpace } from "../utils"

const router = express();
const logger = loggerWithNameSpace(__filename);

router.get("/", (_, res) => {
  logger.info("App is running");
  res.status(StatusCodes.OK).send({
    message: "App is running",
  });
});

// Use Routes
router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/c", chatRouter);
router.use("/messages", messageRouter);

export default router;
