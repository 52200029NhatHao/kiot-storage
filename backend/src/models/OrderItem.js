import mongoose from "mongoose";

const orderItemSchema = mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    image: { type: String },
    product_name: { type: String, required: true },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    quantity: { type: Number, default: 1 },
    importPrice: { type: mongoose.Schema.Types.Decimal128, required: true },
    sellPrice: { type: mongoose.Schema.Types.Decimal128, required: true },
    subtotal: { type: mongoose.Schema.Types.Decimal128, required: true },
    discount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const OrderItem = mongoose.model("OrderItem", orderItemSchema);
export default OrderItem;
