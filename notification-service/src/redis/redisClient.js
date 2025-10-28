import Redis from "ioredis";

const REDIS_HOST = process.env.REDIS_HOST || "redis";
const REDIS_PORT = process.env.REDIS_PORT || 6379;

let subscriberClient = null;

export const createRedisSub = () => {
  if (!subscriberClient) {
    subscriberClient = new Redis({
      host: REDIS_HOST,
      port: REDIS_PORT,
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
      lazyConnect: false,
      enableReadyCheck: false,
    });

    subscriberClient.on("connect", () => {
      console.log("Redis Subscriber connected");
    });

    subscriberClient.on("error", (err) => {
      console.error("Redis Subscriber error:", err);
    });

    subscriberClient.on("ready", () => {
      console.log("Redis Subscriber ready");
    });

    subscriberClient.on("reconnecting", () => {
      console.log("Redis Subscriber reconnecting...");
    });
  }
  return subscriberClient;
};

export const closeRedisConnections = async () => {
  try {
    if (publisherClient) {
      await publisherClient.quit();
      console.log("Redis Publisher closed");
    }
  } catch (err) {
    console.error("Error closing publisher:", err);
  }

  try {
    if (subscriberClient) {
      await subscriberClient.quit();
      console.log("Redis Subscriber closed");
    }
  } catch (err) {
    console.error("Error closing subscriber:", err);
  }
};
