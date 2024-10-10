import { v2 as cloudinary } from "cloudinary";

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
  secure: true,
});

// Fungsi untuk mengunggah gambar ke Cloudinary
export const uploadImageToCloudinary = (imageFile: Express.Multer.File, folder: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: "image", folder }, // Tentukan folder
      (error, result) => {
        if (error) reject(error);
        else resolve((result as any).secure_url); // Kembalikan URL aman
      }
    );
    uploadStream.end(imageFile.buffer); // Kirim file buffer ke Cloudinary
  });
};
