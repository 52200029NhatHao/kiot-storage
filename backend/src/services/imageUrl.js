import axios from "axios";
import FormData from "form-data";
import dotenv from "dotenv";

dotenv.config();

const uploadImage = async (fileBuffer, fileName) => {
  const accessToken = process.env.IMGBB_API_KEY;
  const IMGBB_UPLOAD_URL = "https://api.imgbb.com/1/upload";

  const formData = new FormData();
  formData.append("key", accessToken);
  formData.append("image", fileBuffer.toString("base64"));

  try {
    const res = await axios.post(IMGBB_UPLOAD_URL, formData, {
      headers: formData.getHeaders(),
    });
    if (res.data && res.data.data && res.data.data.url) {
      return res.data.data.url;
    } else {
      throw new Error("ImgBB res không hợp lệ");
    }
  } catch (err) {
    console.error("Upload to ImgBB failed:", err.message);
    throw new Error("Upload ảnh thất bại");
  }
};

export default uploadImage;
