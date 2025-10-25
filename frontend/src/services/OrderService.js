import axios from "axios";

class OrderService {
  constructor(baseURL) {
    this.api = axios.create({
      baseURL: baseURL || "http://localhost:5000/api",
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  async getAllOrders(dateRange = {}) {
    try {
      const hasRange = dateRange && (dateRange.startDay || dateRange.endDay);
      if (hasRange) {
        const params = {
          startDate: dateRange.startDay || "",
          endDate: dateRange.endDay || "",
        };
        const res = await this.api.get("/order/date-range", { params });
        return res.data;
      }
      const res = await this.api.get("/order", { params: { ...dateRange } });
      return res.data;
    } catch (error) {
      console.error("OrderService.getAllOrders failed:", error);
      throw error;
    }
  }

  async getOrderById(id) {
    try {
      const res = await this.api.get(`/order/${id}`);
      return res.data;
    } catch (error) {
      console.error("OrderService.getOrderById failed:", error);
      throw error;
    }
  }

  async searchOrders(keyword) {
    try {
      const res = await this.api.get(`/order/search`, {
        params: { keyword },
      });
      return res.data;
    } catch (error) {
      console.error("OrderService.searchOrders failed:", error);
      throw error;
    }
  }

  async createOrder(orderData) {
    try {
      console.log(orderData);
      const res = await this.api.post("/order", orderData);
      return res.data;
    } catch (error) {
      console.error("OrderService.createOrder failed:", error);
      throw error;
    }
  }

  async updateOrder(id, orderData) {
    try {
      const res = await this.api.put(`/order/${id}`, orderData);
      return res.data;
    } catch (error) {
      console.error("OrderService.updateOrder failed:", error);
      throw error;
    }
  }

  async deleteOrder(id) {
    try {
      const res = await this.api.delete(`/order/${id}`);
      return res.data;
    } catch (error) {
      console.error("OrderService.deleteOrder failed:", error);
      throw error;
    }
  }
}

export default new OrderService();
