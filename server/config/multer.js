// middlewares/upload.js
import multer from "multer";

const storage = multer.memoryStorage();

function fileFilter(req, file, cb) {
  const allowedMimes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
  if (!allowedMimes.includes(file.mimetype)) {
    cb(new Error("Invalid file type. Only JPEG, PNG, JPG, and WEBP allowed."), false);
  } else {
    cb(null, true);
  }
}

const upload = multer({ storage, fileFilter });

export default upload;
