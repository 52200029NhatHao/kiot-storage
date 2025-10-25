import React, { useState, useRef, useEffect } from "react";
import { uploadImageToCloudinary } from "../../../services/UploadService";
import CircularProgressBar from "../../../components/CircularProcessBar";
import CategoryService from "../../../services/CategoryService";
import ProductService from "../../../services/ProductService";

const AddProductModal = ({
  isModalOpen,
  popUpAddModal,
  handleAddProduct,
  product,
  closeModal,
}) => {
  const [isShowCateModal, setIsShowCateModal] = useState(false);
  const [preview, setPreview] = useState(null);
  const [uploadedUrl, setUploadedUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);
  const [cateName, setCateName] = useState("");

  const [formData, setFormData] = useState({
    category: "",
    barcode: "",
    name: "",
    warning_stock: 0,
    importPrice: "",
    sellPrice: "",
    stock: 0,
    unit: "Cái",
  });

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await CategoryService.getAllCategories();
      setCategories(data);
      setLoading(false);

      setFormData((prev) => {
        if (!product) {
          return { ...prev, category: data[0]?._id || "" };
        } else {
          const categoryId =
            product?.category?._id || product?.category || data[0]?._id || "";
          return { ...prev, category: categoryId };
        }
      });
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const parseNumberDecimal = (val) => {
    if (val == null || val === "") return "";
    if (typeof val === "object" && "$numberDecimal" in val) {
      return parseFloat(val.$numberDecimal) || "";
    }
    return parseFloat(val) || "";
  };

  const isEditing = Boolean(product && (product._id || product.id));

  useEffect(() => {
    if (isModalOpen) {
      fetchCategories();

      if (isEditing) {
        setFormData({
          category: product?.category?._id || product?.category || "",
          barcode: product?.barcode || "",
          name: product?.name || "",
          warning_stock: product?.warning_stock || 0,
          importPrice: parseNumberDecimal(product?.importPrice),
          sellPrice: parseNumberDecimal(product?.sellPrice),
          stock: product?.stock || 0,
          unit: product?.unit || "Cái",
        });

        setPreview(product?.image || null);
        setUploadedUrl(null);
      } else {
        setFormData((prev) => ({
          ...prev,
          barcode: "",
          name: "",
          warning_stock: 0,
          importPrice: "",
          sellPrice: "",
          stock: 0,
          unit: "Cái",
        }));
        setPreview(null);
        setUploadedUrl(null);
      }
    } else {
      setPreview(null);
      setUploadedUrl(null);
      setUploadProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = null;
    }
  }, [isModalOpen, product, isEditing]);

  const showCateModal = () => {
    setIsShowCateModal(!isShowCateModal);
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const url = await uploadImageToCloudinary(file, setUploadProgress);
      setUploadedUrl(url);
    } catch (err) {
      console.error("Upload error:", err);
      setPreview(null);
      setUploadedUrl(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setPreview(null);
    setUploadedUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = null;
  };

  const handleReset = () => {
    setFormData({
      barcode: "",
      name: "",
      warning_stock: 0,
      importPrice: "",
      sellPrice: "",
      stock: 0,
      unit: "Cái",
      category: "",
    });
    handleRemoveImage();
  };

  const cancelClick = () => {
    handleReset();
    if (typeof closeModal === "function") closeModal();
    else popUpAddModal && popUpAddModal();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();

    if (!cateName) {
      alert("Vui lòng nhập tên danh mục");
      return;
    }
    try {
      const res = await CategoryService.createCategory({ name: cateName });
      console.log("Category created:", res);
      alert("Thêm danh mục thành công");
    } catch (err) {
      alert("Lỗi khi thêm danh mục", err);
      console.log(err);
    } finally {
      showCateModal();
      setCateName("");
      fetchCategories();
    }
  };

  const toNumber = (val) => {
    const num = parseFloat(val);
    return Number.isNaN(num) ? 0 : num;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      formData.sellPrice === "" ||
      formData.importPrice === ""
    ) {
      alert("Vui lòng nhập tên và giá bán sản phẩm!");
      return;
    }
    if (parseFloat(formData.importPrice) > parseFloat(formData.sellPrice)) {
      alert("Giá bán phải lớn hơn giá nhập");
      return;
    }

    const dataToSend = {
      ...formData,
      importPrice: toNumber(formData.importPrice),
      sellPrice: toNumber(formData.sellPrice),
      image:
        uploadedUrl ||
        product?.image ||
        "https://cdn-app.kiotviet.vn/retailler/Content/img/default-product-img.jpg",
    };

    setIsSubmitting(true);

    try {
      if (isEditing) {
        const productId = product?._id || product?.id;
        if (!productId) {
          alert("Không xác định được product id. Không thể cập nhật.");
          console.error("Missing product id for update, product:", product);
          setIsSubmitting(false);
          return;
        }
        const res = await ProductService.updateProduct(productId, dataToSend);
        console.log("Product updated:", res);
        alert("Cập nhật sản phẩm thành công!");
      } else {
        const res = await ProductService.createProduct(dataToSend);
        console.log("Product created:", res);
        alert("Thêm sản phẩm thành công!");
      }

      handleReset();
      if (typeof closeModal === "function") closeModal();
      else popUpAddModal && popUpAddModal();
    } catch (err) {
      alert("Lỗi khi thêm/cập nhật sản phẩm");
      console.log(err);
    } finally {
      setIsSubmitting(false);
      handleAddProduct();
    }
  };

  return (
    <div className={`relative w-screen z-[100] ${isModalOpen ? "" : "hidden"}`}>
      <div className="absolute flex top-0 z-100 backdrop-brightness-50 lg:px-30  md:px-20 py-6 w-full justify-center ">
        <div className="flex w-[1000px] min-w-fit min-h-fit flex-col items-center justify-center rounded-2xl bg-white shadow-2xl">
          <div
            className={`fixed inset-0 backdrop-brightness-50 p-10 justify-center z-50 ${
              isShowCateModal ? "flex" : "hidden"
            }`}
          >
            <div className="bg-white rounded-lg w-1/3 p-6 shadow-xl relative h-fit">
              <div className="text-xl font-semibold mb-4 whitespace-nowrap">
                Thêm Danh Mục
              </div>
              <div className="flex items-center flex-row space-x-5">
                <label className="min-w-fit">Tên danh mục</label>
                <input
                  type="text"
                  name="cate-name"
                  onChange={(e) => {
                    setCateName(e.target.value);
                  }}
                  className="w-full border-b-2 border-gray-400 focus:border-b-4 focus:border-green-300 focus:outline-none"
                />
              </div>

              <button
                className="absolute top-0.5 right-0.5 px-1.5 flex items-center rounded-md text-gray-500 hover:text-red-500 text-xl font-bold"
                onClick={showCateModal}
              >
                ✕
              </button>
              <div className="flex items-center justify-end pt-5">
                <button
                  type="button"
                  onClick={handleCreateCategory}
                  className="rounded-md px-3 py-1 border-2 border-green-500 text-green-500 font-bold hover:bg-green-500 hover:text-white"
                >
                  Thêm
                </button>
              </div>
            </div>
          </div>
          <div className="flex h-16 w-full items-center rounded-t-2xl bg-blue-400 pl-10 text-2xl font-bold">
            {isEditing ? "Cập nhật sản phẩm" : "Thêm sản phẩm"}
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex w-full flex-col space-y-16 p-20"
          >
            <div className="flex w-full flex-col md:flex-row justify-between space-x-24">
              <div className="flex w-2/3 flex-col space-y-10">
                <div className="flex justify-between whitespace-nowrap">
                  <input type="hidden" />
                  <label className="">Mã vạch</label>
                  <input
                    className="w-3/4 border-b-2 border-gray-400 focus:border-green-300 focus:outline-none"
                    type="text"
                    name="barcode"
                    value={formData.barcode}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex justify-between whitespace-nowrap">
                  <label>Tên sản phẩm</label>
                  <input
                    className="w-3/4 border-b-2 border-gray-400  focus:border-green-300 focus:outline-none"
                    type="text"
                    name="name"
                    value={formData.name}
                    required
                    onChange={handleChange}
                  />
                </div>
                <div className="flex justify-between whitespace-nowrap">
                  <label>Số lượng tối thiểu</label>
                  <input
                    className="w-3/4 appearance-none border-b-2 border-gray-400 text-right focus:border-green-300 focus:outline-none"
                    type="number"
                    value={formData.warning_stock}
                    name="warning_stock"
                    required
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="flex w-1/3 flex-col space-y-10">
                <div className="flex justify-between">
                  <label>Giá vốn</label>
                  <input
                    className="border-b-2 appearance-none border-gray-400 text-right focus:border-green-300 focus:outline-none"
                    type="number"
                    name="importPrice"
                    value={formData.importPrice}
                    maxLength="16"
                    required
                    onChange={handleChange}
                  />
                </div>
                <div className="flex justify-between">
                  <label>Giá bán</label>
                  <input
                    className="border-b-2 appearance-none border-gray-400 text-right  focus:border-green-300 focus:outline-none"
                    type="number"
                    name="sellPrice"
                    maxLength="16"
                    value={formData.sellPrice}
                    required
                    onChange={handleChange}
                  />
                </div>
                <div className="flex justify-between">
                  <label>Số lượng</label>
                  <input
                    className="border-b-2 appearance-none border-gray-400 text-right focus:border-green-300 focus:outline-none"
                    type="number"
                    name="stock"
                    maxLength="16"
                    value={formData.stock}
                    required
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-row items-center justify-between space-x-10">
              <div className="flex flex-row items-center justify-between space-x-10">
                <div className="min-w-fit">
                  <div>Thêm hình ảnh</div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />

                  <div className="relative size-28">
                    <img
                      onClick={handleImageClick}
                      src={
                        preview ||
                        "https://cdn-app.kiotviet.vn/retailler/Content/img/default-product-img.jpg"
                      }
                      alt="preview"
                      className={`size-28 rounded-sm border-2 border-dashed border-gray-400 cursor-pointer hover:opacity-80 ${
                        isUploading ? "opacity-70" : ""
                      }`}
                    />

                    {isUploading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-white/60 rounded-sm">
                        <CircularProgressBar progress={uploadProgress} />
                      </div>
                    )}

                    {preview && !isUploading && (
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute right-1 top-1 px-1.5 rounded-sm font-bold bg-red-500 text-white w-fit h-fit border-2 border-red-700 hover:bg-red-700"
                      >
                        X
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg flex w-2/5 items-center justify-between space-x-3">
                <div className="min-w-fit">Danh mục</div>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="bg w-full border-b-2 p-2 focus:border-b-4 focus:border-b-green-300 focus:outline-none"
                >
                  {isLoading && <option>Loading...</option>}
                  {categories &&
                    categories.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                </select>

                <button
                  type="button"
                  className="font-bold flex justify-center items-center text-2xl rounded-xl min-h-fit w-fit"
                  onClick={showCateModal}
                >
                  +
                </button>
              </div>
              <div className="flex w-2/5 items-center justify-center space-x-3">
                <div className="min-w-fit">Đơn vị</div>
                <select
                  className="w-full border-b-2 p-2 focus:border-b-4 focus:border-b-green-300 focus:outline-none"
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                >
                  <option value="Bịch">Bịch</option>
                  <option value="Cái">Cái</option>
                  <option value="Cây">Cây</option>
                  <option value="Cuộn">Cuộn</option>
                  <option value="Ký">Ký</option>
                  <option value="Lon">Lon</option>
                  <option value="Mét">Mét</option>
                  <option value="Miếng">Miếng</option>
                  <option value="100 Gram">100 Gram</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="submit"
                className="rounded-md border-2 border-green-500 px-10 py-2 font-bold text-green-500 hover:bg-green-500 hover:text-white"
              >
                Lưu
              </button>
              <button
                type="button"
                className="rounded-md border-2 border-red-500 px-10 py-2 font-bold text-red-500 hover:bg-red-500 hover:text-white"
                onClick={cancelClick}
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProductModal;
