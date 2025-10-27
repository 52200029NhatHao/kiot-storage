import * as categoryService from "../services/categoryService.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

export const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await categoryService.getAll();
  res.status(200).json(categories);
});

export const getCategoryById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const category = await categoryService.findById(id);
  res.status(200).json(category);
});

export const createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const category = await categoryService.createCategory(name);
  res.status(201).json(category);
});

export const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const category = await categoryService.updateCategory(id, name);
  res.status(200).json(category);
});

export const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await categoryService.deleteCategory(id);
  res.status(200).json({ message: "Category deleted successfully" });
});
