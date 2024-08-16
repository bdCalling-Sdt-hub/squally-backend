import express from "express";
import { USER_ROLES } from "../../../enums/user";
import validateRequest from "../../middlewares/validateRequest";
import { ReviewController } from "./review.controller";
import auth from "../../middlewares/auth";
import { ReviewValidation } from "./review.validation";
const router = express.Router();

router.post("/:id", auth(USER_ROLES.USER), validateRequest(ReviewValidation.createReviewZodSchema), ReviewController.createReview);
router.get("/:id", auth(USER_ROLES.USER, USER_ROLES.ARTIST), ReviewController.getReview);

export const ReviewRoutes = router;