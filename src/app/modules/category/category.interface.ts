import { Model } from 'mongoose';

export type ICategory = {
  categoryName: string;
  image: string;
}

export type CategoryModel = Model<ICategory, Record<string, unknown>>

/* export type CategoryFilterOption = {
  search?: string
} */
