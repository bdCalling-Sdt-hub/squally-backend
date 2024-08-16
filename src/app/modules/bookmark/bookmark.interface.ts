import { Model, Types } from "mongoose";

export type IBookmark= {
    user: Types.ObjectId,
    artist: Types.ObjectId
}

export type BookmarkModel = Model<IBookmark>;