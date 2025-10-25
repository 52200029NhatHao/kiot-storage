import React, { useState } from "react";
import SideBar from "../../components/SideBar";
import AddProductModal from "./components/AddProductModal";
import ProductTable from "./components/ProductTable";
import { useEffect } from "react";
import ProductService from "../../services/ProductService";
import { useLocation } from "react-router-dom";

const Product = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [updateProduct, setUpdateProduct] = useState(null);

  const fetchProducts = async () => {
    try {
      const data = await ProductService.getAllProducts();
      setProducts(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleAddProduct = () => {
    fetchProducts();
  };

  useEffect(() => {
    fetchProducts();
  }, []);
  const location = useLocation();
  useEffect(() => {
    fetchProducts();
  }, [location.search]);

  const popUpAddModal = (product = null) => {
    if (product) {
      setUpdateProduct(product);
    } else {
      setUpdateProduct(null);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setUpdateProduct(null);
  };

  return (
    <>
      <AddProductModal
        isModalOpen={isModalOpen}
        popUpAddModal={popUpAddModal}
        handleAddProduct={handleAddProduct}
        product={updateProduct}
        closeModal={closeModal}
      />
      <div className="flex flex-row h-screen overflow-y-hidden">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="fixed top-2 left-2 z-[60] md:hidden bg-gray-700 text-white p-2 rounded-md"
        >
          <span className="sr-only">Open sidebar</span>
          <svg
            className="w-6 h-6"
            aria-hidden="true"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              clipRule="evenodd"
              fillRule="evenodd"
              d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 
              10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 
              1.5h-7.5a.75.75 0 01-.75-.75zM2 
              10a.75.75 0 01.75-.75h14.5a.75.75 0 
              010 1.5H2.75A.75.75 0 012 10z"
            ></path>
          </svg>
        </button>

        <SideBar
          className={`fixed top-0 left-0 z-50 h-full w-64 bg-gray-500 text-white transition-transform duration-300 pt-14
          ${isSidebarOpen ? "translate-x-0 " : "-translate-x-full"} 
          lg:translate-x-0`}
        />

        <div
          className={`flex-1 flex flex-col bg-[rgb(235,237,239)] pt-14 px-5 space-y-4 overflow-y-hidden transition-all duration-300 
          lg:ml-64`}
        >
          <p className="font-bold text-3xl">Quản lý sản phẩm</p>
          <div
            id="tableWrapper"
            className="overflow-x-hidden mt-8 overflow-y-hidden"
          >
            {" "}
            {isLoading ? (
              <div>Loading...</div>
            ) : (
              <ProductTable
                popUpAddModal={popUpAddModal}
                products={products}
                handleDeleteProduct={handleAddProduct}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Product;
