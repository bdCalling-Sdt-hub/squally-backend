import { ILesson } from "../lesson/lesson.interface";
import { Lesson } from "../lesson/lesson.model"
import { Bookmark } from "../bookmark/bookmark.model";
import { User } from "../user/user.model";
import { IUser } from "../user/user.interface";
import { Booking } from "../booking/booking.model";
import { Review } from "../review/review.model";


const artistProfileFromDB= async(payload: string): Promise<ILesson>=>{
    const isExistArtist:any = await User.findById(payload)
    .populate({
        path: "lesson",
        select: "title genre instrument bio duration price notes rating totalRating gallery lessonTitle lessonDescription lessonOutline"
    }).select("name profile");

    // get all artist id from bookmark;
    const bookmarkId = await Bookmark.find({artist: payload}).distinct("artist");

    const reviews = await Review.find({artist: payload})
    .populate({
        path: "user", 
        select: "name profile"
    }).select("user text rating")

    // Convert ObjectId to strings if necessary
    const bookmarkIdStrings = bookmarkId?.map(id => id?.toString());


    // now checking bookmark includes the artist; 
    const isWish = bookmarkIdStrings?.includes(isExistArtist?._id.toString());

    const result = {
        ...isExistArtist?.toObject(),
        bookmark: isWish,
        reviews: reviews || []
    }

    return result;
}

const popularArtistFromDB= async(): Promise<IUser[]>=>{

    const artists:any = await Lesson.find({rating: {$gt: 0}})
    .populate({
        path: "user",
        select: "name profile"
    }).select("gallery  user rating totalRating lessonTitle duration").sort({rating: -1})

    // get all artist id from bookmark;
    const bookmarkId = await Bookmark.find({}).distinct("artist");
    const bookmarkIdStrings = bookmarkId.map(id => id.toString());

    // Add wish property to each artist if it matches with the bookmark
    const popularArtist = artists.map((item:any) => {
        const artist = item.toObject();
        const {user, ...otherArtist} = artist;
        const isWish = bookmarkIdStrings.includes(artist?.user?._id.toString());

        const data:any = {
            ...user,
            lesson: {
                ...otherArtist
            },
            wish: isWish
        }
        return data;
    });
    return popularArtist;
}

const artistByCategoryFromDB= async(category: string): Promise<ILesson[]>=>{

    const artists:any = await Lesson.find({genre: category })
    .populate({
        path: "user",
        select: "name profile"
    }).select("gallery title user rating totalRating").sort({rating: -1})


    // Add wish property to each artist if it matches with the bookmark
    const popularArtist = artists.map((item:any) => {
        const artist = item.toObject();
        const {user, ...otherArtist} = artist;

        const data = {
            ...user,
            lesson: {
                ...otherArtist
            }
        }
        return data;
    });
    return popularArtist;
}


const availableArtistFromDB= async(): Promise<undefined>=>{

    // Get IDs of artist who have made a booking
    const bookedArtistIds = await Booking.distinct("artist");
    console.log(bookedArtistIds)

    // Find users who are not in the list of bookedArtistIds
    const availableArtists:any = await User.find({ _id: { $nin: bookedArtistIds }, role: "ARTIST"})
    .populate({
        path: "lesson",
        select: "gallery rating totalRating lessonTitle duration"
    })
    .select("name profile lesson");


    // get all artist id from bookmark;
    const bookmarkId = await Bookmark.find({}).distinct("artist");
    const bookmarkIdStrings = bookmarkId.map(id => id.toString());


    // Add wish property to each artist if it matches with the bookmark
    const availableArtist = availableArtists.map((item:any) => {
        const artist = item.toObject();
        const {lesson, ...otherData} = artist;
        const isWish = bookmarkIdStrings.includes(artist?._id.toString());

        const data = {
            ...otherData,
            lesson: lesson || {},
            wish: isWish
        }
        return data;
    });

    return availableArtist;
}

// artist list
const artistListFromDB= async(query:any): Promise<ILesson[]>=>{

    const {search, rating, ...filerData } = query;
    const anyConditions = [];

    // Artist search handling
    if (search && typeof search === "string" && search.trim().length > 0) {
        anyConditions.push({
            $or: ["title", "lessonTitle", "genre", "instrument"].map((field) => ({
                [field]: {
                    $regex: new RegExp(search, "i")
                }
            }))
        });
    }

    // artist filter here
    if(Object.keys(filerData).length){
        anyConditions.push({
            $and: Object.entries(filerData).map(([field, value])=>({
                [field]: value
            }))
        })
    }

    //artist filter with price range
    if (rating) {
        anyConditions.push({
            rating: {
                $gte: rating,
                $lt: rating + 1
            },
        });
    }
    
    const whereConditions = anyConditions.length > 0 ? { $and: anyConditions } : {};

    // Find users who are not in the list of bookedArtistIds
    const results:any = await Lesson.find(whereConditions)
    .populate({
        path: "user",
        select: "name profile"
    })
    .select("rating totalRating gallery title");


    // Add wish property to each artist if it matches with the bookmark
    const availableArtist = results.map((item:any) => {
        const artist = item.toObject();
        const { user, ...otherData} = artist;

        const data = {
            ...user,
            lesson:{
                ...otherData
            }
        }
        return data;
    });

    return availableArtist;
}


export const  ArtistService ={
    artistProfileFromDB,
    popularArtistFromDB,
    artistByCategoryFromDB,
    availableArtistFromDB,
    artistListFromDB
}