import { Model, Types } from "mongoose";

export type INotification = {
    text: string;
    receiver: Types.ObjectId,
    sender?: Types.ObjectId,
    read: boolean;
    type?: string;
    adminRead?: boolean;
}

export type NotificationModel = Model<INotification>;