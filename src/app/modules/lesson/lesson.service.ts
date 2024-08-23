import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiError";
import { ILesson } from "./lesson.interface"
import { Lesson } from "./lesson.model";
import { User } from "../user/user.model";

const createLesson = async (payload: ILesson): Promise<ILesson> => {

    const artist = payload.user as unknown as string;
    // check artist is add all bank info or not
    const isExistBank = await User.isAccountCreated(artist);
    /* if(!isExistBank){
        throw new ApiError(StatusCodes.UNAUTHORIZED, "Please Put all of your bank info then try again");
    } */

    const result:any = Lesson.create(payload);
    if(!result){
        throw new ApiError(StatusCodes.UNAUTHORIZED, "Failed to create Lesson");
    }

    if(result?._id){
        await User.findByIdAndUpdate({_id: payload?.user}, {$set: {lessons: result?._id}});  
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