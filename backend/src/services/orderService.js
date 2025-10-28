import Order from "../models/Order.js";
import Decimal from "decimal.js";
import OrderItem from "../models/OrderItem.js";
import { publishOrderCreated } from "../redis/orderPublisher.js";
import Product from "../models/Product.js";
import mongoose from "mongoose";

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
  try {
    const productIds = data.items.map((p) => p.id);
    const products = await Product.find({ _id: { $in: productIds } });
    const productMap = new Map(products.map((p) => [p._id.toString(), p]));

    let total = new Decimal(0);
    let discount = new Decimal(data.discount || 0);
    const orderItemsDocs = [];
    const bulkOps = [];
    const warningProducts = [];

    for (const item of data.items) {
      const product = productMap.get(item.id.toString());
      if (!product) throw new Error(`Product with ${item.id} not found`);
      if (product.stock < item.quantity)
        throw new Error(`Not enough stock for product ${product._id}`);

      const sellPrice = new Decimal(item.sellPrice.toString());
      const importPrice = new Decimal(product.importPrice.toString());
      const subtotal = sellPrice.times(item.quantity);

      product.stock -= item.quantity;
      if (product.stock <= product.warning_stock) warningProducts.push(product);

      total = total.plus(subtotal);

      orderItemsDocs.push({
        product: product._id,
        image: product.image || null,
        product_name: product.name,
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
    const newOrder = await order.save();

    if (bulkOps.length > 0) {
      await Product.bulkWrite(bulkOps);
    }

    orderItemsDocs.forEach((i) => (i.order = newOrder._id));
    await OrderItem.insertMany(orderItemsDocs);

    if (warningProducts.length > 0)
      await publishOrderCreated({
        items: warningProducts.map((i) => ({
          name: i.name,
          stock: i.stock,
        })),
      });

    return { order: newOrder };
  } catch (err) {
    throw err;
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
