import express from "express";
import auth from "../../middlewares/auth";
import { USER_ROLES } from "../../../enums/user";
import { AdminController } from "./admin.controller";
import validateRequest from "../../middlewares/validateRequest";
import { AdminValidation } from "./admin.validation";
const router = express.Router();

router.post("/create-super-admin", validateRequest(AdminValidation.createAdminZodSchema), AdminController.createSuperAdmin);
router.get("/users", auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN), AdminController.userList);
router.get("/artists", auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN), AdminController.artistList);
router.get("/transactions", auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN), AdminController.transactionList);
router.get("/booking-summary", auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN), AdminController.bookingSummary);
router.get("/earning-statistic", auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN), AdminController.earningStatistic);
router.get("/user-statistic", auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN), AdminController.userStatistic);

export const AdminRoutes = router;