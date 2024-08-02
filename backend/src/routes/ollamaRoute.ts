import { Router } from "express";

import { authenticate, authorize } from "../middleware/auth";
import { requestHandler } from "../utils/requestWrapper";
import * as controller from "../controller/ollamaController";
import { ROLE } from "../enums";

const router = Router();

router.get(
  "/list",
  requestHandler([
    // authenticate,
    // TODO:DEV
    controller.getLocalModels,
  ]),
);

router.post(
  "/chat",
  requestHandler([
    // TODO:DEV
    authenticate,
    authorize([ROLE.USER, ROLE.ADMIN]),
    controller.ollamaChat,
  ]),
);

router.post(
  "/create",
  requestHandler([
    // TODO:DEV
    authenticate,
    authorize([ROLE.USER, ROLE.ADMIN]),
    controller.createModel,
  ]),
);

export default router;
