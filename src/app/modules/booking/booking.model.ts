import { model, Schema } from "mongoose";
import { IBooking, BookingModel } from "./booking.interface"

const bookingSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        artist: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        fine: {
            type: Number,
            default: 0
        },
        bookingId: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: ["Pending", "Complete"],
            default: "Pending"
        },
        booking_date: {
            type: String,
            required: true
        },
        transactionId: {
            type: String,
            require: true
        },
        booking_time: {
            type: String,
            required: true
        }
    },
    {timestamps: true}
);

export const Booking = model<IBooking, BookingModel>("Booking", bookingSchema);