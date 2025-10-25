import axios from "axios";

class CategoryService {
  constructor(baseURL) {
    this.api = axios.create({
      baseURL: baseURL || "http://localhost:5000/api",
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  async getAllCategories() {
    try {
      const res = await this.api.get("/category");
      return res.data;
    } catch (error) {
      console.error("ProductService.getAllProducts failed:", error);
      throw error;
    }
  }

  async getCategoryById(id) {
    try {
      const res = await this.api.get(`/category/${id}`);
      return res.data;
    } catch (error) {
      console.error("CategoryService.getCategoryById failed:", error);
      throw error;
    }
  }

  async createCategory(data) {
    try {
      const res = await this.api.post("/category", data);
      return res.data;
    } catch (error) {
      console.error("CategoryService.createCategory failed:", error);
      throw error;
    }
  }

  async updateCategory(id, data) {
    try {
      const res = await this.api.put(`/category/${id}`, data);
      return res.data;
    } catch (error) {
      console.error("CategoryService.updateCategory failed:", error);
      throw error;
    }
  }

  async deleteCategory(id) {
    try {
      const res = await this.api.delete(`/category/${id}`);
      return res.data;
    } catch (error) {
      console.error("CategoryService.deleteCategory failed:", error);
      throw error;
    }
  }
}

export default new CategoryService();
