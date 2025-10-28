import { createPortal } from "react-dom";
import React, { useState, useEffect, useRef } from "react";

const Popup = ({
  children,
  buttonLabel = "Thao tác",
  hideButton = false,
  buttonClassName = "",
}) => {
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

      const popupWidth = popupRef.current?.offsetWidth || 200;
      let left = rect.left + window.scrollX;
      const rightEdge = left + popupWidth;

      if (rightEdge > window.innerWidth - 8) {
        left = window.innerWidth - popupWidth - 210;
      }

      setPos({
        top: rect.bottom + window.scrollY + 8,
        left,
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
        className={`whitespace-nowrap ${buttonClassName}`}
      >
        {buttonLabel}
      </button>

      {isOpen &&
        createPortal(
          <div
            ref={popupRef}
            className="absolute bg-white shadow-2xl rounded-md z-[1000] min-w-[200px]"
            style={{
              top: pos.top,
              left: pos.left,
            }}
          >
            {enhancedChildren}
          </div>,
          document.body
        )}
    </>
  );
};

export default Popup;
