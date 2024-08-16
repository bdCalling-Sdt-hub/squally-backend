import { z } from "zod";

const createReviewZodSchema = z.object({
    body: z.object({
        text: z.string({required_error: "Title is required"}),
        rating: z.number({required_error: "Rating is required"})
    })
});

export const ReviewValidation = { createReviewZodSchema}