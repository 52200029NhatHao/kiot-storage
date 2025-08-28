import Category from "../models/Category.js";
import Product from "../models/Product.js";
import uploadImage from "../services/imageUrl.js";
import {
  generateProductCode,
  getNextSequence,
} from "../utils/generateBarcode.js";
import {
  buildProductData,
  handleImageUpload,
  handleProductUpdateField,
  validateCategory,
} from "../utils/productUtils.js";

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    console.log("Error fetching data: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getProductById = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.findById(id);
    if (!product) {
      console.log(`Product with id of ${id} was not founded`);
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    console.log("Error fetching data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const createProduct = async (req, res) => {
  const { barcode, name, categoryid } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    await validateCategory(categoryid);
    const imageUrl = await handleImageUpload(req.files);

    let generatedBarcode = barcode;
    if (!barcode) {
      const nextSeq = await getNextSequence("product");
      generatedBarcode = generateProductCode(nextSeq, new Date());
    }

    const productData = buildProductData(req.body, imageUrl);
    productData.barcode = generatedBarcode;

    const newProduct = await Product.create(productData);
    res.status(201).json(newProduct);
  } catch (err) {
    console.error("Create product failed:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

export const updateProduct = async (req, res) => {
  const { barcode, categoryid } = req.body;
  const id = req.params.id;

  try {
    let product = await Product.findById(id);
    if (!product)
      return res
        .status(404)
        .json({ message: `Product with value of ${id} was not founded` });
    const checkCate = await validateCategory(categoryid);
    if (checkCate === false)
      return res
        .status(404)
        .json({ message: `Category with id of ${categoryid} was not founded` });
    product = handleProductUpdateField(product, req.body);
    const imageUrl = await handleImageUpload(req.files);
    if (imageUrl.length > 0) product.imageUrl.push(...imageUrl);
    product.save();
    res.status(200).json(product);
  } catch (err) {
    console.error("Create product failed:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) return res.status(400).json({ message: "Invalid id" });
    const product = await Product.findByIdAndDelete(id);
    if (!product)
      return res
        .status(404)
        .json({ message: `Product with id of ${id} was not founded` });
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.log("Error deleting product:", error);
    res.status(500).json("Internal server error");
  }
};
