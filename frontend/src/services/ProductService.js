import axios from "axios";

class ProductService {
  constructor(baseURL) {
    this.api = axios.create({
      baseURL: baseURL || "http://localhost:5001/api",
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  async getAllProducts() {
    try {
      const res = await this.api.get("/product");
      return res.data;
    } catch (error) {
      console.error("ProductService.getAllProducts failed:", error);
      throw error;
    }
  }

  async getProductById(id) {
    try {
      const res = await this.api.get(`/product/${id}`);
      return res.data;
    } catch (error) {
      console.error("ProductService.getProductById failed:", error);
      throw error;
    }
  }

  async searchProducts(keyword) {
    try {
      const res = await this.api.get(`/product/search`, {
        params: { keyword },
      });
      return res.data;
    } catch (error) {
      console.error("ProductService.searchProducts failed:", error);
      throw error;
    }
  }

  async createProduct(productData) {
    try {
      console.log(productData);
      const res = await this.api.post("/product", productData);
      return res.data;
    } catch (error) {
      console.error("ProductService.createProduct failed:", error);
      throw error;
    }
  }

  async updateProduct(id, productData) {
    try {
      const res = await this.api.put(`/product/${id}`, productData);
      return res.data;
    } catch (error) {
      console.error("ProductService.updateProduct failed:", error);
      throw error;
    }
  }

  async deleteProduct(id) {
    try {
      const res = await this.api.delete(`/product/${id}`);
      return res.data;
    } catch (error) {
      console.error("ProductService.deleteProduct failed:", error);
      throw error;
    }
  }

  async deleteManyProducts(ids) {
    try {
      const res = await this.api.delete("/product/", { data: { ids } });
      return res.data;
    } catch (error) {
      console.error("ProductService.deleteManyProducts failed:", error);
      throw error;
    }
  }
}

export default new ProductService();
