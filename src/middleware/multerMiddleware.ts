import multer from 'multer';

// Gunakan penyimpanan memori agar file tidak disimpan di disk lokal
const storage = multer.memoryStorage();

export const upload = multer({ storage });
