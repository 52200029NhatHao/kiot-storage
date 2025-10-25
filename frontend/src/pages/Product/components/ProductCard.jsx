import React from "react";
import ProductService from "../../../services/ProductService";

const ProductCard = ({
  product,
  isPointed,
  onPoint,
  closeDetail,
  isChecked,
  productChecked,
  handleDeleteProduct,
  popUpAddModal,
}) => {
  const importPrice = parseFloat(product.importPrice.$numberDecimal);
  const sellPrice = parseFloat(product.sellPrice.$numberDecimal);
  const handleDelete = async () => {
    if (confirm("Bạn có chắc chắn muốn xóa sản phẩm này")) {
      try {
        const res = await ProductService.deleteProduct(product._id);
        console.log(res);
        alert("Xóa sản phẩm thành công");
      } catch (error) {
        alert("Lỗi khi xóa sản phẩm");
        console.log(error);
      } finally {
        handleDeleteProduct();
        closeDetail;
      }
    }
    return;
  };

  const updateClick = () => {
    popUpAddModal(product);
  };

  return (
    <>
      <tr
        onClick={isPointed ? closeDetail : onPoint}
        className="product-row shadow-lg h-16 rounded-lg hover:bg-green-200 cursor-pointer"
      >
        <td className="px-3 text-center">
          <label className="inline-flex cursor-pointer items-center space-x-2">
            <input
              type="checkbox"
              className="peer sr-only"
              checked={isChecked}
              onChange={() => productChecked(product)}
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
        </td>
        <td className="px-3 text-center">{product.barcode ?? ""}</td>

        <td className="">
          <div className="p-1 flex-shrink-0">
            <img
              src={
                product.image ??
                "https://cdn-app.kiotviet.vn/retailler/Content/img/default-product-img.jpg"
              }
              alt=""
              className="h-12 w-12 border overflow-clip"
            />
          </div>
        </td>
        <td className="px-3">{product.name}</td>
        <td className="px-3">
          {product.category ? <>{product.category.name}</> : "Chưa phân loại"}
        </td>
        <td className="px-3 text-right">{product.stock}</td>
        <td className="px-3 text-right">{sellPrice}</td>
        <td className="px-3 text-right">{importPrice}</td>
        <td className="px-3 text-center">{product.warning_stock}</td>
      </tr>
      <tr className={`${isPointed ? "" : "hidden"} detail-row`}>
        <td colSpan="10" className="p-6 border">
          <div className="pl-10 text-2xl font-bold mb-4">{product.name}</div>
          <div className="pl-10 flex flex-row gap-6">
            <div className="flex max-w-[30%] items-center">
              <img
                className="h-auto max-h-[200px] max-w-[200px] min-w-60 w-auto border rounded"
                src={
                  product.image ??
                  "https://cdn-app.kiotviet.vn/retailler/Content/img/default-product-img.jpg"
                }
                alt="Ảnh sản phẩm"
              />
            </div>
            <div className="flex w-full flex-col justify-between gap-2 text-base">
              <div className="flex flex-row items-center space-x-4">
                <div className="w-1/3 font-medium">Mã sản phẩm</div>
                <div>{product.barcode}</div>
              </div>
              <div className="flex flex-row items-center space-x-4">
                <div className="w-1/3 font-medium">Phân loại</div>
                <div>
                  {product.category ? product.category.name : "Chưa phân loại"}
                </div>
              </div>
              <div className="flex flex-row items-center space-x-4">
                <div className="w-1/3 font-medium">Giá vốn</div>
                <div> {importPrice}</div>
              </div>
              <div className="flex flex-row items-center space-x-4">
                <div className="w-1/3 font-medium">Giá bán</div>
                <div>{sellPrice}</div>
              </div>
              <div className="flex flex-row items-center space-x-4">
                <div className="w-1/3 font-medium">Tồn kho</div>
                <div>{product.stock}</div>
              </div>
              <div className="flex flex-row items-center space-x-4">
                <div className="w-1/3 font-medium">Số lượng tối thiểu</div>
                <div>{product.warning_stock}</div>
              </div>
            </div>
          </div>
          <div className="flex flex-row justify-end space-x-4 mt-4">
            <button
              onClick={updateClick}
              className="edit-btn rounded-md border-2 border-green-500 px-4 font-bold text-green-500 hover:bg-green-500 hover:text-white"
            >
              Cập nhật
            </button>
            <button className="rounded-md border-2 px-4 font-bold hover:bg-gray-500 hover:text-white">
              In tem mã
            </button>
            <button
              onClick={handleDelete}
              className="singleDeleteBtn rounded-md border-2 border-red-500 px-4 font-bold text-red-500 hover:bg-red-500 hover:text-white"
            >
              Xóa
            </button>
          </div>
        </td>
      </tr>
    </>
  );
};

export default ProductCard;
