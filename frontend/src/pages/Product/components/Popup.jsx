import { createPortal } from "react-dom";
import React, { useState, useEffect, useRef } from "react";

const Popup = ({ children, buttonLabel = "Thao tác", hideButton = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const btnRef = useRef(null);
  const popupRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        btnRef.current &&
        !btnRef.current.contains(e.target) &&
        popupRef.current &&
        !popupRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleClick = () => {
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setPos({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
      });
      setIsOpen((prev) => !prev);
    }
  };

  const enhancedChildren = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { closePopup: () => setIsOpen(false) });
    }
    return child;
  });

  if (hideButton) return null;

  return (
    <>
      <button
        ref={btnRef}
        onClick={handleClick}
        className="whitespace-nowrap bg-white rounded-md px-2 py-2 border-2 border-blue-400 text-blue-400 hover:text-white font-bold hover:bg-blue-400"
      >
        {buttonLabel}
      </button>

      {isOpen &&
        createPortal(
          <div
            ref={popupRef}
            className="absolute bg-white shadow-2xl rounded-md z-[1000] min-w-[150px]"
            style={{ top: pos.top, left: pos.left }}
          >
            {enhancedChildren}
          </div>,
          document.body
        )}
    </>
  );
};

export default Popup;
