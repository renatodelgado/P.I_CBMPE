import axios from "axios";

const CLOUD_NAME = import.meta.env.CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.CLOUDINARY_UPLOAD_PRESET;

export async function uploadToCloudinary(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  const res = await axios.post(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    formData
  );

  return res.data.secure_url; // URL final hospedada
}
