import { Router } from "express";

import { ROLE } from "../enums";
import { requestHandler } from "../utils/requestWrapper";
import * as controller from "../controller/modelController";
import { authenticate, authorize } from "../middleware/auth";

const router = Router();

router.get("/", requestHandler([authenticate, controller.getModels]));
router.get("/:id", requestHandler([authenticate, controller.getModelById]));
router.patch(
  "/:id",
  requestHandler([
    authenticate,
    authorize([ROLE.ADMIN, ROLE.USER]),
    controller.updateModel,
  ]),
);

export default router;
