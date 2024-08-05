import { model, Schema } from 'mongoose'
import { CategoryModel, ICategory } from './category.interface'

const categorySchema = new Schema<ICategory, CategoryModel>(
  {
    categoryName: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true },
)

export const Category = model<ICategory, CategoryModel>(
  'Category',
  categorySchema,
)
