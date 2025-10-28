import React, { useEffect, useState } from "react";

export default function OrderItemCard({
  item,
  onQuantityChange,
  onPriceChange,
  onRemove,
}) {
  const [quantity, setQuantity] = useState(item.quantity);
  const [sellPrice, setSellPrice] = useState(
    item.sellPrice?.$numberDecimal || item.sellPrice
  );
  const [subtotal, setSubtotal] = useState(
    parseFloat(item.sellPrice?.$numberDecimal || 0) * item.quantity
  );

  const handleIncrease = () => {
    const newQty = quantity + 1;
    setQuantity(newQty);
    onQuantityChange?.(item.id, newQty);
  };

  const handleDecrease = () => {
    const newQty = Math.max(1, quantity - 1);
    setQuantity(newQty);
    onQuantityChange?.(item.id, newQty);
  };

  const handleRemove = () => {
    onRemove?.(item.id);
  };

  const handlePriceChange = (newPrice) => {
    setSellPrice(newPrice);
    onPriceChange?.(item.id, newPrice);
  };

  useEffect(() => {
    const price = parseFloat(sellPrice) || 0;
    const newSubtotal = price * quantity;
    setSubtotal(newSubtotal);
    setQuantity(item.quantity);
  }, [sellPrice, quantity, item]);

  return (
    <div className="flex justify-between px-5 py-3 items-center bg-white rounded-lg border-2 border-gray-300 hover:shadow-md hover:shadow-blue-300 hover:border-blue-400 h-16">
      <div className="justify-between items-center w-3/5 grid grid-cols-12 ">
        <button
          onClick={() => handleRemove(item.id)}
          className="col-span-1 flex justify-start hover:text-red-500"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
            />
          </svg>
        </button>
        <p className="col-span-3 truncate">{item.barcode}</p>
        <p className="col-span-7 truncate">{item.name}</p>
      </div>

      <div className="justify-between items-center grid grid-cols-12 gap-2 flex-1">
        <button onClick={handleDecrease} className="col-span-1 font-bold">
          −
        </button>
        <input
          type="number"
          className="col-span-2 text-center border-b-2 border-gray-300 focus:outline-none"
          value={quantity}
          min={1}
          max={item.stock}
          onChange={(e) => {
            let newQty = parseInt(e.target.value) || 1;
            newQty = Math.max(1, Math.min(newQty, item.stock));
            setQuantity(newQty);
            onQuantityChange?.(item.id, newQty);
          }}
        />

        <button onClick={handleIncrease} className="col-span-1 font-bold">
          +
        </button>
        <input
          className="col-span-4 flex justify-end border-b-2 border-gray-300 text-end focus:outline-none"
          value={sellPrice}
          onChange={(e) => {
            handlePriceChange(e.target.value);
          }}
        />
        <p className="col-span-4 flex justify-end font-semibold text-blue-700">
          {subtotal}
        </p>
      </div>
    </div>
  );
}
