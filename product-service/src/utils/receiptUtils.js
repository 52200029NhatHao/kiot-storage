import Product from "../models/Product.js";

export const handleUpdateReceipt = async (products) => {
  const ids = products.map((p) => p.id);

  try {
    const productMap = new Map(
      (await Product.find({ _id: { $in: ids } })).map((doc) => [
        doc._id.toString(),
        doc,
      ])
    );
    let total = 0;
    const result = products.map((p) => {
      const product = productMap.get(p.id);
      if (!product) throw new Error(`Product not found: ${p.id}`);

      const sellPrice = parseFloat(product.sellPrice.toString());
      const importPrice = parseFloat(product.importPrice.toString());
      const quantity = Number(p.quantity);
      const discount = p.discount ? p.discount : 0;

      const subtotal = sellPrice * quantity - discount;
      total += subtotal;

      return {
        productId: product._id,
        quantity,
        sellPrice,
        importPrice,
        discount,
        subtotal,
      };
    });

    return { items: result, total };
  } catch (error) {
    console.log("Error handle update receipt:", error);
  }
};
