import express from "express";
import { getAll, markAsRead } from "../controllers/notificationController.js";

const router = express.Router();

router.get("/", getAll);
router.put("/:id", markAsRead);

export default router;
