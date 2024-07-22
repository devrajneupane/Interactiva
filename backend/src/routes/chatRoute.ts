import { Router } from "express";

import { ROLE } from "../enums";
import * as schema from "../schema/user";
import { requestHandler } from "../utils";
import * as validator from "../middleware/validator";
import * as controller from "../controller/chatController";
import { authenticate, authorize } from "../middleware/auth";

const router = Router();

router.get(
  "/",
  requestHandler([
    authenticate,
    validator.validateReqQuery(schema.userReqQuerySchema),
    controller.getChats,
  ]),
);

router.get(
  "/:id",
  requestHandler([
    authenticate,
    authorize([ROLE.ADMIN, ROLE.USER]),
    validator.validateReqParams(schema.userReqParamSchema),
    controller.getChat,
  ]),
);

router.post(
  "/",
  requestHandler([
    authenticate,
    authorize([ROLE.ADMIN, ROLE.USER]),
    controller.createChat,
  ]),
);

router.patch(
  "/:id",
  requestHandler([
    authenticate,
    authorize([ROLE.ADMIN, ROLE.USER]),
    validator.validateReqParams(schema.userReqParamSchema),
    controller.updateChat,
  ]),
);

router.delete(
  "/:id",
  requestHandler([
    authenticate,
    authorize([ROLE.ADMIN, ROLE.USER]),
    validator.validateReqParams(schema.userReqParamSchema),
    controller.deleteChat,
  ]),
);

export default router;
