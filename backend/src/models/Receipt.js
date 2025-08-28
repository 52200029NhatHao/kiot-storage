import mongoose from "mongoose";

const receiptSchema = new mongoose.Schema(
  {
    total: { type: mongoose.Schema.Types.Decimal128, default: 0 },
    products: [
      {
        id: { type: String },
        quantity: { type: Number },
        sellPrice: { type: mongoose.Schema.Types.Decimal128 },
        importPrice: { type: mongoose.Schema.Types.Decimal128 },
        discount: { type: mongoose.Schema.Types.Decimal128 },
        subtotal: { type: mongoose.Schema.Types.Decimal128 },
      },
    ],
    discount: { type: mongoose.Schema.Types.Decimal128, default: 0 },
  },
  { timestamps: true }
);

const Receipt = mongoose.model("Receipt", receiptSchema);
export default Receipt;
