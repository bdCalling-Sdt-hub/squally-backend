import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiError";
import { User } from "../user/user.model";
import { IBooking } from "./booking.interface";
import { Booking } from "./booking.model";
import generateBookingId from "../../../util/generateBookingId";
import { JwtPayload } from "jsonwebtoken";
import cron from 'node-cron';
import { Notification } from "../notification/notification.model";
import mongoose from "mongoose";
import { emailHelper } from "../../../helpers/emailHelper";
import Stripe from "stripe";
import config from "../../../config";
import { sendNotifications } from "../../../helpers/notificationsHelper";

//create stripe instance
const stripe = new Stripe(config.stripe_api_secret as string);

const createBooking= async(payload: IBooking): Promise<IBooking>=>{
    const isExistArtist = await User.findById(payload.user);
    if(!isExistArtist){
        throw new ApiError(StatusCodes.NOT_FOUND, "No User Found to Booked")
    }

    const { price } = payload;

    if(typeof price === "string"){
        payload.price = Number(price);
    }

    const createOrder={
        ...payload,
        bookingId: await generateBookingId()
    }

    const booking:any = await Booking.create(createOrder);
    if(!booking){
        throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to Booked A Booking")
    }

    // this notifications for artist
    const data = {
        sender: payload.user,
        receiver: payload.artist,
        text: `Booking on your lesson`,
    };
    await sendNotifications(data)



    /* const bookingTime = new Date(payload.booking_time as string);
    console.log(bookingTime, payload.booking_time)
    const reminderTime = new Date(bookingTime.getTime() - 2 * 60 * 60 * 1000);

    // Check if reminderTime is valid
    if (isNaN(reminderTime.getTime())) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid reminder time calculated");
    }

    // Convert reminder time to cron format
    const cronTime = `${reminderTime.getMinutes()} ${reminderTime.getHours()} ${reminderTime.getDate()} ${reminderTime.getMonth() + 1} *`;

    // Log or validate cronTime before scheduling
    console.log("Scheduling reminder with cron time:", cronTime);

    // Schedule the reminder
    cron.schedule(cronTime, async () => {
        // Notification for the user
        const data = {
            sender: payload.artist,
            receiver: payload.user,
            text: `Your appointment is in 2 hours. Don't forget!`,
        };
        await sendNotifications(data);
    }); */

    

    return booking;
}

const myBookingFromDB = async(payload: JwtPayload, queries: string): Promise<IBooking[]>=>{

    const query:any ={
        user: payload
    }

    if(queries === "Complete"){
        query.status = queries;
    }else{
        query.status = "Pending"
    }

    const result = await Booking.find(query).populate({
        path: "artist",
        select: "name profile"
    }).select("artist booking_time status booking_date bookingId")
    return result;
}

// booking marked as complete
const completeBookingToDB = async(id:string): Promise<IBooking| null>=>{
    const isExistBooking = await Booking.findByIdAndUpdate({_id: id}, {status: "Complete"}, {new : true})

    if(!isExistBooking){
        throw new ApiError(StatusCodes.NOT_FOUND, "There is No Booking Found");
    }

    // this notifications for artist
    const data = {
        sender: isExistBooking.user,
        receiver: isExistBooking.artist,
        text: `Someone booking on your lesson`,
    };
    await sendNotifications(data)

    return isExistBooking;
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

    // this notifications for artist
    const data = {
        sender: isExistBooking.user,
        receiver: isExistBooking.artist,
        text: `Reschedule on your lesson`,
    };
    await sendNotifications(data)

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
const transactionsHistoryFromDB = async (user: JwtPayload): Promise<IBooking[] | null> => {
    const role = user?.role;
    const query: any = role === "USER" ? { user: user?.id } : { artist: user?.id };

    // Perform the query and conditionally populate the fields
    const result: any = await Booking.find(query)
        .populate({
            path: role === "USER" ? "artist" : "user",
            select:  "name profile"
        })
        .select(`booking_date booking_time price  ${role === "USER" ? "artist" : "user"}`);

    // Format the response
    const transactions = result.map((item: any) => {
        const populatedField = role === "USER" ? "artist" : "user";
        const { [populatedField]: populatedData, ...othersInfo } = item?.toObject();

        return {
            ...populatedData,
            ...othersInfo
        };
    });

    return transactions;
};

// respond for booking status 
const respondBookingToDB = async (id: string, status: string): Promise<IBooking | null> => {

    if(!mongoose.Types.ObjectId.isValid(id)){
        throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid ID");
    }    

    // Update the booking status
    const result:any = await Booking.findByIdAndUpdate(
        { _id: id },
        { status: status },
        { new: true }
    );

        // Check if the booking was found and updated
        if (!result) {
            throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to update booking.");
        }

        // If the status is "rejected", initiate a refund
        if (status === "Reject") {
            const paymentIntent:any = await stripe.paymentIntents.retrieve(result?.transactionId);
            const chargeId = paymentIntent.charges.data[0].id;

            if (!chargeId) {
                throw new ApiError(StatusCodes.BAD_REQUEST, "No payment found for this booking.");
            }

            // Initiate the refund
            try {
                const refund = await stripe.refunds.create({
                    charge: chargeId,
                });
                console.log("Refund successful:", refund);
            } catch (refundError) {
                console.error("Refund failed:", refundError);
                throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Refund failed. Please try again.");
            }
        }

        

        // this notifications for artist
        const data = {
            receiver: result.artist,
            sender: result.user,
            text: `Your session is ${status}`,
        };
        await sendNotifications(data);

        return result;
};

// booking details 
const bookingDetailsFromDB = async(id: string): Promise<IBooking | null> => {

    const result: any = await Booking.findById(id).populate([
        {
            path: "artist",
            select: "name",
            populate: {
                path: 'lesson',
                select: "lessonTitle price"
            }
        },
        {
            path: "user",
            select: "name contact"
        }
    ]).select("user artist bookingId price booking_date booking_time");
    return result;
};


// check booking availability
const bookingSummaryFromDB = async(id: string): Promise<IBooking | {}> => {

    // Convert date to yyyy-mm-dd format
    const today = new Date().toISOString().split('T')[0];

    // Get all booked user
    const bookingList: any = await Booking.find({
        artist: new mongoose.Types.ObjectId(id), 
        status: "Pending",
        booking_date: { $gte: today }
    }).populate({ path: "user", select: "name profile"}).select("user booking_date");

    // my balance
    const totalIncome = await Booking.aggregate([
        { $match: { artist: new mongoose.Types.ObjectId(id) } },
        { 
            $group: { 
                _id: null, 
                totalIncomes: { $sum: "$price" }
            } 
        },
        {
            $project: {
                totalIncomes: 1,
                incomeAfterDeduction: { $subtract: ["$totalIncomes", { $multiply: ["$totalIncomes", 0.2] }] } // Subtract 20%
            }
        }
    ]);
    const balance:any = totalIncome[0]?.incomeAfterDeduction || 0;

    // total user count;
    const result = await Booking.aggregate([
        {
            $match: {
                artist: new mongoose.Types.ObjectId(id)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "user",
                foreignField: "_id",
                as: "user"
            }
        },
        {
            $unwind: "$user"
        },
        {
            $group: {
                _id: "$user._id"
            }
        },
        {
            $count: "uniqueUserCount"
        }
    ]);
    const totalClient = result.length > 0 ? result[0].uniqueUserCount : 0;


    // yearly revenue
    const newDate = new Date();
    const startOfYear = new Date(newDate.getFullYear(), 0, 1).toISOString().split('T')[0];
    const endOfYear = new Date(newDate.getFullYear(), 11, 31).toISOString().split('T')[0];

    const yearlyBooking = await Booking.find({
        artist: id,
        createdAt: { $gte: startOfYear, $lt: endOfYear }
    });

    const yearlyIncome = [
        { month: "Jan", income: 0 },
        { month: "Feb", income: 0 },
        { month: "Mar", income: 0 },
        { month: "Apr", income: 0 },
        { month: "May", income: 0 },
        { month: "Jun", income: 0 },
        { month: "Jul", income: 0 },
        { month: "Aug", income: 0 },
        { month: "Sep", income: 0 },
        { month: "Oct", income: 0 },
        { month: "Nov", income: 0 },
        { month: "Dec", income: 0 }
    ];
    
    // Update income based on the booking creation date (createdAt)
    yearlyBooking.forEach((booking:any) => {
        const createdAtDate = new Date(booking.createdAt);
        const createdAtMonth = createdAtDate.getMonth();
    
        // Ensure that the month exists before trying to access income
        if (yearlyIncome[createdAtMonth]) {
            yearlyIncome[createdAtMonth].income += parseInt(booking?.price || 0);
        }
    });

    return { totalClient, balance, bookingList, yearlyIncome};
};


const lessonBookingFromDB = async(id: JwtPayload, status:string, date: string): Promise<IBooking | {}> =>{

    // Convert date to yyyy-mm-dd format
    const today = new Date().toISOString().split('T')[0];

    let query:any ={
        artist: id,
        booking_date: { $gte: today },
    };

    if(date){
        query.booking_date = date;
    }else{
        query.status = "Pending"
    }

    if (status) {
        if (status === "Accept") {
            query.status = "Accept";
        } else if (status === "Reject") {
            query.status = "Reject";
        }
    }

    const booking = await Booking.find(query).populate(
        {
            path: "user",
            select: "name profile"
        }
    ).select("user bookingId status booking_date");

    const bookingList = await Booking.find({ artist: id, booking_date: { $gte: today }})
    const bookingDates = [...new Set(bookingList.map(item => item.booking_date))]; 

    return { bookingDates, booking};
}

const sendLinkToUser = async(id: string, bookingLink:string): Promise<undefined>=>{
    const booking:any = await Booking.findById(id).populate("user artist");

    const emailData = {
        to: booking?.user?.email,
        userName: booking?.user?.name,
        artistName: booking?.artist?.name,
        bookingDate: booking?.booking_date,
        bookingTime: booking?.booking_time,
        bookingLink: bookingLink

    }

    // this notifications for artist
    const data = {
        sender: booking.user,
        receiver: booking.artist,
        text: `Send Lesson session link with details`,
    };
    await sendNotifications(data)
    
    await emailHelper.sendLink(emailData)
    
}

export const BookingService = {
    createBooking,
    myBookingFromDB,
    completeBookingToDB,
    rescheduleBookingToDB,
    checkAvailabilityBookingFromDB,
    transactionsHistoryFromDB,
    respondBookingToDB,
    bookingDetailsFromDB,
    bookingSummaryFromDB,
    lessonBookingFromDB,
    sendLinkToUser
}