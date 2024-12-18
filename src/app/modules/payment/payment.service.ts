import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiError";
import Stripe from "stripe";
import config from "../../../config";
import { Booking } from "../booking/booking.model";
import { User } from "../user/user.model";
import unlinkFile from "../../../shared/unlinkFile";
import { JwtPayload } from "jsonwebtoken";
const fs = require("fs");

//create stripe instance
const stripe = new Stripe(config.stripe_api_secret as string);

// create payment intent;
const createPaymentIntentToStripe = async (user:JwtPayload, payload: any) => {
    const { price } = payload;

    if (typeof price !== "number" || price <= 0) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid price amount");
    }

    // Stripe expects amounts in cents
    const amount = Math.trunc(price * 100);

    // Create a checkout session
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment", // Use "subscription" if you're setting up recurring payments
        line_items: [
            {
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: "E-learning Subscription", // Replace with your product/service name
                    },
                    unit_amount: amount,
                },
                quantity: 1,
            },
        ],
        customer_email: user?.email,
        success_url: "http://192.168.10.102:6001/api/v1/success", // URL to redirect upon successful payment
        cancel_url: "http://192.168.10.102:6001/api/v1/errors", // URL to redirect upon cancellation
    });

    if (!session) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to create Payment Checkout");
    }
    const date = new Date()
    const txid = "Txid" + date.getTime() + date.getDate() + date.getMonth() + date.getFullYear();
    
    return {txid, url: session?.url};
};
      

// create account
const createAccountToStripe = async (payload: any) => {

    const { user, bodyData, files } = payload;

    //user check
    const isExistUser: any = await User.findById(user.id);
    if (!isExistUser) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Artist does't exist!");
    }

    //check already account exist;
    if (await User.isAccountCreated(user.id)) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Your account already exist,Please skip this");
    }

    if (!files || files?.length < 2) {
        files?.forEach((element: any) => {
            const removeFileFromUploads = `/docs/${element.filename}`;
            unlinkFile(removeFileFromUploads);
        });
        throw new ApiError(StatusCodes.BAD_REQUEST, "Two kyc files are required!");
    }


    const { dateOfBirth, phoneNumber, address, bank_info, business_profile } = bodyData;
    const dob = new Date(dateOfBirth);

    if (!dateOfBirth && !phoneNumber && !address && !bank_info && !business_profile) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Please provide the required information: date of birth, phone number, address, bank information, and business profile.");
    }


    //process of kyc
    const frontFilePart = await stripe.files.create({
        purpose: "identity_document",
        file: {
            data: fs.readFileSync(files[0].path),
            name: files[0].filename,
            type: files[0].mimetype,
        }
    });

    const backFilePart = await stripe.files.create({
        purpose: "identity_document",
        file: {
            data: fs.readFileSync(files[0].path),
            name: files[0].filename,
            type: files[0].mimetype,
        }
    });

    //create token
    const token: any = await stripe.tokens.create({
        account: {
            individual: {
                dob: {
                    day: dob.getDate(),
                    month: dob.getMonth() + 1,
                    year: dob.getFullYear(),
                },
                first_name: isExistUser?.name?.split(" ")[0],
                last_name: isExistUser?.name?.split(" ")[1] || "dummy Last Name",
                email: isExistUser?.email,
                phone: phoneNumber,
                address: {
                    city: address.city,
                    country: address.country,
                    line1: address.line1,
                    postal_code: address.postal_code,
                },
                verification: {
                    document: {
                        front: frontFilePart.id,
                        back: backFilePart.id,
                    },
                },
            },
            business_type: "individual",
            tos_shown_and_accepted: true,
        }
    });

    //account created
    const account: any = await stripe.accounts.create({
        type: "custom",
        account_token: token.id,
        capabilities: {
            card_payments: { requested: true },
            transfers: { requested: true },
        },
        business_profile: {
            mcc: "5970",
            name: business_profile.business_name || isExistUser?.firstName,
            url: business_profile.website || "www.example.com",
        },
        external_account: {
            object: "bank_account",
            account_holder_name: bank_info.account_holder_name,
            account_holder_type: bank_info.account_holder_type,
            account_number: bank_info.account_number,
            country: "US",
            currency: "usd",
            routing_number: bank_info.routing_number
        }
    });

    //save to the DB
    if (account.id && account.external_accounts?.data?.length) {

        await User.findByIdAndUpdate(
            isExistUser._id,
            {
                $set: {
                    "accountInformation.stripeAccountId": account.id,
                    "accountInformation.externalAccountId": account.external_accounts?.data[0].id,
                    "accountInformation.status": true,
                    "accountInformation.accountUrl": account.external_accounts?.data[0].id,
                    "bank_account": bank_info.account_number
                }
            },
            { new: true }
        );
    }

    // Create account link for onboarding
    const accountLink = await stripe.accountLinks.create({
        account: account.id,
        refresh_url: "https://example.com/reauth",
        return_url: "https://example.com/return",
        type: "account_onboarding",
        collect: "eventually_due",
    });

    if(accountLink?.url){
        await User.findByIdAndUpdate(
            isExistUser._id,
            {
                $set: {
                    "accountInformation.accountUrl": accountLink?.url
                }
            },
            { new: true }
        );
    }

    return accountLink;



    /* files?.forEach((element:any) => {
        const removeFileFromUploads = `/docs/${element.filename}`;
        unlinkFile(removeFileFromUploads);
    }); */

}

// transfer and payout credit
const transferAndPayoutToArtist = async (id: string) => {

    const isExistBooking: any = await Booking.findById(id);
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
        await Booking.findByIdAndUpdate({ _id: id }, { status: "Complete" }, { new: true });
    }

    return
}


export const PaymentService = {
    createPaymentIntentToStripe,
    createAccountToStripe,
    transferAndPayoutToArtist
}