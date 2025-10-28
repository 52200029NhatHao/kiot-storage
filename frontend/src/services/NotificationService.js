import axios from "axios";

class NotificationService {
  constructor(baseURL) {
    this.api = axios.create({
      baseURL: baseURL || "http://localhost:5001/api",
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  async getAll() {
    try {
      const res = await this.api.get("/notification");
      return res.data;
    } catch (error) {
      console.error("Notification.getAll failed:", error);
      throw error;
    }
  }

  async markAsRead(id) {
    try {
      const res = await this.api.put(`/notification/${id}`);
      return res.data;
    } catch (error) {
      console.error("NotificationService.markAsRead failed:", error);
      throw error;
    }
  }
}

export default new NotificationService();
