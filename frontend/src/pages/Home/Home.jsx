import React, { useState } from "react";

import OrderDetail from "./components/OrderDetail";
import OrderTable from "./components/OrderTable";
import TabBar from "./components/TabBar";
import { useEffect } from "react";

export default function Home() {
  const [notificationRefresh, setNotificationRefresh] = useState(0);

  const createUniqueId = () => Date.now() + Math.random();

  const [orders, setOrders] = useState([
    {
      id: 1,
      items: [],
      name: "Hóa đơn 1",
      discount: 0,
    },
  ]);

  const [activeOrderId, setActiveOrderId] = useState(orders[0].id);

  const activeOrder = orders.find((t) => t.id === activeOrderId);
  const nextOrderNumber =
    parseFloat(orders[orders.length - 1].name.split(" ")[2]) + 1;

  const createOrder = () => {
    if (orders.length >= 10) {
      alert("Đã đạt số lượng hóa đơn tối đa (10). Vui lòng đóng bớt hóa đơn.");
      return;
    }

    const newOrder = {
      id: createUniqueId(),
      items: [],
      name: `Hóa đơn ${nextOrderNumber}`,
      discount: 0,
    };

    setOrders([...orders, newOrder]);

    setActiveOrderId(newOrder.id);
  };

  const closeTab = (orderId) => {
    if (orders.length === 1) return;
    const newOrders = orders.filter((t) => t.id !== orderId);
    setOrders(newOrders);
    if (activeOrderId === orderId) {
      setActiveOrderId(newOrders[newOrders.length - 1].id);
    }
  };

  const addOrderItem = (product) => {
    if (product.stock === 0) {
      alert("Sản phẩm hết hàng");
      return;
    }
    setOrders(
      orders.map((order) => {
        if (order.id !== activeOrderId) return order;

        const existingItem = order.items.find(
          (item) => item.id === product._id
        );
        if (existingItem) {
          if (existingItem.quantity >= product.stock) {
            alert("Không đủ tồn kho cho sản phẩm này.");
            return order;
          }
          return {
            ...order,
            items: order.items.map((item) =>
              item.id === product._id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          };
        }

        return {
          ...order,
          items: [
            ...order.items,
            {
              id: product._id,
              barcode: product.barcode,
              name: product.name,
              sellPrice: product.sellPrice,
              stock: product.stock,
              quantity: 1,
            },
          ],
        };
      })
    );
  };

  const updateOrderItemQuantity = (productId, quantity) => {
    setOrders(
      orders.map((order) => {
        if (order.id !== activeOrderId) return order;

        const existingItem = order.items.find((item) => item.id === productId);
        if (existingItem) {
          if (
            existingItem.quantity >= existingItem.stock &&
            quantity > existingItem.quantity
          ) {
            alert("Không đủ tồn kho cho sản phẩm này.");
            return order;
          }
        }

        return {
          ...order,
          items: order.items.map((item) =>
            item.id === productId ? { ...item, quantity } : item
          ),
        };
      })
    );
  };

  const updateOrderItemPrice = (productId, price) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === activeOrderId
          ? {
              ...order,
              items: order.items.map((item) =>
                item.id === productId ? { ...item, sellPrice: price } : item
              ),
            }
          : order
      )
    );
  };

  const handleUpdateOrder = (updatedOrder) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === updatedOrder.id ? { ...order, ...updatedOrder } : order
      )
    );
  };

  const deleteOrderItem = (productId) => {
    setOrders(
      orders.map((order) => {
        if (order.id !== activeOrderId) return order;
        return {
          ...order,
          items: order.items.filter((item) => item.id !== productId),
        };
      })
    );
  };

  const submitOrder = () => {
    const checkoutOrder = orders.find((order) => order.id === activeOrderId);
    if (!checkoutOrder) return;
    const data = checkoutOrder ? { ...checkoutOrder } : null;
    console.log("Submitting order:", data);
  };

  useEffect(() => {}, [orders, activeOrderId]);
  return (
    <div className="flex flex-col h-screen bg-[rgb(235,237,239)]">
      <TabBar
        orders={orders}
        createOrder={createOrder}
        activeOrderId={activeOrderId}
        onSelectTab={setActiveOrderId}
        closeTab={closeTab}
        addOrderItem={addOrderItem}
        refresh={notificationRefresh}
      />

      <main className="flex-1 flex overflow-hidden">
        <div className="grid grid-cols-10 w-full space-x-3 p-2">
          {orders.length > 0 && activeOrder ? (
            <div className="col-span-7 h-full overflow-y-auto custom-scrollbar pb-2">
              <OrderTable
                items={activeOrder.items}
                onQuantityChange={updateOrderItemQuantity}
                onPriceChange={updateOrderItemPrice}
                onRemove={deleteOrderItem}
              />
            </div>
          ) : (
            <div className="col-span-7 h-full flex items-center justify-center text-gray-500">
              Không có hóa đơn nào. Vui lòng tạo hóa đơn mới.
            </div>
          )}
          <div className="col-span-3 h-full overflow-y-auto p-2">
            <OrderDetail
              order={activeOrder}
              submitOrder={submitOrder}
              onUpdateOrder={handleUpdateOrder}
              refresh={setNotificationRefresh}
            />
          </div>
        </div>
      </main>

      <footer className="h-12 bg-blue-700 text-white flex items-center justify-center"></footer>
    </div>
  );
}
