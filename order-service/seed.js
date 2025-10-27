import mongoose from "mongoose";
import dotenv from "dotenv";
import Order from "./src/models/Order.js";
import OrderItem from "./src/models/OrderItem.js";
import { Decimal128, ObjectId } from "mongodb";

dotenv.config();

const MONGO_URL = process.env.MONGO_URL || "mongodb://order-db:27017/orders-db";

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomPastDate() {
  const now = new Date();
  const start = new Date(2025, 0, 1).getTime();
  const end = now.getTime();
  const timestamp = randomInt(start, end);
  return new Date(timestamp);
}

function roundToThousand(num) {
  return Math.round(num / 1000) * 1000;
}

async function waitForMongo(retries = 10, delay = 2000) {
  for (let i = 0; i < retries; i++) {
    try {
      await mongoose.connect(MONGO_URL, { serverSelectionTimeoutMS: 2000 });
      console.log("Order MongoDB is ready");
      return;
    } catch {
      console.log("Waiting for Order MongoDB...");
      await new Promise((res) => setTimeout(res, delay));
    }
  }
  throw new Error("Order MongoDB not available after retries");
}

async function seed() {
  await waitForMongo();

  try {
    await Promise.all([Order.deleteMany({}), OrderItem.deleteMany({})]);

    const fakeProducts = Array.from({ length: 10 }).map((_, i) => ({
      _id: new ObjectId(),
      name: `Product ${i + 1}`,
      importPrice: Decimal128.fromString(`${randomInt(50000, 500000)}`),
      sellPrice: Decimal128.fromString(`${randomInt(60000, 600000)}`),
      image: `https://picsum.photos/200?random=${i + 1}`,
    }));

    const ordersData = [];
    const orderItemsData = [];

    for (let i = 0; i < 30; i++) {
      const numItems = randomInt(1, 5);
      const selectedProducts = Array.from({ length: numItems }).map(
        () => fakeProducts[randomInt(0, fakeProducts.length - 1)]
      );

      let total = 0;
      const createdAt = randomPastDate();

      const orderItems = selectedProducts.map((product) => {
        const quantity = randomInt(1, 5);
        const importPrice = parseInt(product.importPrice.toString());
        const sellPrice = parseInt(product.sellPrice.toString());

        const subtotal = sellPrice * quantity;
        const itemDiscount = roundToThousand(subtotal * 0.1);
        const finalSubtotal = subtotal - itemDiscount;

        total += finalSubtotal;

        return {
          product: product._id,
          product_name: product.name,
          image: product.image,
          quantity,
          importPrice: Decimal128.fromString(String(importPrice)),
          sellPrice: Decimal128.fromString(String(sellPrice)),
          subtotal: Decimal128.fromString(String(finalSubtotal)),
          discount: Decimal128.fromString(String(itemDiscount)),
          createdAt,
          updatedAt: createdAt,
        };
      });

      const discount = roundToThousand(total * 0.1);
      const grand_total = total - discount;

      const order = {
        orderNumber: `DH${String(i + 1).padStart(4, "0")}`,
        date: createdAt,
        total: Decimal128.fromString(String(total)),
        discount: Decimal128.fromString(String(discount)),
        grand_total: Decimal128.fromString(String(grand_total)),
        customerName: `Khách hàng ${i + 1}`,
        status: "confirmed",
        createdAt,
        updatedAt: createdAt,
      };

      ordersData.push(order);
      orderItemsData.push(orderItems);
    }

    const savedOrders = await Order.insertMany(ordersData, {
      timestamps: false,
    });

    const flatItems = orderItemsData.flatMap((items, i) =>
      items.map((it) => ({ ...it, order: savedOrders[i]._id }))
    );

    await OrderItem.insertMany(flatItems);

    console.log("Order seeding with fake products finished successfully!");
  } catch (err) {
    console.error("Order seeding error:", err);
  } finally {
    await mongoose.connection.close();
  }
}

seed();
