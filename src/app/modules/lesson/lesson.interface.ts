import { Model, Types } from 'mongoose';

export type ILesson = {
  user: Types.ObjectId;
  title: string;
  genre: string;
  bio: string;
  lessonTitle: string;
  lessonDescription: string;
  duration: string;
  lessonOutline: string;
  price: number;
  notes: string;
  rating?: number;
  instrument: string;
  totalRating?: Number;
  gallery: [
    {
      image: string;
    }
  ]
};

export type LessonModal = Model<ILesson>;
