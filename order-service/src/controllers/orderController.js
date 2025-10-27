import * as orderService from "../services/orderService.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

export const getAllOrder = asyncHandler(async (req, res) => {
  const orders = await orderService.getAll();
  res.status(200).json(orders);
});

export const getOrderById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const order = await orderService.findById(id);
  res.status(200).json(order);
});

export const getOrdersByDateRange = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;
  const orders = await orderService.getOrdersByDateRange(startDate, endDate);
  res.status(200).json(orders);
});

export const createOrder = asyncHandler(async (req, res) => {
  const data = req.body;
  const order = await orderService.createOrder(data);
  res.status(201).json(order);
});

export const updateOrder = asyncHandler(async (req, res) => {
  const data = req.body;
  const order = await orderService.updateOrder(data);
  res.status(200).json(order);
});

export const deleteOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await orderService.deleteOrder(id);
  res.status(200).json({ message: "Order deleted successfully" });
});
