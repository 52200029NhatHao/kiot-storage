import React, { useState, useRef, useEffect } from "react";
import Tab from "./Tab";
import { Link, useNavigate } from "react-router-dom";
import SuggestProduct from "../../Product/components/SuggestProduct";
import ProductService from "../../../services/ProductService";
import NotificationButton from "./NotificationButton";

const TabBar = ({
  orders,
  createOrder,
  activeOrderId,
  onSelectTab,
  closeTab,
  addOrderItem,
  refresh,
}) => {
  const [keyword, setKeyword] = useState("");
  const [products, setProducts] = useState([]);
  const [suggestedProducts, setSuggestedProducts] = useState([]);
  const suggestRef = useRef(null);
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await ProductService.getAllProducts();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [refresh]);

  useEffect(() => {
    const q = (keyword || "").trim().toLowerCase();
    if (!q || !Array.isArray(products)) {
      setSuggestedProducts([]);
      return;
    }
    const filtered = products
      .filter((p) => {
        const name = (p.name || "").toString().toLowerCase();
        const barcode = (p.barcode || "").toString().toLowerCase();
        return name.includes(q) || barcode.includes(q);
      })
      .slice(0, 8);
    setSuggestedProducts(filtered);
  }, [keyword, products, orders]);

  useEffect(() => {
    if (!activeOrderId) return;
    try {
      const el = document.getElementById(`tab-${activeOrderId}`);
      if (el && scrollRef.current) {
        el.scrollIntoView({
          behavior: "smooth",
          inline: "center",
          block: "nearest",
        });
      }
    } catch (error) {
      console.log(error);
    }
  }, [activeOrderId]);

  const handleSearchChange = (e) => {
    setKeyword(e.target.value);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      if (suggestedProducts.length > 0) {
        addOrderItem(suggestedProducts[0]);
        setKeyword("");
      }
    }
  };

  return (
    <div className="header grid grid-cols-10 space-x-3 bg-blue-500 px-2 pt-2 min-h-[50px]">
      <div className="col-span-7 space-x-1 flex flex-row ">
        <div className="flex pb-2 w-2/5 flex-shrink-0 relative">
          <input
            type="text"
            value={keyword}
            onChange={handleSearchChange}
            onKeyDown={handleSearchKeyDown}
            className="w-full rounded-md border-none bg-white pl-2"
            placeholder="Tìm sản phẩm"
            ref={suggestRef}
          />
          <SuggestProduct
            suggest={suggestedProducts}
            anchorRef={suggestRef}
            clearInput={() => setKeyword("")}
            onSelect={addOrderItem}
          />
        </div>
        <div
          ref={scrollRef}
          className="scrollbar hide-scrollbar flex flex-row space-x-1 overflow-x-scroll max-w-400"
        >
          {orders &&
            orders.map((o) => (
              <Tab
                key={"order" + o.id}
                elementId={`tab-${o.id}`}
                order={o}
                isActive={o.id === activeOrderId}
                selectTab={onSelectTab}
                closeTab={closeTab}
              />
            ))}
        </div>
        <div className="flex items-center">
          <button
            className="flex w-fit items-center justify-center rounded-full border-2 border-white text-white"
            onClick={createOrder}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="size-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="  flex-1 flex px-2 pb-2 space-x-3 justify-end col-span-3">
        <button
          onClick={() => navigate(`/products?reset=${Date.now()}`)}
          className="px-2 py-2 bg-white text-blue-400 rounded-md shadow-md w-fit flex border border-white font-bold hover:bg-gray-200 hover:border hover:border-gray-500"
        >
          Quản lý sản phẩm
        </button>
        <NotificationButton
          refresh={refresh}
          className="rounded-full p-2 bg-white text-blue-400  shadow-md w-fit flex border border-white font-bold hover:bg-gray-200 hover:border hover:border-gray-500"
        />
      </div>
    </div>
  );
};

export default TabBar;
