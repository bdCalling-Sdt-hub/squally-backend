import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import catchAsync from '../../../shared/catchAsync'
import sendResponse from '../../../shared/sendResponse'
import { LessonService } from './lesson.service';

const createLesson = catchAsync(async (req: Request, res: Response) => {
    const lessonData = req.body;
    const user = req.user.id;

    let gallery = [];
    if (req.files && "image" in req.files && req.files.image.length) {
        for (let image of req.files.image) {
            gallery.push(`/images/${image.filename}`);
        }
    }

    const payload = {
        ...lessonData,
        gallery,
        user
    }
    
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
    const updateData = req.body;
    const id = req.params.id;

    let gallery = [];
    if (req.files && "image" in req.files && req.files.image.length) {
        for (let image of req.files.image) {
            gallery.push(`/images/${image.filename}`);
        }
    }

    const payload = {
        ...updateData,
        gallery
    }

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