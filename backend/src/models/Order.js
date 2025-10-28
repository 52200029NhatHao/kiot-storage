import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    total: { type: mongoose.Schema.Types.Decimal128, default: 0 },
    grand_total: { type: mongoose.Schema.Types.Decimal128, default: 0 },
    discount: { type: mongoose.Schema.Types.Decimal128, default: 0 },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
