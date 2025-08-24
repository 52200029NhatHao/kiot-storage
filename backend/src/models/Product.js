import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    barcode: { type: String, required: true },
    name: { type: String, required: true },

    importPrice: { type: mongoose.Schema.Types.Decimal128, default: 0 },
    sellPrice: { type: mongoose.Schema.Types.Decimal128, default: 0 },

    stock: { type: Number, default: 0 },
    waringStock: { type: Number, default: 0 },

    unit: { type: String, default: "Cái" },
    imageUrl: [{ type: String }],

    available: { type: Boolean, default: true },

    notice: { type: String },

    categoryid: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
