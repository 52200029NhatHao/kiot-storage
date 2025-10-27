import Category from "../models/Category.js";

export const validateCategory = async (categoryid) => {
  if (!categoryid) return;

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
