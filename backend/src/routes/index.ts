import express from "express";
import { StatusCodes } from "http-status-codes";

import userRouter from "./userRoute";
import authRouter from "./authRoute";
import chatRouter from "./chatRoute";
import modelRouter from "./modelRoute";
import ollamaRouter from "./ollamaRoute";
import promptRouter from "./promptRoute";
import messageRouter from "./messageRoute";
import commentRouter from "./commentRoute";
import { loggerWithNameSpace } from "../utils";

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
router.use("/c", chatRouter);
router.use("/comments", commentRouter);
router.use("/messages", messageRouter);
router.use("/models", modelRouter);
router.use("/ollama", ollamaRouter);
router.use("/prompts", promptRouter);
router.use("/users", userRouter);

export default router;
