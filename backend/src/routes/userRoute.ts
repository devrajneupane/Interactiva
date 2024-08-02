import { Router } from "express";

import { ROLE } from "../enums/Role";
import * as schema from "../schema/user";
import * as validator from "../middleware/validator";
import { requestHandler } from "../utils/requestWrapper";
import * as controller from "../controller/userController";
import { authenticate, authorize } from "../middleware/auth";

const router = Router();

router.get(
  "/",
  requestHandler([
    authenticate,
    authorize(ROLE.ADMIN),
    validator.validateReqQuery(schema.userReqQuerySchema),
    controller.getUsers,
  ]),
);

router.get(
  "/:id",
  requestHandler([
    authenticate,
    authorize([ROLE.ADMIN, ROLE.USER]),
    validator.validateReqParams(schema.userReqParamSchema),
    controller.getUserInfo,
  ]),
);

router.post(
  "/",
  requestHandler([
    validator.validateReqBody(schema.createUserBodySchema),
    controller.createUser,
  ]),
);

router.patch(
  "/",
  requestHandler([
    authenticate,
    authorize([ROLE.ADMIN, ROLE.USER]),
    validator.validateReqQuery(schema.userReqParamSchema),
    validator.validateReqBody(schema.updateUserBodySchema),
    controller.updateUser,
  ]),
);

router.delete(
  "/",
  requestHandler([
    authenticate,
    authorize([ROLE.ADMIN, ROLE.USER]),
    validator.validateReqQuery(schema.userReqParamSchema),
    controller.deleteUser,
  ]),
);

export default router;
