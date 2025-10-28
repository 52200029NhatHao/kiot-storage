import Notification from "../models/Notification.js";

export const getNotification = async () => {
  const notifications = await Notification.find().sort({ created_at: -1 });
  return notifications;
};

export const createNotification = async (data) => {
  const notification = new Notification({
    message: "Có sản phẩm sắp hết hàng",
    items: data,
    status: "unread",
  });
  await notification.save();
  return notification;
};

export const markAsRead = async (id) => {
  const notification = Notification.findByIdAndUpdate(id, { status: "read" });
  if (!notification) {
    const error = new Error(`Notification with id ${id} not found`);
    error.statusCode = 404;
    throw error;
  }
  return notification;
};
