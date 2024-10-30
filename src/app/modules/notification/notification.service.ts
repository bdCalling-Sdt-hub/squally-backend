import { JwtPayload } from "jsonwebtoken";
import { INotification } from "./notification.interface";
import { Notification } from "./notification.model";

const getNotificationFromDB= async(user:  JwtPayload): Promise<INotification[]>=>{
    const result = await Notification.find({receiver: user.id}).populate({path: "sender", select: "name profile"});
    return result;
}


const adminNotificationFromDB= async()=>{
    const result = await Notification.find({type: "ADMIN"});
    return result;
}

const readNotificationToDB= async(): Promise<INotification| undefined>=>{
    const result:any = await Notification.updateMany({ read: false }, { $set: { read: true } });
    return result;
}

export const NotificationService = {
    adminNotificationFromDB,
    getNotificationFromDB,
    readNotificationToDB
}