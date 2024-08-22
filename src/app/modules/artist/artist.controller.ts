import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { ArtistService } from './artist.service';
import mongoose from 'mongoose';

const artistProfileFromDB = catchAsync(async(req: Request, res: Response)=>{
    const user = req.params.id;
    const result = await ArtistService.artistProfileFromDB(user);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Artist Profile Retrieved Successfully",
        data: result
    })
})

const popularArtistFromDB = catchAsync(async(req: Request, res: Response)=>{
    const result = await ArtistService.popularArtistFromDB();
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Popular Available Artist Retrieved Successfully",
        data: result
    })
})

const artistByCategoryFromDB = catchAsync(async(req: Request, res: Response)=>{
    const category = req.params.category;
    const result = await ArtistService.artistByCategoryFromDB(category);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: " Artist By Category Retrieved Successfully",
        data: result
    })
})

const availableArtistFromDB = catchAsync(async(req: Request, res: Response)=>{
    const result = await ArtistService.availableArtistFromDB();
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Available Artist Retrieved Successfully",
        data: result
    })
})

export const ArtistController = {
    artistProfileFromDB,
    popularArtistFromDB,
    artistByCategoryFromDB,
    availableArtistFromDB
};