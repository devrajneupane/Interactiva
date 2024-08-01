import { Router } from "express";

import { authenticate, authorize } from "../middleware/auth";
import { requestHandler } from "../utils/requestWrapper";
import * as controller from "../controller/ollamaController";
import { ROLE } from "../enums";

const router = Router();

router.get("/list", requestHandler([authenticate, controller.getOllamaModels]));

router.post(
  "/chat",
  requestHandler([
    authenticate,
    authorize([ROLE.USER, ROLE.ADMIN]),
    controller.ollamaChat,
  ]),
);

router.post(
  "/create",
  requestHandler([
    authenticate,
    authorize([ROLE.USER, ROLE.ADMIN]),
    controller.createModel,
  ]),
);

router.post(
  "/generate",
  requestHandler([
    authenticate,
    authorize([ROLE.USER, ROLE.ADMIN]),
    controller.generateCompletion,
  ]),
);

export default router;
