import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiError";
import { IReview } from "./review.interface"
import { Review } from "./review.model";
import { Lesson } from "../lesson/lesson.model";
import mongoose from "mongoose";


const createReview = async (payload: IReview): Promise<IReview> => {

    // convert string to object id;
    const id = new mongoose.Types.ObjectId(payload.artist);

    // check the artist is exist or not;
    const isExistArtist:any = await Lesson.findOne({user: id});
    if (!isExistArtist) {
        throw new ApiError(StatusCodes.NOT_FOUND, "No Artist Found");
    }

    // checking the rating is valid or not;
    const rating = Number(payload.rating);
    if (rating < 1 || rating > 5) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid rating value");
    }

    // creating review;
    const review = await Review.create(payload);
    if (!review) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to create review");
    }


    // Update artist's rating and total ratings count
    const totalRating = isExistArtist.totalRating + 1;
    const ratings = ((isExistArtist.rating * (isExistArtist.totalRating - 1)) + rating) / isExistArtist.totalRating;

    const updatedData = {
        totalRating: Number(totalRating),
        rating: Number(ratings).toFixed(2)
    }

    const result:any = await Lesson.findOneAndUpdate({user: payload.artist}, updatedData, {new: true});
    return result;
}


const getReview = async (id: string): Promise<IReview[]> => {
    const result = await Review.find({artist: id}).populate({path: "user", select: "name profile"}).select("user rating text");
    if(!result){
        throw new ApiError(StatusCodes.EXPECTATION_FAILED, "Failed to create review");
    }
    return result;
}

export const ReviewService = {
    createReview,
    getReview
};