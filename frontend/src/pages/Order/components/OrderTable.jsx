import React from "react";
import OrderCard from "./OrderCard";
import emptyImg from "../../../assets/empty.jpg";
const OrderTable = ({
  orders = [],
  onDeleteOrder,
  sortByDate,
  setDateRange,
}) => {
  const handleDateRangeChange = (e) => {
    const value = e.target.value;
    const today = new Date();
    let startDay = "";
    let endDay = "";

    if (value === "0") {
      startDay = "";
      endDay = "";
    } else if (value === "1") {
      const start = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        0,
        0,
        0,
        0
      );
      const end = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        23,
        59,
        59,
        999
      );
      startDay = start.toISOString();
      endDay = end.toISOString();
    } else if (value === "2") {
      const day = today.getDay();
      const diffToMonday = (day + 6) % 7;
      const monday = new Date(today);
      monday.setDate(today.getDate() - diffToMonday);
      monday.setHours(0, 0, 0, 0);
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);
      sunday.setHours(23, 59, 59, 999);
      startDay = monday.toISOString();
      endDay = sunday.toISOString();
    } else if (value === "3") {
      const start = new Date(
        today.getFullYear(),
        today.getMonth(),
        1,
        0,
        0,
        0,
        0
      );
      const end = new Date(
        today.getFullYear(),
        today.getMonth() + 1,
        0,
        23,
        59,
        59,
        999
      );
      startDay = start.toISOString();
      endDay = end.toISOString();
    } else if (value === "4") {
      const start = new Date(today.getFullYear(), 0, 1, 0, 0, 0, 0);
      const end = new Date(today.getFullYear(), 11, 31, 23, 59, 59, 999);
      startDay = start.toISOString();
      endDay = end.toISOString();
    }

    setDateRange({ startDay, endDay });
  };
  return (
    <>
      <div className=" flex md:flex-row flex-col md:justify-between justify-center items-center space-y-3 md:space-y-0 bg-[rgb(235,237,239)] md:space-x-5 sticky top-0 z-10 mb-2 pb-2">
        <div className="flex relative flex-row justify-start items-center space-x-3 w-full "></div>
        <div className="flex flex-row justify-end md:justify-center w-full md:w-fit items-center space-x-3 min-w-fit">
          <div className="flex items-center space-x-2">
            <div>
              <select
                onChange={(e) => {
                  sortByDate(e.target.value === "0" ? true : false);
                }}
                className="whitespace-nowrap bg-white focus:outline-none p-2 rounded-md border-2 border-gray-400 focus:border-blue-400 focus:bg-blue-100 "
              >
                <option value="0">Mới nhất</option>
                <option value="1">Cũ nhất</option>
              </select>
            </div>
          </div>
          <select
            onChange={handleDateRangeChange}
            className="whitespace-nowrap bg-white focus:outline-none p-2 rounded-md border-2 border-gray-400 focus:border-blue-400 focus:bg-blue-100 "
          >
            <option value="0">Toàn bộ</option>
            <option value="1">Hôm nay</option>
            <option value="2">Tuần này</option>
            <option value="3">Tháng này</option>
            <option value="4">Năm nay</option>
          </select>
        </div>
      </div>
      <div className="max-h-[500px] overflow-y-auto">
        <table className="table w-full min-w-fit bg-white border-separate border-spacing-y-0">
          <thead className="sticky top-0 z-[10]">
            <tr className="text-slate-800 border bg-blue-300 shadow-lg h-16 rounded-xl">
              <th className="w-2/12  px-3 whitespace-nowrap text-center">ID</th>

              <th className="w-1/12 px-3 whitespace-nowrap text-left ">
                Ngày lập
              </th>
              <th className="w-1/12 px-3 whitespace-nowrap text-center">
                Số lượng
              </th>
              <th className="w-2/12 px-3 whitespace-nowrap text-center">
                Giá gốc
              </th>
              <th className="w-2/12 px-3 whitespace-nowrap text-center">
                Giảm giá
              </th>
              <th className="w-2/12 px-3 whitespace-nowrap text-center">
                Thành tiền
              </th>
              <th className="w-3/12 px-3 whitespace-nowrap text-center ">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="space-y-4" id="productsBlock">
            {orders.length === 0 ? (
              <tr>
                <td colSpan="10" className="p-6 text-center">
                  <div className="flex flex-col justify-center items-center space-y-4">
                    <div className="text-2xl font-bold text-blue-500">
                      Không tìm thấy hóa đơn
                    </div>
                    <img className="size-40" src={emptyImg} alt="empty.png" />
                  </div>
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <OrderCard
                  key={order._id}
                  order={order}
                  onDeleteOrder={onDeleteOrder}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default OrderTable;
