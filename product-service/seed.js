import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./src/models/Product.js";
import Category from "./src/models/Category.js";
import { Decimal128 } from "mongodb";

dotenv.config();

const MONGO_URL =
  process.env.MONGO_URL || "mongodb://product-db:27017/products-db";

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function roundToThousand(num) {
  return Math.round(num / 1000) * 1000;
}

async function waitForMongo(retries = 10, delay = 2000) {
  for (let i = 0; i < retries; i++) {
    try {
      await mongoose.connect(MONGO_URL, { serverSelectionTimeoutMS: 2000 });
      console.log("Product MongoDB is ready");
      return;
    } catch {
      console.log("Waiting for Product MongoDB...");
      await new Promise((res) => setTimeout(res, delay));
    }
  }
  throw new Error("Product MongoDB not available after retries");
}

async function seed() {
  await waitForMongo();

  try {
    await Promise.all([Product.deleteMany({}), Category.deleteMany({})]);

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

    await Product.insertMany(productsData);

    console.log("Product seeding finished successfully!");
  } catch (err) {
    console.error("Product seeding error:", err);
  } finally {
    await mongoose.connection.close();
  }
}

seed();
