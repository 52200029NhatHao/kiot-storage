import React, { useState, useEffect } from "react";
import NotificationService from "../../../services/NotificationService";
import Popup from "./Popup";

const NotificationButton = ({ className = "", refresh }) => {
  const [notifications, setNotifications] = useState([]);

  const unreadCount = notifications.filter((n) => n.status === "unread").length;

  useEffect(() => {
    const fetchNotification = async () => {
      try {
        const data = await NotificationService.getAll();
        setNotifications(data);
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    };
    fetchNotification();
  }, [refresh]);

  const handleClickNotification = async (id) => {
    try {
      await NotificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, status: "read" } : n))
      );
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  return (
    <Popup
      hideButton={false}
      buttonLabel={
        <div className={`relative ${className}`}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
            />
          </svg>
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          )}
        </div>
      }
    >
      <div className="p-2 max-h-80 overflow-y-auto custom-scrollbar min-w-[400px] flex flex-col-reverse">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-12 h-12 mb-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0 1 18 14.158V11a6 6 0 1 0-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 1 1-6 0v-1m6 0H9"
              />
            </svg>
            <span className="text-sm">Bạn chưa có thông báo nào</span>
          </div>
        ) : (
          [...notifications]
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .map((n) => (
              <div
                key={n._id}
                className={`p-3 mb-2 rounded cursor-pointer transition shadow-sm ${
                  n.status === "unread" ? "bg-blue-50" : "bg-gray-50"
                } hover:bg-gray-100`}
                onClick={() => handleClickNotification(n._id)}
              >
                <div className="font-semibold text-gray-800">{n.message}</div>
                {n.items.length > 0 && (
                  <div className="mt-1 ml-3 text-sm text-gray-700 space-y-1">
                    {n.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between">
                        <span>{item.name}</span>
                        <span className="text-gray-500">
                          Còn lại: {item.stock}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
        )}
      </div>
    </Popup>
  );
};

export default NotificationButton;
