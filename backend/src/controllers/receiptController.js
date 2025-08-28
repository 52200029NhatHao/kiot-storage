import Product from "../models/Product.js";
import Receipt from "../models/Receipt.js";
import { handleUpdateReceipt } from "../utils/receiptUtils.js";

export const getAllReceipts = async (req, res) => {
  try {
    const receipts = await Receipt.find().sort({ createdAt: -1 });
    res.status(200).json(receipts);
  } catch (error) {
    console.log("Error fetching data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getReceiptById = async (req, res) => {
  const id = req.params.id;
  try {
    const receipt = await Receipt.findById(id);
    if (!receipt)
      return res
        .status(404)
        .json({ message: `Receipt with id of ${id} was not founded` });
    res.status(200).json(receipt);
  } catch (error) {
    console.log("Error fetching data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const createReceipt = async (req, res) => {
  const { products, discount = 0 } = req.body;
  if (!products.length > 0)
    return res.status(400).json({ message: "Product list is empty" });
  try {
    const { items, total } = await handleUpdateReceipt(products);
    const newReceipt = await Receipt.create({
      total: total - discount,
      products: items,
      discount: discount,
    });
    console.log(newReceipt);
    res.status(201).json(newReceipt);
  } catch (error) {
    console.log("Error create receipt:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateReceipt = async (req, res) => {
  const id = req.params.id;
  if (!products.length > 0)
    return res.status(400).json({ message: "Product list is empty" });
  const { products, discount = 0 } = req.body;
  try {
    const receipt = Receipt.findById(id);
    if (!receipt)
      return res
        .status(404)
        .json({ message: `Receipt with id of ${id} was not founded` });

    const ids = products.map((p) => p.id);
    const productDocs = await Product.find({ _id: { $in: ids } });
    if (productDocs.length !== products.length) {
      return res.status(400).json({ message: "Missing some products" });
    }

    let total = 0;
    const items = products.map((p) => {
      const quantity = p.quantity;
      const price = Product.findById(p.id).sellPrice;
      const subtotal = quantity * price;
      total += subtotal;
      return { productid: p._id, quantity: p.quantity };
    });
    receipt.total = total;
    receipt.products = items;
    const updateReceipt = await receipt.save();
    res.status(200).json(updateReceipt);
  } catch (error) {
    console.log("Error update receipt:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteReceipt = async (req, res) => {
  const id = req.params.id;
  try {
    const receipt = await Receipt.findByIdAndDelete(id);
    if (!receipt)
      return res
        .status(404)
        .json({ message: `Receipt with id of ${id} was not founded` });
    res.status(200).json({ message: "Receipt deleted successfully" });
  } catch (error) {
    console.log("Error deleting receipt:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
