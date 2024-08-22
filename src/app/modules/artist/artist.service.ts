import { ILesson } from "../lesson/lesson.interface";
import { Lesson } from "../lesson/lesson.model"
import { Bookmark } from "../bookmark/bookmark.model";
import { User } from "../user/user.model";
import mongoose from "mongoose";
import { IUser } from "../user/user.interface";
import { Booking } from "../booking/booking.model";


const artistProfileFromDB= async(payload: string): Promise<ILesson>=>{
    const isExistArtist:any = await User.findById(payload)
    .populate({
        path: "lesson",
        select: "title genre bio duration price notes rating totalRating gallery lessonTitle lessonDescription lessonOutline"
    }).select("name profile");

    // get all artist id from bookmark;
    const bookmarkId = await Bookmark.find({artist: payload}).distinct("artist");

    // Convert ObjectId to strings if necessary
    const bookmarkIdStrings = bookmarkId.map(id => id.toString());


    // now checking bookmark includes the artist; 
    const isWish = bookmarkIdStrings.includes(isExistArtist._id.toString());

    const result = {
        ...isExistArtist.toObject(),
        bookmark: isWish
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

        const data = {
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
    }).select("gallery lessonTitle user rating totalRating").sort({rating: -1})

    // get all artist id from bookmark;
    const bookmarkId = await Bookmark.find({}).distinct("artist");
    const bookmarkIdStrings = bookmarkId.map(id => id.toString());

    // Add wish property to each artist if it matches with the bookmark
    const popularArtist = artists.map((item:any) => {
        const artist = item.toObject();
        const {user, ...otherArtist} = artist;
        const isWish = bookmarkIdStrings.includes(artist?.user?._id.toString());

        const data = {
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


const availableArtistFromDB= async(): Promise<undefined>=>{

    // Get IDs of artist who have made a booking
    const bookedArtistIds = await Booking.distinct("artist");

    // Find users who are not in the list of bookedArtistIds
    const availableArtists:any = await User.find({ _id: { $in: bookedArtistIds }})
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
            lesson,
            wish: isWish
        }
        return data;
    });

    return availableArtist;
}

export const  ArtistService ={
    artistProfileFromDB,
    popularArtistFromDB,
    artistByCategoryFromDB,
    availableArtistFromDB
}