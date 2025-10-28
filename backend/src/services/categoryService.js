import Category from "../models/Category.js";
import Product from "../models/Product.js";

export const getAll = async () => {
  const categories = await Category.find().sort({ createdAt: -1 });
  return categories;
};

export const findById = async (id) => {
  const category = await Category.findById(id);
  if (!category) {
    const error = new Error(`Category with id of ${id} was not founded`);
    error.statusCode = 404;
    throw error;
  }
  return category;
};

export const createCategory = async (name) => {
  const category = await Category.create({ name });
  return category;
};

export const updateCategory = async (id, name) => {
  const category = await Category.findByIdAndUpdate(id, { name: name });
  if (!category) {
    const error = new Error(`Category with id of ${id} was not founded`);
    error.statusCode = 404;
    throw error;
  }
  return category;
};

export const deleteCategory = async (id) => {
  const category = await Category.findByIdAndDelete(id);
  if (!category) {
    const error = new Error(`Category with id of ${id} was not founded`);
    error.statusCode = 404;
    throw error;
  }
  await Product.deleteMany({ category: category._id });
  return category;
};
