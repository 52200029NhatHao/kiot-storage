import Order from "../models/Order.js";
import Decimal from "decimal.js";
import Product from "../models/Product.js";
import { mongoose } from "mongoose";
import OrderItem from "../models/OrderItem.js";

export const getAll = async () => {
  const orders = await Order.aggregate([
    {
      $lookup: {
        from: "orderitems",
        localField: "_id",
        foreignField: "order",
        as: "items",
      },
    },
    { $sort: { createdAt: -1 } },
  ]);
  return orders;
};

export const getOrdersByDateRange = async (startDate, endDate) => {
  const orders = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
      },
    },
    {
      $lookup: {
        from: "orderitems",
        localField: "_id",
        foreignField: "order",
        as: "items",
      },
    },
    { $sort: { createdAt: -1 } },
  ]);
  return orders;
};

export const findById = async (id) => {
  const [order, items] = await Promise.all([
    Order.findById(id),
    OrderItem.find({ order: id }),
  ]);
  if (!order) {
    const error = new Error(`Order with id of ${id} was not founded`);
    error.statusCode = 404;
    throw error;
  }
  return { order, items };
};

export const createOrder = async (data) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const productIds = data.items.map((p) => p.id);
    const products = await Product.find({ _id: { $in: productIds } }).session(
      session
    );
    const productMap = new Map(products.map((p) => [p._id.toString(), p]));

    let total = new Decimal(0);
    let discount = new Decimal(data.discount || 0);
    const orderItemsDocs = [];
    const bulkOps = [];

    for (const item of data.items) {
      const product = productMap.get(item.id.toString());
      if (!product) throw new Error(`Product with ${item.id} not found`);
      if (product.stock < item.quantity)
        throw new Error(`Not enough stock for product ${product._id}`);

      const sellPrice = new Decimal(item.sellPrice.toString());
      const importPrice = new Decimal(product.importPrice.toString());
      // const productDiscount = calculateDiscount(sellPrice, item.discount);
      const subtotal = new Decimal(
        // sellPrice.minus(productDiscount).times(item.quantity)
        sellPrice.times(item.quantity)
      );
      product.stock -= item.quantity;

      // discount = discount.plus(productDiscount.times(item.quantity));
      total = total.plus(sellPrice.times(item.quantity));

      orderItemsDocs.push({
        product: product._id,
        image: product.image || null,
        product_name: product.name,
        // discount: productDiscount,
        quantity: item.quantity,
        importPrice,
        sellPrice,
        subtotal,
      });
      bulkOps.push({
        updateOne: {
          filter: { _id: product._id },
          update: { $set: { stock: product.stock } },
        },
      });
    }
    const grand_total = total.minus(discount);
    const order = new Order({
      total,
      grand_total,
      discount,
    });
    const newOrder = await order.save({ session });
    if (bulkOps.length > 0) {
      await Product.bulkWrite(bulkOps, { session });
    }
    orderItemsDocs.forEach((i) => (i.order = newOrder._id));
    await OrderItem.insertMany(orderItemsDocs, { session });
    await session.commitTransaction();
    return { order: newOrder };
  } catch (err) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    throw err;
  } finally {
    session.endSession();
  }
};

export const deleteOrder = async (id) => {
  const order = await Order.findByIdAndDelete(id);
  if (!order) {
    const error = new Error(`Order with id of ${id} was not founded`);
    error.statusCode = 404;
    throw error;
  }
  return order;
};

const calculateDiscount = (price, discount) => {
  if (!discount) return new Decimal(0);
  const value = new Decimal(discount.value);
  if (discount.type === "fixed") return value;
  return price.times(value).div(100);
};
