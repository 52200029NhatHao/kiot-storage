import React, { useState, useEffect, useRef } from "react";
import emptyImg from "../../../assets/empty.jpg";
import ProductCard from "./ProductCard";
import SuggestProduct from "./SuggestProduct";
import Popup from "./Popup";
import CategoryService from "../../../services/CategoryService";
import ProductService from "../../../services/ProductService";

const ProductTable = ({
  popUpAddModal,
  products = [],
  handleDeleteProduct,
}) => {
  const [keyword, setKeyword] = useState("");
  const [pointingProduct, setPointingProduct] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [suggestedProducts, setSuggestedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("0");

  const suggestRef = useRef(null);

  const handleDeleteManyProducts = async () => {
    if (!confirm("Bạn có chắc muốn xóa các sản phẩm này?")) return;
    if (selectedProducts.length > 0) {
      const ids = selectedProducts.map((p) => p._id);
      console.log(ids);
      try {
        await ProductService.deleteManyProducts(ids);
        setSelectedProducts([]);
        handleDeleteProduct();
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await CategoryService.getAllCategories();
        setCategories(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const q = (keyword || "").trim().toLowerCase();
    if (!q) {
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
  }, [keyword, products]);

  useEffect(() => {}, [selectedProducts]);

  const displayedProducts = React.useMemo(() => {
    if (!selectedCategory || selectedCategory === "0") return products;

    const getCategoryIdFromProduct = (p) => {
      if (!p) return "";
      if (typeof p.category === "string") return p.category;
      if (p.category && typeof p.category === "object")
        return p.category._id || p.category.id || p.category.name || "";
      return p.category_name || p.categoryName || "";
    };

    return products.filter((p) => {
      const prodCat = getCategoryIdFromProduct(p);
      return String(prodCat) === String(selectedCategory);
    });
  }, [products, selectedCategory]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (suggestRef.current && !suggestRef.current.contains(e.target)) {
        setSuggestedProducts([]);
      }
    };
    const handleEsc = (e) => {
      if (e.key === "Escape") setSuggestedProducts([]);
    };

    document.addEventListener("click", handleClickOutside);
    document.addEventListener("touchend", handleClickOutside);
    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("touchend", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  const closeDetail = () => {
    setPointingProduct(null);
  };

  const productChecked = (product) => {
    setSelectedProducts((prev) => {
      if (prev.some((p) => p._id === product._id)) {
        return prev.filter((p) => p._id !== product._id);
      } else {
        return [...prev, product];
      }
    });
  };

  const selectAll = () => {
    selectedProducts.length !== displayedProducts.length
      ? setSelectedProducts(displayedProducts)
      : setSelectedProducts([]);
  };

  const handleSearchChange = (e) => {
    setKeyword(e.target.value);
  };

  const handleSuggestClick = (p) => {
    console.log("suggest clicked:", p);
    popUpAddModal && popUpAddModal(p);
    setSuggestedProducts([]);
    setKeyword("");
  };

  return (
    <>
      <div className=" flex md:flex-row flex-col md:justify-between justify-center items-center space-y-3 md:space-y-0 bg-[rgb(235,237,239)] md:space-x-5 sticky top-0 z-10 mb-2 pb-2">
        <div className="flex relative flex-row justify-start items-center space-x-3 w-full ">
          <input
            className=" bg-white focus:outline-none p-2 rounded-md border-2 w-full border-gray-400 md:w-96  focus:border-blue-400 focus:bg-blue-100"
            type="text"
            value={keyword}
            onChange={handleSearchChange}
            ref={suggestRef}
            placeholder="Tìm kiếm sản phẩm"
          />

          {keyword !== "" && (
            <a
              onClick={() => {
                setKeyword("");
              }}
              className="text-blue-400 rounded-full hover:bg-blue-400 hover:text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            </a>
          )}
          <div className="pl-10">
            <SuggestProduct
              suggest={suggestedProducts}
              anchorRef={suggestRef}
              onSelect={handleSuggestClick}
            />
          </div>
        </div>
        <div className="flex flex-row justify-end md:justify-center w-full md:w-fit items-center space-x-3 min-w-fit">
          <div className="flex items-center space-x-2">
            <div className={`${selectedProducts.length > 0 ? "" : "hidden"}`}>
              <div className="flex flex-col rounded-md bg-white border-2 border-red-500 hover:bg-red-500">
                <button
                  className="px-4 py-2 text-left text-red-500 font-bold hover:text-white"
                  onClick={async () => {
                    await handleDeleteManyProducts();
                  }}
                >
                  Xóa sản phẩm
                </button>
              </div>
            </div>
            <button
              onClick={() => popUpAddModal && popUpAddModal(null)}
              className="bg-white flex-shrink-0 px-2 py-2 border-2 border-blue-400 rounded-md text-blue-400 font-bold hover:bg-blue-400 hover:text-white"
            >
              Thêm SP
            </button>
          </div>
          <select
            className="whitespace-nowrap bg-white focus:outline-none p-2 rounded-md border-2 border-gray-400 focus:border-blue-400 focus:bg-blue-100"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="0">Toàn bộ</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="max-h-[500px] overflow-y-auto">
        <table className="table w-full min-w-fit bg-white border-separate border-spacing-y-0">
          <thead className="sticky top-0 z-[10]">
            <tr className="text-slate-800 border bg-blue-300 shadow-lg h-16 rounded-xl">
              <th className="">
                <label className="inline-flex cursor-pointer  items-center space-x-2">
                  <input
                    type="checkbox"
                    className="peer sr-only"
                    name="selectAll"
                    checked={
                      displayedProducts.length > 0 &&
                      selectedProducts.length === displayedProducts.length
                    }
                    onChange={selectAll}
                  />
                  <div className="flex h-5 w-5 items-center justify-center rounded border-2 border-black peer-checked:border-blue-500 peer-checked:bg-blue-500 text-transparent font-bold peer-checked:text-white">
                    <svg
                      className="h-3 w-3 "
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="4"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                </label>
              </th>
              <th className="w-1/8 px-3 whitespace-nowrap">Mã vạch</th>
              <th className="w-1/8 px-3 whitespace-nowrap min-w-16"></th>
              <th className="w-4/8 px-3 whitespace-nowrap text-left">
                Tên sản phẩm
              </th>
              <th className="w-1/8 px-3 whitespace-nowrap text-left">
                Phân loại
              </th>
              <th className="w-1/8 px-3 whitespace-nowrap text-right">
                Số lượng
              </th>
              <th className="w-1/8 px-3 whitespace-nowrap text-right">
                Giá bán
              </th>
              <th className="w-1/8 px-3 whitespace-nowrap text-right">
                Giá vốn
              </th>
              <th className="w-1/8 px-3 whitespace-nowrap ">
                Số lượng tối thiểu
              </th>
            </tr>
          </thead>
          <tbody className="space-y-4" id="productsBlock">
            {displayedProducts.length === 0 ? (
              <tr>
                <td colSpan="10" className="p-6 text-center">
                  <div className="flex flex-col justify-center items-center space-y-4">
                    <div className="text-2xl font-bold text-blue-500">
                      Không tìm thấy sản phẩm
                    </div>
                    <img className="size-40" src={emptyImg} alt="empty.png" />
                    <button
                      onClick={() => {
                        setSelectedCategory("0");
                      }}
                      className="bg-blue-400 px-4 py-2 text-white font-bold hover:bg-blue-500 flex w-fit justify-center items-center rounded-md"
                    >
                      Quay về trang chủ
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              displayedProducts.map((p) => (
                <ProductCard
                  key={p._id}
                  product={p}
                  isPointed={pointingProduct?._id === p._id}
                  onPoint={() => setPointingProduct(p)}
                  closeDetail={closeDetail}
                  isChecked={selectedProducts.some((sp) => sp._id === p._id)}
                  productChecked={productChecked}
                  handleDeleteProduct={handleDeleteProduct}
                  popUpAddModal={popUpAddModal}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ProductTable;
