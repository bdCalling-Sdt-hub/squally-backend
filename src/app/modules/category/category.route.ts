import express from 'express'
import { USER_TYPE } from '../../../enums/user'
import auth from '../../middlewares/auth'
import validateRequest from '../../middlewares/validateRequest'
import { CategoryController } from './category.controller'
import { CategoryValidation } from './category.validation'
const router = express.Router()

router.post(
  '/create-category',
  auth(USER_TYPE.SUPER_ADMIN, USER_TYPE.ADMIN),
  validateRequest(CategoryValidation.createCategoryZodSchema),
  CategoryController.createCategory,
)

router
  .route('/:id')
  .patch(
    auth(USER_TYPE.SUPER_ADMIN, USER_TYPE.ADMIN),
    CategoryController.updateCategory,
  )
  .delete(
    auth(USER_TYPE.SUPER_ADMIN, USER_TYPE.ADMIN),
    CategoryController.deleteCategory,
  )

router.get(
  '/',
  auth(USER_TYPE.SUPER_ADMIN, USER_TYPE.ADMIN),
  CategoryController.getCategories,
)

export const CategoryRoutes = router
