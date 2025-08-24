import Category from "../models/Category.js";
import uploadImage from "../services/imageUrl.js";

export const handleImageUpload = async (files) => {
  if (!files || files.length === 0) return [];

  const uploadPromises = files.map((file) =>
    uploadImage(file.buffer, file.originalname)
  );
  const urls = await Promise.all(uploadPromises);

  if (urls.includes(null)) {
    throw new Error("Image upload failed");
  }

  return urls;
};

export const validateCategory = async (categoryid) => {
  if (!categoryid) return;
  const category = await Category.findById(categoryid);
  if (!category) {
    throw new Error(`Category with id ${categoryid} not found`);
  }
};

export const buildProductData = (body, imageUrl) => {
  return {
    barcode: body.barcode,
    name: body.name,
    importPrice: body.importPrice,
    sellPrice: body.sellPrice,
    stock: body.stock,
    unit: body.unit,
    available: body.available,
    notice: body.notice,
    categoryid: body.categoryid,
    imageUrl: imageUrl,
  };
};
