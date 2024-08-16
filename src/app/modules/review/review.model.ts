import { model, Schema } from "mongoose";
import { IReview, ReviewModel } from "./review.interface";

const reviewSchema = new Schema<IReview, ReviewModel>(
    {
        user: {
            type: Schema.Types.ObjectId,
            required: true
        },
        artist: {
            type: Schema.Types.ObjectId,
            required: true
        },
        text: {
            type: String,
            required: true
        },
        rating: {
            type: Number,
            required: true
        },
    },
    {
        timestamps: true
    }
);

export const Review = model<IReview, ReviewModel>("Review", reviewSchema)