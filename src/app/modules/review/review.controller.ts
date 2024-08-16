import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import catchAsync from '../../../shared/catchAsync'
import sendResponse from '../../../shared/sendResponse'
import { ReviewService } from './review.service';

const createReview = catchAsync(async(req: Request, res: Response)=>{
    const user = req.user;
    const reviewData = req.body;
    const payload = {
        ...reviewData,
        user: user?._id
    }
    const result = await ReviewService.createReview(payload);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Review created successfully",
        data: result
    });
})

const getReview = catchAsync(async(req: Request, res: Response)=>{
    const id = req.params.id;
    const result = await ReviewService.getReview(id);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Review Retrieved successfully",
        data: result
    });
})

export const ReviewController = {createReview, getReview}