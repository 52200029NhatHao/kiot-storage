import express from "express";
import { connectDB } from "./config/db.js";
import cors from "cors";
import logger from "./middleware/logger.js";
import notificationRoutes from "./routes/notificationRouter.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { startNotificationSubscriber } from "./redis/notificationSubcriber.js";

const PORT = process.env.PORT;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV !== "production") {
  app.use(cors());
}

app.use(logger);

app.use("/api/notification", notificationRoutes);

app.use(errorHandler);

connectDB().then(() => {
  startNotificationSubscriber();
  app.listen(PORT, () => {
    console.log(`Server started on PORT: ${PORT}`);
  });
});
