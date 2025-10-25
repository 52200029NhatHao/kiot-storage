import React from "react";
import { useEffect } from "react";

export default function Tab({
  order,
  isActive,
  selectTab,
  closeTab,
  elementId,
}) {
  useEffect(() => {}, [order]);
  return (
    <div id={elementId} className="flex" onClick={() => selectTab(order.id)}>
      {isActive && (
        <div className={`flex ${isActive ? "bg-[rgb(235,237,239)]" : ""}`}>
          <div className="w-1 rounded-br-3xl bg-blue-500"></div>
        </div>
      )}
      <div
        className={`flex w-fit flex-row items-center justify-between space-x-2 rounded-t-md px-2 py-2 ${
          isActive
            ? "text-black bg-[rgb(235,237,239)]"
            : "text-white hover:bg-blue-600"
        }`}
      >
        <div className="pb-0.5 font-semibold whitespace-nowrap ">
          {order.name}
        </div>
        <button
          className={`flex items-center justify-center rounded-full border-2 border-transparent text-2xl
            hover:text-red-500  hover:border-red-500 `}
          onClick={(e) => {
            e.stopPropagation();
            closeTab(order.id);
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18 18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      {isActive && (
        <div className={`flex ${isActive ? "bg-[rgb(235,237,239)]" : ""}`}>
          <div className="w-1 rounded-bl-3xl bg-blue-500"></div>
        </div>
      )}
    </div>
  );
}
