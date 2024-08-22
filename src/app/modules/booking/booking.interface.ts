import { Model, model, Types } from "mongoose";

export type IBooking = {
    user: Types.ObjectId,
    artist: Types.ObjectId,
    price: Number,
    fine: Number,
    bookingId:String,
    status:  'Pending' | 'Complete',
    booking_date: String,
    transactionId: String,
    booking_time: String
}

export type BookingModel = Model<IBooking>;