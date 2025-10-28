import * as service from "../services/notificationService.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

export const getAll = asyncHandler(async (req, res) => {
  const notifications = await service.getNotification();
  res.status(200).json(notifications);
});

export const markAsRead = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const notification = await service.markAsRead(id);
  res.status(200).json(notification);
});
