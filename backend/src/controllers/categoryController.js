import Category from "../models/Category.js";
import Product from "../models/Product.js";

export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.status(200).json(categories);
  } catch (error) {
    console.log("Error fetching data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const id = req.params.id;
    const category = await Category.findById(id);
    if (!category) {
      return res
        .status(404)
        .json({ message: `Category with id of ${id} was not founded` });
    }
    res.status(200).json(category);
  } catch (error) {
    console.log("Error fetching data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(403);
    const newCategory = await Category.create({ name });
    res.status(201).json(newCategory);
  } catch (error) {
    console.log("Error create new category:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: "Bad request" });
    const id = req.params.id;
    const category = await Category.findByIdAndUpdate(
      id,
      { name },
      { new: true }
    );
    if (!category)
      return res
        .status(404)
        .json({ message: `Category with id of ${id} was not founded` });
    res.status(200).json({ message: "Updated successfully" });
  } catch (error) {
    console.log("Error update category:".error);
    res.status(500).json("Internal Server Error");
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const id = req.params.id;
    const category = await Category.findById(id);
    if (category) {
      await Product.deleteMany({ categoryid: id });
      await Category.findByIdAndDelete(id);
      return res.status(200).json({ message: "Category deleted successfully" });
    }
    res
      .status(404)
      .json({ message: `Category with id of ${id} was not founded` });
  } catch (error) {
    console.log("Error deleting category:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
