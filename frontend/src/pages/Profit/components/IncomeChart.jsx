import { useMemo } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

export default function IncomeChart({ data, period }) {
  const periodNames = {
    daily: "Ngày",
    weekly: "Tuần",
    monthly: "Tháng",
    yearly: "Năm",
  };

  const formatMillions = (value) => {
    const v = Number(value || 0) / 1_000_000;
    return `${v.toLocaleString("vi-VN", { maximumFractionDigits: 2 })} tr`;
  };
  const vndFormatter = useMemo(
    () =>
      new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
        maximumFractionDigits: 0,
      }),
    []
  );
  const chartData = useMemo(() => {
    if (!data || data.length === 0)
      return { bars: [], maxValue: 0, labels: [] };

    const normalized = data.map((d) => ({
      ...d,
      amount: Number(d.amount) || 0,
      rawLabel: d.rawLabel || d.label,
    }));

    normalized.sort((a, b) => {
      if (period === "daily") {
        return Number(a.rawLabel) - Number(b.rawLabel);
      }
      if (period === "weekly") {
        const weekA = Number(a.rawLabel.replace(/\D/g, ""));
        const weekB = Number(b.rawLabel.replace(/\D/g, ""));
        return weekA - weekB;
      }
      if (period === "monthly") {
        const monthA = Number(a.rawLabel.replace(/\D/g, ""));
        const monthB = Number(b.rawLabel.replace(/\D/g, ""));
        return monthA - monthB;
      }
      if (period === "yearly") {
        return Number(a.rawLabel) - Number(b.rawLabel);
      }
      return 0;
    });

    const maxVal = Math.max(...normalized.map((d) => d.amount), 1);

    const bars = normalized.map((d) => ({
      ...d,
      height: (d.amount / maxVal) * 100,
    }));

    return {
      bars,
      maxValue: maxVal,
      normalized,
    };
  }, [data, period]);

  const totalAmount = useMemo(() => {
    if (chartData && chartData.normalized) {
      return chartData.normalized.reduce(
        (sum, d) => sum + (Number(d.amount) || 0),
        0
      );
    }
    return data.reduce((sum, d) => sum + (Number(d.amount) || 0), 0);
  }, [data, chartData]);

  const averageAmount = useMemo(() => {
    return data.length > 0 ? totalAmount / data.length : 0;
  }, [data, totalAmount]);

  // const trend = useMemo(() => {
  //   const arr = (chartData && chartData.normalized) || data || [];
  //   if (!arr || arr.length < 2) return 0;
  //   const lastValue = Number(arr[arr.length - 1].amount) || 0;
  //   const previousValue = Number(arr[arr.length - 2].amount) || 0;
  //   if (previousValue === 0) return 0;
  //   return ((lastValue - previousValue) / previousValue) * 100;
  // }, [data, chartData]);

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-x-auto p-6 border border-blue-100 min-h-fit">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            {`Doanh thu ${periodNames[period] || period}`}
          </h3>
          <div className="flex items-center gap-4 mt-2">
            <p className="text-3xl font-bold text-blue-600">
              {vndFormatter.format(totalAmount)}
            </p>
            {/* {trend !== 0 && (
              <div
                className={`flex items-center gap-1 px-2 py-1 rounded-full text-sm font-medium ${
                  trend > 0
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {trend > 0 ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                <span>{Math.abs(trend).toFixed(1)}%</span>
              </div>
            )} */}
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Average: {vndFormatter.format(averageAmount)}
          </p>
        </div>
      </div>

      <div className="relative h-80 flex items-stretch gap-1">
        {chartData.bars.length === 0 ? (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No data available for this period
          </div>
        ) : (
          <>
            <div className="absolute inset-0 flex flex-col justify-between text-xs text-gray-400 pr-2 z-0 pointer-events-none">
              <span>{formatMillions(chartData.maxValue)}</span>
              <span>{formatMillions(chartData.maxValue * 0.75)}</span>
              <span>{formatMillions(chartData.maxValue * 0.5)}</span>
              <span>{formatMillions(chartData.maxValue * 0.25)}</span>
              <span>{formatMillions(0)}</span>
            </div>

            <div className="flex-1 flex items-end gap-1 ml-12 z-10 h-full">
              {chartData.bars.map((bar, index) => (
                <div
                  key={index}
                  className="flex-1 flex flex-col items-center group h-full"
                >
                  <div className="w-full relative h-full flex items-end">
                    <div
                      className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg transition-all duration-300 hover:from-blue-600 hover:to-blue-500 cursor-pointer relative"
                      style={{
                        height: `${bar.height}%`,
                        minHeight: bar.amount > 0 ? "4px" : "0",
                      }}
                    >
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {vndFormatter.format(bar.amount)}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-gray-600 mt-2 truncate w-full text-center">
                    {bar.label}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
