import express from 'express'
import { USER_ROLES } from '../../../enums/user'
import auth from '../../middlewares/auth'
import validateRequest from '../../middlewares/validateRequest'
import { LessonController } from './lesson.controller'
import { LessonValidation } from './lesson.validation'
import fileUploadHandler from '../../middlewares/fileUploadHandler'
const router = express.Router()

router.post("/create", 
    auth(USER_ROLES.ARTIST), 
    fileUploadHandler(), 
    validateRequest(LessonValidation.createLessonZodSchema), 
    LessonController.createLesson
)

router.post("/update/:id", 
    auth(USER_ROLES.ARTIST), 
    fileUploadHandler(), 
    validateRequest(LessonValidation.updateLessonZodSchema), 
    LessonController.updateLesson
)

export const LessonRoutes = router