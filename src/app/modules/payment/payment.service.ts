import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiError";
import Stripe from "stripe";
import config from "../../../config";
import { Booking } from "../booking/booking.model";
import { User } from "../user/user.model";

//create stripe instance
const stripe = new Stripe(config.stripe_api_secret as string);

// create payment intent;
const createPaymentIntentToStripe = async(payload: any) =>{
    
    const { price } = payload;
    if (typeof price !== "number" || price <= 0) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid price amount");
      }

    const amount = Math.trunc(price * 100);
    const paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: "usd",
        payment_method_types: ["card"],
        metadata: { integration_check: 'accept_a_payment' }
    });

    return paymentIntent;
}

// create account
const createAccountToStripe = async(payload: any)=>{
    return
}

// transfer and payout credit
const transferAndPayoutToArtist = async(id: string)=>{

    const isExistBooking:any = await Booking.findById(id);
    if (!isExistBooking) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Booking doesn't exist!");
    }

    //check bank account
    const artist = isExistBooking.artist as unknown as string;
    const isExistArtist = await User.isAccountCreated(artist)
    if (!isExistArtist) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Sorry, you are didn't provide bank information. Please create a bank account");
    }

    //check completed payment and artist transfer
    if (isExistBooking.status === "Complete") {
        throw new ApiError(StatusCodes.BAD_REQUEST, "The payment has already been transferred to your account.");
    }

    const { stripeAccountId, externalAccountId } = isExistArtist.accountInformation;
    const { price } = isExistBooking;

    const charge = (parseInt(price.toString()) * 10) / 100;
    const amount = parseInt(price.toString()) - charge;

    const transfer = await stripe.transfers.create({
        amount: amount * 100,
        currency: "usd",
        destination: stripeAccountId,
    });
  
    const payouts = await stripe.payouts.create(
        {
            amount: amount * 100,
            currency: "usd",
            destination: externalAccountId,
        },
        {
            stripeAccount: stripeAccountId,
        }
    );


    if (transfer.id && payouts.id) {
        await Booking.findByIdAndUpdate({_id: id}, {status: "Complete"}, {new: true});
    }

    return
}


export const PaymentService = {
    createPaymentIntentToStripe,
    createAccountToStripe,
    transferAndPayoutToArtist
}