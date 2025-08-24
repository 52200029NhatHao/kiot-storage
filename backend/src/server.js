import express from "express";
import { connectDB } from "./config/db.js";
import path from "path";
import productRoutes from "./routes/productRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import cors from "cors";
import logger from "./middleware/logger.js";

const PORT = process.env.PORT;
const app = express();
const __dirname = path.resolve();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV !== "production") {
  app.use(
    cors({
      origin: "http://localhost:5173",
    })
  );
}

app.use(logger);

app.use("/api/products", productRoutes);
app.use("/api/category", categoryRoutes);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server started on PORT: ${PORT}`);
  });
});
