import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";
import { BookingService } from "./booking.service";

const createBooking = catchAsync(async(req: Request, res: Response)=>{

    const user = req.user;
    const payload = {
        user: user?.id,
        ...req.body
    }

    const result = await BookingService.createBooking(payload)

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Booking Booked Successfully",
        data: result
    })
});

const myBookingFromDB = catchAsync(async(req: Request, res: Response)=>{
    const query =  req.query.status;
    const user = req.user.id;

    const statusQuery = typeof query === 'string' ? query : '';

    const result = await BookingService.myBookingFromDB(user, statusQuery)
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Booking Retrieved Successfully",
        data: result
    })
})

// booking marked as complete
const completeBookingToDB = catchAsync(async(req: Request, res: Response)=>{
    const id = req.params.id;
    const result = await BookingService.completeBookingToDB(id)
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Booking Completed Successfully",
        data: result
    })
})

// reschedule booking;
const rescheduleBookingToDB = catchAsync(async(req: Request, res: Response)=>{
    const id = req.params.id;
    const payloadData  = req.body;
    const result = await BookingService.rescheduleBookingToDB(id, payloadData)
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Booking Scheduled Successfully",
        data: result
    })
})

// check booking availability
const checkAvailabilityBookingFromDB= catchAsync(async(req: Request, res: Response)=>{
    const id = req.params.id;
    const date = req.query.date as string;
    const result = await BookingService.checkAvailabilityBookingFromDB(id, date)
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Booking Availability retrieved Successfully",
        data: result
    })
})

// check booking availability
const transactionsHistoryFromDB= catchAsync(async(req: Request, res: Response)=>{
    const id = req.user.id;
    const result = await BookingService.transactionsHistoryFromDB(id)
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Transactions History retrieved Successfully",
        data: result
    })
})


export const BookingController = {
    createBooking,
    myBookingFromDB,
    completeBookingToDB,
    rescheduleBookingToDB,
    checkAvailabilityBookingFromDB,
    transactionsHistoryFromDB
}