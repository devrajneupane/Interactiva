import { Router } from "express";

import { ROLE } from "../enums";
import * as schema from "../schema/user";
import { messageBodySchema } from "../schema";
import * as validator from "../middleware/validator";
import { requestHandler } from "../utils/requestWrapper";
import { authenticate, authorize } from "../middleware/auth";
import * as controller from "../controller/messageController";

const router = Router();

router.get(
  "/",
  requestHandler([
    authenticate,
    controller.getMessages,
  ]),
);

router.post(
  "/",
  requestHandler([
    authenticate,
    authorize([ROLE.ADMIN, ROLE.USER]),
    validator.validateReqBody(messageBodySchema),
    controller.createMessage,
  ]),
);

router.patch(
  "/:id",
  requestHandler([
    authenticate,
    authorize([ROLE.ADMIN, ROLE.USER]),
    validator.validateReqParams(schema.userReqParamSchema),
    controller.updateMessage,
  ]),
);

export default router;
