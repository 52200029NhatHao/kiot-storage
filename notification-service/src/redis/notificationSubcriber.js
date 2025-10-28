import { createNotification } from "../services/notificationService.js";
import { createRedisSub } from "./redisClient.js";

const redisSubscriber = createRedisSub();

export const startNotificationSubscriber = async () => {
  await redisSubscriber.subscribe("warning_stock");

  redisSubscriber.on("message", async (channel, message) => {
    if (channel !== "warning_stock") return;

    const { items } = JSON.parse(message);
    console.log(`Received warning stock notification}`);

    await createNotification(items);
    console.log("Warning stock notification created");
  });

  console.log("Product service is listening for order_created events...");
};
