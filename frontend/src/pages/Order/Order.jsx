import React, { useState, useEffect } from "react";
import SideBar from "../../components/SideBar";
import OrderService from "../../services/OrderService";
import OrderTable from "./components/OrderTable";

const Order = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [dateDescending, setDateDescending] = useState(true);
  const [dateRange, setDateRange] = useState({ startDay: "", endDay: "" });

  const onDeleteOrder = async (id) => {
    try {
      await OrderService.deleteOrder(id);
      setOrders(orders.filter((order) => order._id !== id));
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  const sortOrdersByDate = (orders, value) => {
    const copy = Array.isArray(orders) ? [...orders] : [];
    if (value) {
      return copy.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }
    return copy.sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  };

  useEffect(() => {
    console.log(dateRange);
    const fetchOrders = async () => {
      console.log(dateRange);
      try {
        const data = await OrderService.getAllOrders(dateRange);
        setOrders(data || []);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [dateRange]);

  useEffect(() => {
    console.log("dateDescending", dateDescending);
    setOrders((prevOrders) => sortOrdersByDate(prevOrders, dateDescending));
  }, [dateDescending]);

  return (
    <>
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
          <p className="font-bold text-3xl">Quản lý hóa đơn</p>
          <div
            id="tableWrapper"
            className="overflow-x-hidden mt-8 overflow-y-hidden"
          >
            {" "}
            {isLoading ? (
              <div>Loading...</div>
            ) : (
              <OrderTable
                orders={orders}
                onDeleteOrder={onDeleteOrder}
                sortByDate={setDateDescending}
                setDateRange={setDateRange}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Order;
