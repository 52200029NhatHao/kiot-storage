import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";

const SuggestProduct = ({ suggest = [], onSelect, anchorRef, clearInput }) => {
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });

  useEffect(() => {
    if (anchorRef?.current) {
      const rect = anchorRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  }, [anchorRef, suggest]);

  if (!suggest || suggest.length === 0) return null;

  return createPortal(
    <div
      style={{
        position: "absolute",
        top: position.top,
        left: position.left,
        width: position.width,
        zIndex: 1000,
      }}
      className="border bg-white shadow-lg max-h-90 overflow-y-auto rounded-md cursor-pointer"
    >
      {suggest.map((e) => (
        <div
          key={e._id}
          onClick={() => {
            onSelect(e);
            clearInput();
          }}
          className="flex min-h-24 flex-row space-x-2 justify-center px-2 w-full bg-gray-50 hover:bg-blue-200"
        >
          <div className="flex items-center justify-center w-1/3">
            <img
              className="border h-16 w-16 object-cover"
              src={
                e.image ||
                "https://cdn-app.kiotviet.vn/retailler/Content/img/default-product-img.jpg"
              }
              alt={e.name || "product"}
            />
          </div>

          <div className="flex flex-col w-full justify-center">
            <div className="font-bold text-md truncate">{e.name}</div>
            <div>Mã SP: {e.barcode}</div>
            <div className="flex flex-row space-x-4">
              <div>Giá bán: {e.sellPrice?.$numberDecimal ?? e.sellPrice}</div>
              <div className="font-bold">Tồn kho: {e.stock}</div>
            </div>
          </div>
        </div>
      ))}
    </div>,
    document.body
  );
};

export default SuggestProduct;
