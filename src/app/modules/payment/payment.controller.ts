import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { PaymentService } from "./payment.service";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";


const createPaymentIntentToStripe = catchAsync(async(req: Request, res: Response)=>{
    const payload = req.body;
    const result = await PaymentService.createPaymentIntentToStripe(payload);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Payment Intent Created Successfully",
        data: result
    })
});

const createAccountToStripe = catchAsync(async(req: Request, res: Response)=>{
    const user = req.user;
    const bodyData = JSON.parse(req.body?.data);
    const files = req?.files?.KYC;

    const payload = {
        user,
        bodyData,
        files
    }
    const result = await PaymentService.createAccountToStripe(payload);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Connected account created successfully",
        data: result
    })
});

const transferAndPayoutToArtist = catchAsync(async(req: Request, res: Response)=>{
    const id = req.params.id;
    const result = await PaymentService.transferAndPayoutToArtist(id);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Booking Has Completed",
        data: result
    })
});


export const PaymentController = {
    createPaymentIntentToStripe,
    createAccountToStripe,
    transferAndPayoutToArtist
}