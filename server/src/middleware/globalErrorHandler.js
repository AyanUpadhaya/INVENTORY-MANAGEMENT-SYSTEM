import ApiError from "../utils/ApiError.js";
import dotenv from "dotenv";
dotenv.config();

const globalErrorHandler = (err, req, res, next) => {
  let error = err;
  

  // ✅ Mongoose invalid ObjectId
  if (err.name === "CastError") {
    error = new ApiError(400, `Invalid ${err.path}`);
  }

  // If error is NOT an ApiError, convert it to one
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500;
    const message =
      error.message || "Something went wrong. Please try again later.";

    error = new ApiError(statusCode, message, false, err.stack);
  }

  const { statusCode, message } = error;

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && {
      stack: error.stack,
    }),
  });
};

export default globalErrorHandler;
