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
    bio: {
      type: String,
      required: true
    },
    lesson: {
      type: String,
      required: true
    },
    duration: {
      type: String,
      required: true
    },
    lessonOnline: {
      type: String,
      required: true
    },
    price: {
      type: String,
      required: true
    },
    notes: {
      type: String,
      required: true
    },
    rating: {
      type: String,
      required: false
    },
    totalRating: {
      type: Number,
      required: false,
      default: 0
    },
    gallery: [
      {
        image: {
          type: String,
          require: true
        }
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