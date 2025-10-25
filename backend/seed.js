import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./src/models/Product.js";
import Category from "./src/models/Category.js";
import Order from "./src/models/Order.js";
import OrderItem from "./src/models/OrderItem.js";
import { Decimal128 } from "mongodb";

dotenv.config();

const MONGO_URL = process.env.MONGO_URL || "mongodb://database:27017/warehouse";

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDate2025() {
  const month = randomInt(0, 11);
  const day = randomInt(1, 28);
  const hour = randomInt(0, 23);
  const minute = randomInt(0, 59);
  return new Date(2025, month, day, hour, minute);
}

function roundToThousand(num) {
  return Math.round(num / 1000) * 1000;
}
async function waitForMongo(retries = 10, delay = 2000) {
  for (let i = 0; i < retries; i++) {
    try {
      await mongoose.connect(process.env.MONGO_URL, {
        serverSelectionTimeoutMS: 2000,
      });
      console.log("MongoDB is ready");
      return;
    } catch {
      console.log("Waiting for MongoDB...");
      await new Promise((res) => setTimeout(res, delay));
    }
  }
  throw new Error("MongoDB not available after retries");
}

async function seed() {
  await waitForMongo();

  try {
    await Promise.all([
      Product.deleteMany({}),
      Category.deleteMany({}),
      Order.deleteMany({}),
      OrderItem.deleteMany({}),
    ]);

    const categories = await Category.insertMany([
      { name: "Đồ điện" },
      { name: "Đồ gia dụng" },
      { name: "Thời trang" },
      { name: "Thực phẩm" },
      { name: "Văn phòng phẩm" },
      { name: "Đồ chơi" },
    ]);

    const productNames = [
      "Ổ điện 3 lỗ",
      "Bóng đèn LED 30W",
      "Nồi cơm điện",
      "Áo thun nam",
      "Gạo ST25",
      "Bút bi Thiên Long",
      "Gấu bông Teddy",
      "Quạt mini USB",
      "Tai nghe Bluetooth",
      "Sách kỹ năng sống",
    ];

    const productsData = productNames.map((name, index) => {
      const importPrice = roundToThousand(randomInt(50000, 500000));
      const sellPrice = roundToThousand(importPrice * 1.2);

      return {
        barcode: `SP${String(index + 1).padStart(3, "0")}`,
        name,
        importPrice: Decimal128.fromString(String(importPrice)),
        sellPrice: Decimal128.fromString(String(sellPrice)),
        stock: randomInt(10, 200),
        warning_stock: randomInt(5, 20),
        unit: "Cái",
        image: "https://picsum.photos/200",
        available: true,
        notice: "",
        status: "available",
        category: categories[randomInt(0, categories.length - 1)]._id,
      };
    });

    const products = await Product.insertMany(productsData);

    const ordersData = [];
    const orderItemsData = [];

    for (let i = 0; i < 30; i++) {
      const numItems = randomInt(1, 5);
      const selectedProducts = Array.from({ length: numItems }).map(
        () => products[randomInt(0, products.length - 1)]
      );

      let total = 0;
      const createdAt = randomDate2025();

      const orderItems = selectedProducts.map((product) => {
        const quantity = randomInt(1, 5);
        const importPrice = parseInt(product.importPrice.toString());
        const sellPrice = parseInt(product.sellPrice.toString());

        const subtotal = sellPrice * quantity;
        const itemDiscount = roundToThousand(subtotal * 0.1); // 10%
        const finalSubtotal = subtotal - itemDiscount;

        total += finalSubtotal;

        return {
          product: product._id,
          image: product.image,
          product_name: product.name,
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
        status: "completed",
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

    await mongoose.connection.close();
    console.log("Seeding finished successfully!");
  } catch (err) {
    console.error("Seeding error:", err);
    await mongoose.connection.close();
  }
}

seed();
