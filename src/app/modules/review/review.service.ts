import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiError";
import { IReview } from "./review.interface"
import { Review } from "./review.model";


const createReview = async (payload: IReview): Promise<IReview> => {
    const result = await Review.create(payload);
    if(!result){
        throw new ApiError(StatusCodes.EXPECTATION_FAILED, "Failed to create review");
    }

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