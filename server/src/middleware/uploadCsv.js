import multer from "multer";

// Use memory storage (files stored in RAM as Buffer)
const storage = multer.memoryStorage();

// Optional: file filter to allow only CSV files
const csvFileFilter = (req, file, cb) => {
  if (
    file.mimetype === "text/csv" ||
    file.mimetype === "application/vnd.ms-excel"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only CSV files are allowed"), false);
  }
};

// Multer instance
export const uploadCsv = multer({
  storage,
  fileFilter: csvFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit (adjust if needed)
  },
});


