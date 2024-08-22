import { Model, Types } from 'mongoose';

export type ILesson = {
  user: Types.ObjectId;
  title: string;
  genre: string;
  bio: string;
  lesson: string;
  duration: string;
  lessonOnline: string;
  price: string;
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
