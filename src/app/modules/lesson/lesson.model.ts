import { model, Schema } from 'mongoose';
import { ILesson, LessonModal } from './lesson.interface';

const lessonSchema = new Schema<ILesson, LessonModal>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    genre: {
      type: String,
      required: true
    },
    instrument: {
      type: String,
      required: true
    },
    bio: {
      type: String,
      required: true
    },
    lessonTitle: {
      type: String,
      required: true
    },
    lessonDescription: {
      type: String,
      required: true
    },
    duration: {
      type: String,
      required: true
    },
    lessonOutline: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    notes: {
      type: String,
      required: true
    },
    rating: {
      type: Number,
      default: 0
    },
    totalRating: {
      type: Number,
      required: false,
      default: 0
    },
    gallery: [
      {
        type: String,
        require: true
      }
    ]
  },
  { timestamps: true }
);

//exist user check
lessonSchema.statics.isExistLessonById = async (id: string) => {
  const isExist = await Lesson.findById(id);
  return isExist;
};

export const Lesson = model<ILesson, LessonModal>('Lesson', lessonSchema);