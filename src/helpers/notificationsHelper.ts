import { INotification } from "../app/modules/notification/notification.interface";
import { Notification } from "../app/modules/notification/notification.model";


export const sendNotifications = async (data:any):Promise<INotification> =>{

    const result = await Notification.create(data);

    const notification:any = await Notification.findById(result._id).populate({path: "sender", select: "name profile"}).select("text sender read createdAt");

    //@ts-ignore
    const socketIo = global.io;

    if (socketIo) {
        socketIo.emit(`get-notification::${data?.receiver}`, notification);
    }

    return result;
}