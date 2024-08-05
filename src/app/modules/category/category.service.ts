import { StatusCodes } from 'http-status-codes'
import { SortOrder } from 'mongoose'
import ApiError from '../../../errors/ApiError'
import { paginationHelper } from '../../../helpers/paginationHelper'
import { IGenericResponse } from '../../../types/common'
import { IPaginationOptions } from '../../../types/pagination'
import { CategoryFilterOption, ICategory } from './category.interface'
import { Category } from './category.model'

const createCategoryToDB = async (payload: ICategory) => {
  const createCategory = await Category.create(payload)
  if (!createCategory) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create category')
  }

  return createCategory
}

const getCategoriesFromDB = async (
  paginationOptions: IPaginationOptions,
  filterOptions: CategoryFilterOption,
): Promise<IGenericResponse<ICategory[]>> => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(paginationOptions)
  const { search } = filterOptions

  let filter = {}
  if (search) {
    filter = { categoryName: { $regex: search, $options: 'i' } }
  }

  const sortCondition: { [key: string]: SortOrder } = {}
  if (sortBy && sortOrder) {
    sortCondition[sortBy] = sortOrder
  }

  const result = await Category.find(filter)
    .sort(sortCondition)
    .skip(skip)
    .limit(limit)

  const total = await Category.countDocuments(filter)
  const totalPage = Math.ceil(total / limit)
  return {
    meta: {
      page,
      limit,
      totalPage,
      total,
    },
    data: result,
  }
}

const updateCategoryToDB = async (id: string, payload: ICategory) => {
  const updateCategory = await Category.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  })
  if (!updateCategory) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Category doesn't exist")
  }

  return updateCategory
}

const deleteCategoryToDB = async (id: string): Promise<ICategory | null> => {
  const deleteCategory = await Category.findByIdAndDelete(id)
  if (!deleteCategory) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Category doesn't exist")
  }
  return deleteCategory
}

export const CategoryService = {
  createCategoryToDB,
  getCategoriesFromDB,
  updateCategoryToDB,
  deleteCategoryToDB,
}
