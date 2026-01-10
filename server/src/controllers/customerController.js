import Customer from "../models/Customer.js";
import ApiError from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createCustomer = asyncHandler(async (req, res) => {
  const { name, email, phone, shipping_address, billing_address } = req.body;

  if (!name || !email || !phone) {
    throw new ApiError(400, "name, email and phone are required");
  }

  // indexed field usage (email / phone)
  const existingCustomer = await Customer.findOne({
    $or: [{ email }, { phone }],
  });

  if (existingCustomer) {
    throw new ApiError(409, "Customer already exists with this email or phone");
  }

  const customer = await Customer.create({
    name,
    email,
    phone,
    shipping_address,
    billing_address,
  });

  res
    .status(201)
    .json(new ApiResponse(201, customer, "Customer created successfully"));
});


export const getAllCustomers = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const customers = await Customer.find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Customer.countDocuments();

  res.status(200).json(
    new ApiResponse(200, {
      total,
      page,
      limit,
      customers,
    }, "Customers fetched successfully")
  );
});

export const getCustomerById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const customer = await Customer.findById(id);

  if (!customer) {
    throw new ApiError(404, "Customer not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, customer, "Customer fetched successfully"));
});


export const getCustomerByEmailOrPhone = asyncHandler(async (req, res) => {
  const { email, phone } = req.query;

  if (!email && !phone) {
    throw new ApiError(400, "email or phone is required");
  }

  const customer = await Customer.findOne({
    $or: [{ email }, { phone }],
  });

  if (!customer) {
    throw new ApiError(404, "Customer not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, customer, "Customer fetched successfully"));
});


export const updateCustomer = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const customer = await Customer.findById(id);

  if (!customer) {
    throw new ApiError(404, "Customer not found");
  }

  const updatedCustomer = await Customer.findByIdAndUpdate(
    id,
    req.body,
    { new: true, runValidators: true }
  );

  res
    .status(200)
    .json(new ApiResponse(200, updatedCustomer, "Customer updated successfully"));
});


export const deleteCustomer = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const customer = await Customer.findById(id);

  if (!customer) {
    throw new ApiError(404, "Customer not found");
  }

  await customer.deleteOne();

  res
    .status(200)
    .json(new ApiResponse(200, null, "Customer deleted successfully"));
});