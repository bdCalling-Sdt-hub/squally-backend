import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiError";
import { User } from "../user/user.model";
import { IBooking } from "./booking.interface";
import { Booking } from "./booking.model";
import generateBookingId from "../../../util/generateBookingId";
import { JwtPayload } from "jsonwebtoken";


const createBooking= async(payload: IBooking): Promise<IBooking>=>{
    const isExistArtist = await User.findById(payload.user);
    if(!isExistArtist){
        throw new ApiError(StatusCodes.NOT_FOUND, "No User Found to Booked")
    }

    const createOrder={
        ...payload,
        bookingId: await generateBookingId()
    }

    const booking = await Booking.create(createOrder);
    if(!booking){
        throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to Booked A Booking")
    }

    return booking;
}

const myBookingFromDB = async(payload: JwtPayload, queries: string): Promise<IBooking[]>=>{

    const query:any ={
        user: payload
    }

    if(queries === "Complete"){
        query.status = queries;
    }

    const result = await Booking.find(query).populate({
        path: "artist",
        select: "name profile"
    }).select("artist booking_time booking_data bookingId")
    return result;
}

// booking marked as complete
const completeBookingToDB = async(id:string): Promise<IBooking| null>=>{
    const isExistBooking = await Booking.findById(id);
    if(!isExistBooking){
        throw new ApiError(StatusCodes.NOT_FOUND, "There is No Booking Found");
    }

    const result = await Booking.findByIdAndUpdate({_id: id}, {status: "Complete"}, {new : true})

    return result;
}

// reschedule booking
const rescheduleBookingToDB = async(id:string, payload:any): Promise<IBooking| null>=>{
    const isExistBooking:any = await Booking.findById(id);
    if(!isExistBooking){
        throw new ApiError(StatusCodes.NOT_FOUND, "There is No Booking Found");
    }

    const updatedData= {
        ...payload,
        price: parseInt(isExistBooking.price) + 5,
        fine: 5
    }

    const result = await Booking.findByIdAndUpdate({_id: id}, updatedData, {new : true})
    return result;
}

// check booking availability
const checkAvailabilityBookingFromDB = async(id: string, date: string): Promise<IBooking | null> => {

    // Convert date to yyyy-mm-dd format
    const today = new Date().toISOString().split('T')[0];

    // Get all booked dates for the artist from today onwards
    const bookingList: any = await Booking.find({
        artist: id, 
        booking_date: { $gte: today }
    });
    
    // Get unique booked dates
    const bookedDates: any = [...new Set(bookingList.map((item: any) => item.booking_date))];

    // Get bookings for the specific date (either `date` or `today`)
    const getBookingTimes: any = await Booking.find({
        artist: id, 
        booking_date: date ? date : today  //Check if `date` exists, otherwise use `today`
    });

    // Get unique booked times for that date
    const bookedTimes: any = [...new Set(getBookingTimes.map((item: any) => item.booking_time))];

    // Return the booked dates and times
    const data: any = {
        bookedDate: bookedDates,
        bookedTime: bookedTimes
    };

    return data;
};

// transaction history 
const transactionsHistoryFromDB = async(id: string): Promise<IBooking | null> => {

    const result: any = await Booking.find({user: id})
    .populate(
        {
            path: "artist", 
            select: "name"
        }
    ).select("booking_date booking_time price artist");

    // Add wish property to each artist if it matches with the bookmark
    const transactions = result.map((item:any) => {
        const {artist, ...othersInfo} = item.toObject();

        const data = {
            ...artist,
            ...othersInfo
        }
        return data;
    });

    return transactions;
};


export const BookingService = {
    createBooking,
    myBookingFromDB,
    completeBookingToDB,
    rescheduleBookingToDB,
    checkAvailabilityBookingFromDB,
    transactionsHistoryFromDB
}