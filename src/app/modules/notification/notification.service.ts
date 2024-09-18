import { INotification } from "./notification.interface";
import { Notification } from "./notification.model";

const getNotificationFromDB= async(id: string): Promise<INotification[]>=>{

    const result = await Notification.find({user: id});
    return result;
}


const adminNotificationFromDB= async()=>{
    const result = await Notification.find({type: "ADMIN"});

    return result;
}

export const NotificationService = {
    adminNotificationFromDB,
    getNotificationFromDB
}