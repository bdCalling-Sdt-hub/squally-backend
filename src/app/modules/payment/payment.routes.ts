import express from "express";
import auth from "../../middlewares/auth";
import fileUploadHandler from "../../middlewares/fileUploadHandler";
import { USER_ROLES } from "../../../enums/user";
import { PaymentController } from "./payment.controller";
const router = express.Router();

router.post("/create-payment-intent", auth(USER_ROLES.USER), fileUploadHandler(), PaymentController.createPaymentIntentToStripe);
router.post("/create-account", auth(USER_ROLES.ARTIST), fileUploadHandler(), PaymentController.createAccountToStripe);
router.patch("/transfer-payouts/:id", auth(USER_ROLES.USER), PaymentController.transferAndPayoutToArtist);

export const PaymentRoutes = router;