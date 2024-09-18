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
router.get("/transactions-history", auth(USER_ROLES.USER, USER_ROLES.ARTIST), BookingController.transactionsHistoryFromDB);
router.get("/booking-summary", auth(USER_ROLES.ARTIST), BookingController.bookingSummaryFromDB);
router.get("/lesson-booking", auth(USER_ROLES.ARTIST), BookingController.lessonBookingSummary);
router.post("/send-link/:id", auth(USER_ROLES.ARTIST), fileUploadHandler(), BookingController.sendLinkToUser);
router.patch("/respond/:id", auth(USER_ROLES.USER, USER_ROLES.ARTIST), BookingController.respondBookingToDB);
router.get("/details/:id",  BookingController.bookingDetailsFromDB);

export const BookingRoutes = router;