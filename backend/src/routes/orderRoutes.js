import express from "express";
import * as controller from "../controllers/orderController.js";
import { validate } from "../middleware/validate.js";
import { createOrderSchema } from "../validations/order.validation.js";
const router = express.Router();

router.get("/", controller.getAllOrder);
router.get("/date-range", controller.getOrdersByDateRange);
router.get("/:id", controller.getOrderById);
router.post("/", validate(createOrderSchema), controller.createOrder);
router.delete("/:id", controller.deleteOrder);

export default router;
