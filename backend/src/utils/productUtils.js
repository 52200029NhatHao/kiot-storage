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
  console.log(!categoryid);

  const category = await Category.findById(categoryid);
  if (!category) {
    return false;
  }
  return true;
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

export const handleProductUpdateField = (product, body) => {
  const allowedFields = [
    "barcode",
    "name",
    "sellPrice",
    "importPrice",
    "stock",
    "warningStock",
    "unit",
    "available",
    "notice",
    "categoryid",
  ];

  for (let field of allowedFields) {
    if (body[field] !== undefined) {
      product[field] = body[field];
    }
  }
  return product;
};
