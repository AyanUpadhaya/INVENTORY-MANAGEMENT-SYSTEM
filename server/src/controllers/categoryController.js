import Cateogry from "../models/Category.js";
import ApiError from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

//create category
export const createCategory = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  if (!name || !description) {
    throw new ApiError(400, "name and description is both required");
  }

  const result = await Cateogry.create({ name, description });
  res
    .status(201)
    .json(new ApiResponse(201, result, "Category created successfully"));
});

// export const getAllCategory = asyncHandler(async (req, res) => {
//   const { page = 1, limit = 10 } = req.query;

//   const skip = (parseInt(page) - 1) * parseInt(limit);

//   const categories = await Cateogry.find({})
//     .limit(parseInt(limit))
//     .skip(skip)
//     .select("-__v")
//     .exec();

//   const count = await Cateogry.countDocuments({});

//   const pagination = {
//     currentPage: parseInt(page),
//     totalPages: Math.ceil(count / parseInt(limit)),
//     totalDocs: count,
//   };

//   res
//     .status(200)
//     .json(
//       new ApiResponse(
//         200,
//         { categories, pagination },
//         "All category fetched successfully"
//       )
//     );
// });

export const getAllCategory = asyncHandler(async (req, res) => {
  const options = {
    page: parseInt(req.query.page) || 1,
    limit: parseInt(req.query.limit) || 10,
    sort: { createdAt: -1 },
    select: "-__v",
  };

  const result = await Cateogry.paginate({}, options); // First arg is query, second is options

  res
    .status(200)
    .json(new ApiResponse(200, result, "All category fetched successfully"));
});

export const updateCategory = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const updates = req.body;
  const hasEmptyValues = Object.values(updates).some((item) => item == "");
  if (hasEmptyValues) {
    throw new ApiError(400, "Empty values are not acceptable for updating");
  }

  //check if category exists
  const exists = await Category.findById(id);
  if (!exists) {
    throw new ApiError(404, "Category not found");
  }
  const category = await Cateogry.findByIdAndUpdate(id, updates, {
    new: true,
  });
  res
    .status(200)
    .json(new ApiResponse(200, category, "Category updated successfully"));
});

export const deleteCategory = asyncHandler(async (req, res) => {
  const id = req.params.id;
  //check if category exists
  const exists = await Category.findById(id);
  if (!exists) {
    throw new ApiError(404, "Category not found");
  }
  await Cateogry.findByIdAndDelete(id);
  res
    .status(200)
    .json(new ApiResponse(200, {}, "Category deleted successfully"));
});

export const singleCategory = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  //check if category exists
  const category = await Category.findById(id);
  if (!category) {
    throw new ApiError(404, "Category not found");
  }
  res
    .status(200)
    .json(new ApiResponse(200, category, "Category fetched successfully"));
});
