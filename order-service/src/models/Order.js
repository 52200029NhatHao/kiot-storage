import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    total: { type: mongoose.Schema.Types.Decimal128, default: 0 },
    grand_total: { type: mongoose.Schema.Types.Decimal128, default: 0 },
    discount: { type: mongoose.Schema.Types.Decimal128, default: 0 },

    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
