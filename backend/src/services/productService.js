import Product from "../models/Product.js";
import {
  generateProductCode,
  getNextSequence,
} from "../utils/generateBarcode.js";
import { validateCategory } from "../utils/productUtils.js";

export const getAll = async () => {
  const products = await Product.aggregate([
    {
      $lookup: {
        localField: "category",
        foreignField: "_id",
        from: "categories",
        as: "category",
      },
    },
    { $unwind: "$category" },
  ]);
  return products;
};

export const findById = async (id) => {
  const product = await Product.findById(id);
  if (!product) {
    const error = new Error(`Product with id of ${id} was not founded`);
    error.statusCode = 404;
    throw error;
  }
  return product;
};

export const searchByKeyword = async (keyword) => {
  const regex = new RegExp(keyword, "i");
  const products = await Product.find({
    $or: [{ name: regex }, { barcode: regex }],
  });
  return products;
};

export const createProduct = async (data) => {
  Object.keys(data).forEach((key) => data[key] == null && delete data[key]);

  if (data.category) await validateCategory(data.category);
  let generatedBarcode = data.barcode;
  if (!data.barcode) {
    const nextSeq = await getNextSequence("product");
    generatedBarcode = generateProductCode(nextSeq, new Date());
  }
  data.barcode = generatedBarcode;

  const product = await Product.create(data);
  return product;
};

export const updateProduct = async (id, data) => {
  const updates = { ...data };

  let imageUpdates = null;
  if (updates.images) {
    imageUpdates = updates.images;
    delete updates.images;
  }

  Object.keys(updates).forEach(
    (key) => updates[key] == null && delete updates[key]
  );

  const updateQuery = {};
  if (Object.keys(updates).length > 0) {
    updateQuery.$set = updates;
  }
  if (imageUpdates) {
    updateQuery.$push = { images: { $each: imageUpdates } };
  }

  const product = await Product.findByIdAndUpdate(id, updateQuery, {
    new: true,
  });
  return product;
};

export const deleteProduct = async (id) => {
  const product = await Product.findByIdAndDelete(id);
  if (!product) {
    const error = new Error(`Product with id of ${id} was not found`);
    error.statusCode = 404;
    throw error;
  }
  return product;
};

export const deleteManyProducts = async (ids) => {
  const products = await Product.deleteMany({ _id: { $in: ids } });
};
