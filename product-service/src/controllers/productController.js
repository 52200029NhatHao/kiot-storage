import * as productService from "../services/productService.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

export const getAllProduct = asyncHandler(async (req, res) => {
  const products = await productService.getAll();
  res.status(200).json(products);
});

export const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await productService.findById(id);
  res.status(200).json(product);
});

export const searchProducts = asyncHandler(async (req, res) => {
  const { keyword } = req.query;
  const products = await productService.searchByKeyword(keyword);
  res.status(200).json(products);
});

export const createProduct = asyncHandler(async (req, res) => {
  const data = req.body;
  const product = await productService.createProduct(data);
  res.status(201).json(product);
});

export const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const product = await productService.updateProduct(id, data);
  res.status(200).json(product);
});

export const updateStock = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;
  const product = await productService.updateStock(id, quantity);
  res.status(200).json(product);
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await productService.deleteProduct(id);
  res.status(200).json({ message: "Product deleted successfully" });
});

export const deleteManyProducts = asyncHandler(async (req, res) => {
  const { ids } = req.body;
  await productService.deleteManyProducts(ids);
  res.status(200).json({ message: "Products deleted successfully" });
});
