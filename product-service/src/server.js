import express from "express";
import { connectDB } from "./config/db.js";
import cors from "cors";
import logger from "./middleware/logger.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { startProductSubscriber } from "./redis/productSubcriber.js";

const PORT = process.env.PORT;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV !== "production") {
  app.use(cors());
}

app.use(logger);

app.use("/api/category", categoryRoutes);
app.use("/api/product", productRoutes);

app.use(errorHandler);

connectDB().then(() => {
  startProductSubscriber();
  app.listen(PORT, () => {
    console.log(`Server started on PORT: ${PORT}`);
  });
});
