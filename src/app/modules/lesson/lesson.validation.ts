import { z } from "zod"

const createLessonZodSchema = z.object({
  body: z.object({
    title: z.string({ required_error: 'Title is required' }),
    notes: z.string({ required_error: 'Notes is required' }),
    price: z.string({ required_error: 'Price is required' }),
    lessonOnline: z.string({ required_error: 'Lesson Online is required' }),
    duration: z.string({ required_error: 'Duration is required' }),
    lesson: z.string({ required_error: 'Lesson is required' }),
    bio: z.string({ required_error: 'Bio is required' }),
    genre: z.string({ required_error: 'Genre is required' }),
    instrument: z.string({ required_error: 'Instrument is required' })
  }),
})

const updateLessonZodSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    notes: z.string(),
    price: z.string(),
    lessonOnline: z.string().optional(),
    duration: z.string().optional(),
    lesson: z.string().optional(),
    bio: z.string().optional(),
    genre: z.string().optional(),
    instrument: z.string().optional(),
  }),
})

export const LessonValidation = {
  createLessonZodSchema,
  updateLessonZodSchema,
}
