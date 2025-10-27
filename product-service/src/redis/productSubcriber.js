import Redis from "ioredis";
import Product from "../models/Product.js";

import { createRedisSub, createRedisPub } from "./redisClient.js";

const redisSubscriber = createRedisSub();
const redisPublisher = createRedisPub();

export const startProductSubscriber = async () => {
  await redisSubscriber.subscribe("order_created");

  redisSubscriber.on("message", async (channel, message) => {
    if (channel !== "order_created") return;

    const { orderId, items } = JSON.parse(message);
    console.log(`Received order_created for order ${orderId}`);

    try {
      for (const item of items) {
        const updated = await Product.findOneAndUpdate(
          { _id: item.productId, stock: { $gte: item.quantity } },
          { $inc: { stock: -item.quantity } },
          { new: true }
        );

        if (!updated)
          throw new Error(`Not enough stock for product ${item.productId}`);
        console.log(`Reduced stock for ${updated.name}`);
      }

      await redisPublisher.publish(
        "order_success",
        JSON.stringify({ orderId })
      );
      console.log(`order_success published for order ${orderId}`);
    } catch (err) {
      await redisPublisher.publish("order_failed", JSON.stringify({ orderId }));
      console.error(`order_failed for order ${orderId}: ${err.message}`);
    }
  });

  console.log("Product service is listening for order_created events...");
};
