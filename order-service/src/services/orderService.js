import Order from "../models/Order.js";
import Decimal from "decimal.js";
import OrderItem from "../models/OrderItem.js";
import { publishOrderCreated } from "../redis/orderPublisher.js";

export const getAll = async () => {
  const orders = await Order.aggregate([
    { $match: { status: "confirmed" } },
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
        status: "confirmed",
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
    let total = new Decimal(0);
    let discount = new Decimal(data.discount || 0);
    const orderItemsDocs = [];

    for (const item of data.items) {
      const sellPrice = new Decimal(item.sellPrice.toString());
      const importPrice = new Decimal(item.importPrice?.toString() || 0);
      const subtotal = sellPrice.times(item.quantity);

      total = total.plus(subtotal);

      orderItemsDocs.push({
        product: item.id,
        image: item.image || null,
        product_name: item.name || "Unknown product",
        quantity: item.quantity,
        importPrice,
        sellPrice,
        subtotal,
      });
    }

    const grand_total = total.minus(discount);

    const order = new Order({
      total,
      grand_total,
      discount,
      status: "pending",
    });

    const newOrder = await order.save();

    orderItemsDocs.forEach((i) => (i.order = newOrder._id));
    await OrderItem.insertMany(orderItemsDocs);

    await publishOrderCreated({
      orderId: newOrder._id,
      items: data.items.map((i) => ({
        productId: i.id,
        quantity: i.quantity,
      })),
    });

    console.log(`Published order_created for order ${newOrder._id}`);

    return { order: newOrder };
  } catch (err) {
    console.error("Error creating order:", err);
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
