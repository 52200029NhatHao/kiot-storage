import React, { useState, useEffect, useMemo } from "react";
import IncomeChart from "./components/IncomeChart";
import StatCard from "./components/StatCard";
import DateRangeSelector from "./components/DateRangeSelector";
import OrderService from "../../services/OrderService";
import SideBar from "../../components/SideBar";

const validPeriods = ["weekly", "monthly", "yearly"];
const Profit = () => {
  const [orders, setOrders] = useState([]);
  const [period, setPeriod] = useState("weekly");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const loadOrders = async () => {
      const today = new Date();
      const thirtyDaysAgo = new Date(today);
      thirtyDaysAgo.setDate(today.getDate() - 29);

      setStartDate(thirtyDaysAgo.toISOString().split("T")[0]);
      setEndDate(today.toISOString().split("T")[0]);

      try {
        const res = await OrderService.getAllOrders();
        const data = Array.isArray(res) ? res : [];

        const normalized = data.map((o) => ({
          ...o,
          grand_total: o.grand_total?.$numberDecimal
            ? parseFloat(o.grand_total.$numberDecimal)
            : parseFloat(o.grand_total || 0),
          createdAt: o.createdAt || new Date().toISOString(),
          items: Array.isArray(o.items) ? o.items : [],
        }));

        if (normalized.length > 0) {
          const earliestTs = normalized.reduce((min, o) => {
            const t = new Date(o.createdAt).getTime();
            return t < min ? t : min;
          }, Infinity);
          const earliestDate = new Date(earliestTs);
          const earliestISO = earliestDate.toISOString().split("T")[0];
          const currentStart = thirtyDaysAgo.toISOString().split("T")[0];
          if (earliestISO < currentStart) {
            setStartDate(earliestISO);
          }
        }

        setOrders(normalized);
      } catch (err) {
        console.error("Lỗi tải dữ liệu đơn hàng:", err);
        setOrders([]);
      }
    };

    loadOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    if (!startDate || !endDate) return orders;
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    return orders.filter((o) => {
      const date = new Date(o.createdAt);
      return date >= start && date <= end;
    });
  }, [orders, startDate, endDate]);

  const chartData = useMemo(() => {
    const buckets = [];
    const now = new Date();

    if (period === "weekly") {
      const monday = new Date(now);
      const dayIdx = (monday.getDay() + 6) % 7;
      monday.setDate(monday.getDate() - dayIdx);
      for (let i = 0; i < 7; i++) {
        const d = new Date(monday);
        d.setDate(monday.getDate() + i);
        const raw = d.toISOString().split("T")[0];
        buckets.push({
          rawLabel: raw,
          label: d.toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "short",
          }),
          start: new Date(raw + "T00:00:00"),
          end: new Date(raw + "T23:59:59.999"),
          amount: 0,
        });
      }
    } else if (period === "monthly") {
      const y = now.getFullYear();
      const m = now.getMonth();
      const lastDay = new Date(y, m + 1, 0).getDate();
      const ranges = [
        [1, 7],
        [8, 14],
        [15, 21],
        [22, lastDay],
      ];
      for (let i = 0; i < 4; i++) {
        const [s, e] = ranges[i];
        const start = new Date(y, m, s, 0, 0, 0, 0);
        const end = new Date(y, m, e, 23, 59, 59, 999);
        const label = `${s}-${e}`;
        buckets.push({ rawLabel: `${s}-${e}`, label, start, end, amount: 0 });
      }
    } else if (period === "yearly") {
      const y = now.getFullYear();
      for (let i = 0; i < 12; i++) {
        const s = new Date(y, i, 1, 0, 0, 0, 0);
        const e = new Date(y, i + 1, 0, 23, 59, 59, 999);
        const raw = `${y}-${String(i + 1).padStart(2, "0")}`;
        const label = s.toLocaleDateString("vi-VN", { month: "short" });
        buckets.push({ rawLabel: raw, label, start: s, end: e, amount: 0 });
      }
    }

    filteredOrders.forEach((order) => {
      const date = new Date(order.createdAt);
      for (const b of buckets) {
        if (date >= b.start && date <= b.end) {
          b.amount += Number(order.grand_total || 0);
          break;
        }
      }
    });

    return buckets.map((b) => ({
      label: b.label,
      amount: b.amount,
      rawLabel: b.rawLabel,
    }));
  }, [filteredOrders, period]);

  const stats = useMemo(() => {
    const total = filteredOrders.reduce(
      (sum, o) => sum + Number(o.grand_total || 0),
      0
    );
    const count = filteredOrders.length;
    const average = count > 0 ? total / count : 0;

    const productTotals = {};
    filteredOrders.forEach((o) => {
      o.items.forEach((item) => {
        const name = item.product_name;
        const subtotal =
          item.subtotal?.$numberDecimal !== undefined
            ? parseFloat(item.subtotal.$numberDecimal)
            : parseFloat(item.subtotal || 0);
        productTotals[name] = (productTotals[name] || 0) + subtotal;
      });
    });

    const topProduct = Object.entries(productTotals).sort(
      (a, b) => b[1] - a[1]
    )[0];

    return {
      total,
      count,
      average,
      topProduct: topProduct
        ? { name: topProduct[0], amount: topProduct[1] }
        : null,
    };
  }, [filteredOrders]);

  return (
    <>
      <div className="flex flex-row h-screen">
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
          className={`flex-1 flex flex-col bg-[rgb(235,237,239)] pt-14 px-5 space-y-4 pb-10 transition-all duration-300 
          lg:ml-64 overflow-auto`}
        >
          <p className="font-bold text-3xl">Doanh thu</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Tổng thu nhập"
              value={new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
                maximumFractionDigits: 0,
              }).format(stats.total)}
              color="blue"
            />
            <StatCard title="Số hóa đơn" value={stats.count} color="green" />
            <StatCard
              title="Trung bình mỗi hóa đơn"
              value={new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
                maximumFractionDigits: 0,
              }).format(stats.average)}
              color="purple"
            />
            <StatCard
              title="Sản phẩm bán chạy"
              value={stats.topProduct ? stats.topProduct.name : "N/A"}
              color="orange"
            />
          </div>

          {/* <div className="mb-6">
              <DateRangeSelector
                startDate={startDate}
                endDate={endDate}
                onStartDateChange={setStartDate}
                onEndDateChange={setEndDate}
              />
            </div> */}

          <div className="mb-6 bg-white rounded-xl shadow-lg p-4 border border-blue-100">
            <div className="flex items-center gap-4 flex-wrap">
              <span className="text-sm font-medium text-gray-700">
                Xem theo:
              </span>
              {validPeriods.map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    period === p
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {p === "daily"
                    ? "Ngày"
                    : p === "weekly"
                    ? "Tuần"
                    : p === "monthly"
                    ? "Tháng"
                    : "Năm"}
                </button>
              ))}
            </div>
          </div>

          <IncomeChart data={chartData} period={period} />
        </div>
      </div>
    </>
  );
};

export default Profit;
