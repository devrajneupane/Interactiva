import { Router } from "express";

import { ROLE } from "../enums";
import * as schema from "../schema/user";
import { messageBodySchema } from "../schema";
import * as validator from "../middleware/validator";
import { requestHandler } from "../utils/requestWrapper";
import { authenticate, authorize } from "../middleware/auth";
import * as controller from "../controller/promptController";

const router = Router();

router.get("/", requestHandler([authenticate, controller.getPrompts]));
router.get("/:id", requestHandler([authenticate, controller.getPromptById]));

router.post(
  "/",
  requestHandler([
    authenticate,
    authorize([ROLE.ADMIN, ROLE.USER]),
    // validator.validateReqBody(messageBodySchema),
    // TODO: DEV
    controller.createPrompt,
  ]),
);

router.patch(
  "/:id",
  requestHandler([
    authenticate,
    authorize([ROLE.ADMIN, ROLE.USER]),
    validator.validateReqParams(schema.userReqParamSchema),
    controller.updatePrompt,
  ]),
);

export default router;
