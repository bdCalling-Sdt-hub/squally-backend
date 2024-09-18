import express from "express";
import auth from "../../middlewares/auth";
import { USER_ROLES } from "../../../enums/user";
import { NotificationController } from "./notification.controller";
const router = express.Router();

router.get("/", auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN), NotificationController.adminNotificationFromDB)
router.get("/:id", auth(USER_ROLES.ARTIST,  USER_ROLES.USER), NotificationController.getNotificationFromDB)

export const NotificationRoutes = router;