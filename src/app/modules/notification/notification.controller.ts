import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";
import { NotificationService } from "./notification.service";

const getNotificationFromDB= catchAsync(async(req: Request, res: Response)=>{
    const id = req.params.id;
    const result = await NotificationService.getNotificationFromDB(id);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Notifications Retrieved Successfully",
        data: result
    })
})


const adminNotificationFromDB= catchAsync(async(req: Request, res: Response)=>{
    const result = await NotificationService.adminNotificationFromDB();

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Notifications Retrieved Successfully",
        data: result
    })
})

export const NotificationController = {
    adminNotificationFromDB,
    getNotificationFromDB
}