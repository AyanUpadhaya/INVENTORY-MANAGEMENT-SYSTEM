import ApiError from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import Supplier from "../models/Supplier.js";

export const createSupplier = asyncHandler(async (req, res) => {
  const result = await Supplier.create(req.body);
  res
    .status(201)
    .json(new ApiResponse(201, result, "Supplier created successfully"));
});


export const getAllSupplier = asyncHandler(
  async (req, res) => {
    const result = await Supplier.find({})
      .sort({ createdAt: -1 })
      .select("-__v"); // First arg is query, second is options

    res
      .status(200)
      .json(new ApiResponse(200, result, "All supplier fetched successfully"));
  }
);
