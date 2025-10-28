import mongoose from "mongoose";

const notificationSchema = mongoose.Schema({
  message: { type: String, default: "Có sản phẩm sắp hết hàng" },
  items: [
    {
      name: String,
      stock: Number,
    },
  ],
  status: {
    type: String,
    enum: ["read", "unread"],
    default: "unread",
  },
});

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;
