import { Router } from "express";

import { ROLE } from "../enums";
import * as schema from "../schema/user";
import { messageBodySchema } from "../schema";
import * as validator from "../middleware/validator";
import { requestHandler } from "../utils/requestWrapper";
import { authenticate, authorize } from "../middleware/auth";
import * as controller from "../controller/commentController";

const router = Router();

// TODO: Schema validation
router.get("/", requestHandler([authenticate, controller.getComments]));
router.get("/:id", requestHandler([authenticate, controller.getCommentById]));

router.post(
  "/",
  requestHandler([
    authenticate,
    authorize([ROLE.ADMIN, ROLE.USER]),
    // validator.validateReqBody(messageBodySchema),
    controller.createComment,
  ]),
);

router.patch(
  "/:id",
  requestHandler([
    authenticate,
    authorize([ROLE.ADMIN, ROLE.USER]),
    validator.validateReqParams(schema.userReqParamSchema),
    controller.updateComment,
  ]),
);

export default router;
