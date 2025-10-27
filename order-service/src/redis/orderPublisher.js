import { createRedisPub } from "./redisClient.js";

const redisPublisher = createRedisPub();

export const publishOrderCreated = async (orderData) => {
  await redisPublisher.publish("order_created", JSON.stringify(orderData));
  console.log(`Published order_created for order ${orderData.orderId}`);
};
