import { createRedisPub } from "./redisClient.js";

const redisPublisher = createRedisPub();

export const publishOrderCreated = async (orderData) => {
  await redisPublisher.publish("warning_stock", JSON.stringify(orderData));
  console.log(`Published warning stock for notification`);
};
