import React from "react";
import OrderItemCard from "./OrderItemCard";

const OrderTable = ({ items, onRemove, onQuantityChange, onPriceChange }) => {
  return (
    <div className="w-full p-2 space-y-1">
      {items &&
        items.map((i) => (
          <OrderItemCard
            key={"item" + i.id}
            item={i}
            onRemove={onRemove}
            onQuantityChange={onQuantityChange}
            onPriceChange={onPriceChange}
          />
        ))}
    </div>
  );
};

export default OrderTable;
