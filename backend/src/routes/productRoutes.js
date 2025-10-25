import express from "express";
import * as controller from "../controllers/productController.js";
import { validate } from "../middleware/validate.js";
import { createProductSchema } from "../validations/product.validation.js";

const router = express.Router();

router.get("/", controller.getAllProduct);
router.get("/search", controller.searchProducts);
router.get("/:id", controller.getProductById);
router.post("/", validate(createProductSchema), controller.createProduct);
router.put("/:id", controller.updateProduct);
router.delete("/", controller.deleteManyProducts);
router.delete("/:id", controller.deleteProduct);

export default router;
