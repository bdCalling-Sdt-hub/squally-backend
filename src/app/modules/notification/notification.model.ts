import { model, Schema } from "mongoose";
import { INotification, NotificationModel } from "./notification.interface";

const notificationSchema = new Schema<INotification, NotificationModel>(
    {
        text: {
            type: String,
            required: true
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        read: {
            type: Boolean,
            default: false
        },
        type: {
            type: String,
            required: false
        },
        adminRead: {
            type: Boolean,
            required: false
        }
    }, 
    {
        timestamps: true
    }
)

export const Notification = model<INotification, NotificationModel>("Notification", notificationSchema)