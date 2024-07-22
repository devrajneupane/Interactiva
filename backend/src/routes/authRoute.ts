import { Router } from "express";

import { createAuthSchema } from "../schema/auth";
import { requestHandler } from "../utils/requestWrapper";
import { validateReqBody } from "../middleware/validator";
import { login, refresh } from "../controller/authController";

const router = Router();

router.post(
  "/login",
  requestHandler([validateReqBody(createAuthSchema), login]),
);
router.get("/refresh", requestHandler([refresh]));

export default router;
