import express from "express";
import {
  createReceipt,
  deleteReceipt,
  getAllReceipts,
  getReceiptById,
  updateReceipt,
} from "../controllers/receiptController.js";

const router = express.Router();

router.get("/", getAllReceipts);
router.get("/:id", getReceiptById);
router.post("/", createReceipt);
router.put("/:id", updateReceipt);
router.delete("/:id", deleteReceipt);

export default router;
