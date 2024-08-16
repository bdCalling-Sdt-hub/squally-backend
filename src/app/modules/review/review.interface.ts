import { Model, Types } from "mongoose";

export type IReview = {
    user: Types.ObjectId,
    rating: number,
    artist: Types.ObjectId,
    text: string
}

export type ReviewModel = Model<IReview, Record<string, unknown>>