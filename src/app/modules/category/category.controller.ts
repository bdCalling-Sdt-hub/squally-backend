import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import catchAsync from '../../../shared/catchAsync'
import pick from '../../../shared/pick'
import sendResponse from '../../../shared/sendResponse'
import { CategoryService } from './category.service'
import { paginationFields } from '../../../shared/constant'

const createCategory = catchAsync(async (req: Request, res: Response) => {
  const { ...categoryData } = req.body
  const result = await CategoryService.createCategoryToDB(categoryData)

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Category create successfully',
    data: result,
  })
})

const getCategories = catchAsync(async (req: Request, res: Response) => {
  const paginationOptions = pick(req.query, paginationFields)
  const filterOptions = pick(req.query, ['search'])

  const result = await CategoryService.getCategoriesFromDB(
    paginationOptions,
    filterOptions,
  )

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Category create successfully',
    pagination: result.meta,
    data: result.data,
  })
})

const updateCategory = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id
  const { ...updateCategoryData } = req.body
  const result = await CategoryService.updateCategoryToDB(
    id,
    updateCategoryData,
  )

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Category updated successfully',
    data: result,
  })
})

const deleteCategory = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id
  const result = await CategoryService.deleteCategoryToDB(id)

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Category delete successfully',
    data: result,
  })
})

export const CategoryController = {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
}
