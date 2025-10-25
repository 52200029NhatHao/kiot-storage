import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    barcode: { type: String, required: true },
    name: { type: String, required: true },

    importPrice: { type: mongoose.Schema.Types.Decimal128, default: 0 },
    sellPrice: { type: mongoose.Schema.Types.Decimal128, default: 0 },

    stock: { type: Number, default: 0 },
    warning_stock: { type: Number, default: 0 },

    unit: { type: String, default: "Cái" },

    image: String,

    available: { type: Boolean, default: true },

    notice: { type: String, default: "" },

    status: {
      type: String,
      enum: ["available", "disable"],
      default: "available",
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
