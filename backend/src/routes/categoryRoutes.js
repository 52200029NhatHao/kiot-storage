import express from "express";
import * as controller from "../controllers/categoryController.js";
import { validate } from "../middleware/validate.js";
import { createCategorySchema } from "../validations/category.validation.js";
const router = express.Router();

router.get("/", controller.getAllCategories);
router.get("/:id", controller.getCategoryById);
router.post("/", validate(createCategorySchema), controller.createCategory);
router.put("/:id", controller.updateCategory);
router.delete("/:id", controller.deleteCategory);

export default router;
