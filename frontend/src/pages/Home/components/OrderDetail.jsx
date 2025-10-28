import React, { useState, useEffect } from "react";
import OrderService from "../../../services/OrderService";

const OrderDetail = ({ order, onUpdateOrder, refresh }) => {
  const [discount, setDiscount] = useState(order?.discount || 0);
  const [subtotal, setSubtotal] = useState(0);

  const submitOrder = async () => {
    if (order) {
      const items = order.items.map((item) => ({
        id: item.id,
        quantity: item.quantity,
        sellPrice: parseFloat(item.sellPrice?.$numberDecimal || item.sellPrice),
      }));
      const data = { items, discount };
      const response = await OrderService.createOrder(data);
      if (response) {
        console.log("Order created successfully:", response);
        alert("Thanh toán thành công ");

        onUpdateOrder({ ...order, items: [], total: 0, discount: 0 });
        refresh((prev) => prev + 1);
      } else {
        alert("Thanh toán thất bại ");
      }
    }
  };

  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formattedDate = now.toLocaleDateString("en-GB");
  const formattedTime = now.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });

  useEffect(() => {
    const newSubtotal =
      order?.items?.reduce((sum, item) => {
        const price =
          parseFloat(item.sellPrice?.$numberDecimal || item.sellPrice) || 0;
        return sum + price * item.quantity;
      }, 0) || 0;

    setSubtotal(newSubtotal);
    setDiscount(order?.discount || 0);
    order.total = newSubtotal - (order?.discount || 0);
  }, [order]);

  useEffect(() => {
    setDiscount(order?.discount || 0);
  }, [order, subtotal]);

  const total = subtotal - (discount || 0);

  const handleDiscountChange = (e) => {
    const value = parseFloat(e.target.value) || 0;
    setDiscount(value);
    if (onUpdateOrder && order) {
      onUpdateOrder({ ...order, discount: value, total });
    }
  };

  if (!order) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        Chọn một hóa đơn để xem chi tiết
      </div>
    );
  }

  return (
    <div className="hide-scrollbar bg-white flex min-h-full flex-col justify-between overflow-y-scroll rounded-md p-3 shadow-2 border border-gray-300">
      <div className="space-y-2">
        <div className="flex justify-end space-x-2">
          <div>{formattedDate}</div>
          <div>{formattedTime}</div>
        </div>
        <div className="flex space-x-2 p-2">
          <input
            type="number"
            className="w-full bg-gray-200 rounded-md p-1.5 focus:outline-none focus:bg-white border-2 border-gray-200 focus:shadow-sm focus:shadow-blue-400 focus:border-blue-300"
            placeholder="Tìm kiếm khách hàng"
          />
          <button className="min-w-fit">+</button>
        </div>
        <div className="flex flex-col space-y-3 px-2 py-2">
          <div className="flex justify-between">
            <div>Tổng tiền hàng</div>
            <div>{subtotal.toLocaleString("vi-VN")}</div>
          </div>
          <div className="flex justify-between items-center">
            <div>Giảm giá</div>
            <input
              type="number"
              value={discount}
              onChange={handleDiscountChange}
              className="appearance-none w-1/3 p-0 border-b-2 rounded-none input border-0 border-gray-400 focus:outline-none text-end font-semibold text-lg"
            />
          </div>
          <div className="flex justify-between">
            <div className="font-bold">Khách cần trả</div>
            <div className="text-blue-400 font-bold text-lg">
              {total >= 0 ? total.toLocaleString("vi-VN") : "0"}
            </div>
          </div>
          {/* <div className="flex justify-between items-center">
            <div className="font-bold">Khách thanh toán</div>
            <input
              type="number"
              className="appearance-none w-1/3 p-0 border-b-2 rounded-none input border-0 border-gray-400 focus:outline-none text-end font-semibold text-lg"
            />
          </div> */}
        </div>
      </div>
      <div className="flex justify-between space-x-3 mt-2">
        {/* <button className="rounded-md bg-gray-400 px-5 py-4 font-semibold text-white w-1/4">
          IN
        </button> */}
        <button
          onClick={submitOrder}
          className="rounded-md bg-blue-500 px-3 py-4 font-semibold text-white w-full"
        >
          THANH TOÁN
        </button>
      </div>
    </div>
  );
};

export default OrderDetail;
