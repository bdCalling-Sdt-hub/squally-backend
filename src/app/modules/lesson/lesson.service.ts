import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiError";
import { ILesson } from "./lesson.interface"
import { Lesson } from "./lesson.model";

const createLesson = async (payload: ILesson): Promise<ILesson> => {
    const result = Lesson.create(payload);
    if(!result){
        throw new ApiError(StatusCodes.UNAUTHORIZED, "Failed to create Lesson");
    }
    return result;
}

const updateLesson = async (id:string, payload:any, user:any): Promise<ILesson | null> => {

    const isValidUser = Lesson.findById(id);
    const isExistUser = isValidUser.setQuery.toString === user._id.toString();
    if(!isExistUser){
        throw new ApiError(StatusCodes.UNAUTHORIZED, "You are not authorized to edit this");
    }
    const result = Lesson.findByIdAndUpdate({id}, {payload}, {new: true});
    return result;
}

export const LessonService = { createLesson, updateLesson } 