import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import catchAsync from '../../../shared/catchAsync'
import sendResponse from '../../../shared/sendResponse'
import { LessonService } from './lesson.service';

const createLesson = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body;
    const result = await LessonService.createLesson(payload);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Lesson created successfully",
        data: result
    });
});

const updateLesson = catchAsync(async (req: Request, res: Response) => {
    const user = req.user;
    const payload = req.body;
    const id = req.params.id;
    const result = await LessonService.updateLesson(id, payload, user);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Lesson updated successfully",
        data: result
    });
});

export const LessonController = {
    createLesson,
    updateLesson
}