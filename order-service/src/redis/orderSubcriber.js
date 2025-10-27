import Order from "../models/Order.js";
import { createRedisSub } from "./redisClient.js";

const redisSubscriber = createRedisSub();

export const startOrderSubscriber = async () => {
  await redisSubscriber.subscribe("order_success", "order_failed");

  redisSubscriber.on("message", async (channel, message) => {
    const data = JSON.parse(message);
    const { orderId } = data;

    try {
      if (channel === "order_success") {
        await Order.findByIdAndUpdate(orderId, { status: "confirmed" });
        console.log(`Order ${orderId} confirmed`);
      } else if (channel === "order_failed") {
        await Order.findByIdAndUpdate(orderId, { status: "cancelled" });
        console.log(`Order ${orderId} cancelled`);
      }
    } catch (err) {
      console.error(`Failed to update order ${orderId}: ${err.message}`);
    }
  });

  console.log("Order service is listening for product-service events...");
};
