import express from "express"
import auth from "../../middlewares/auth";
import { USER_ROLES } from "../../../enums/user";
import fileUploadHandler from "../../middlewares/fileUploadHandler";
import { BookingController } from "./booking.controller";
const router = express.Router();

router.post("/", auth(USER_ROLES.USER), fileUploadHandler(), BookingController.createBooking)
router.get("/", auth(USER_ROLES.USER), BookingController.myBookingFromDB);
router.get("/complete/:id", auth(USER_ROLES.USER), BookingController.completeBookingToDB);
router.patch("/reschedule/:id", auth(USER_ROLES.USER), fileUploadHandler(), BookingController.rescheduleBookingToDB);
router.get("/check-availability/:id", auth(USER_ROLES.USER), BookingController.checkAvailabilityBookingFromDB);
router.get("/transactions-history", auth(USER_ROLES.USER), BookingController.transactionsHistoryFromDB);

export const BookingRoutes = router;