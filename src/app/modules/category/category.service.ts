import { StatusCodes } from 'http-status-codes'
import ApiError from '../../../errors/ApiError'
import { ICategory } from './category.interface'
import { Category } from './category.model'
import unlinkFile from '../../../shared/unlinkFile'

const createCategoryToDB = async (payload: ICategory) => {
  const {categoryName, image} = payload;
  const isExistName = await Category.findOne({categoryName: categoryName})

  if(isExistName){
    unlinkFile(image);
    throw new ApiError(StatusCodes.NOT_ACCEPTABLE, "This Category Name Already Exist");
  }

  const createCategory = await Category.create(payload)
  if (!createCategory) {
    unlinkFile(image);
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create category')
  }

  return createCategory
}

const getCategoriesFromDB = async (): Promise<ICategory[]> => {
  const result = await Category.find({})
  return result;
}

const updateCategoryToDB = async (id: string, payload: ICategory) => {
  const isExistCategory = await Category.findById(id);

  if(!isExistCategory){
    throw new ApiError(StatusCodes.BAD_REQUEST, "Category doesn't exist");
  }
  
  if (payload.image) {
    unlinkFile(isExistCategory?.image);
  }

  const updateCategory = await Category.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  })

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
