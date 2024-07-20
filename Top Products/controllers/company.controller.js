import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const Company = []; // model for company that store products

const getProduct = asyncHandler(async (req, res) => {
  const { company, category, productId } = req.params;

  let query = {};

  query.companyName = { $regex: company.toLowerCase(), $options: "i" };
  query.categoryName = { $regex: category.toLowerCase(), $options: "i" };
  //   query.productName = { $regex: category.toLowerCase(), $options: "i" };
  let companies = await Company.find(query);
  let product = await companies.find({id: productId});
  return res.status(200).json({
    product
  })
});

const getAllDetails = asyncHandler(async (req, res) => {
  const { company, category } = req.params;
  const { _sort, page, perPage, minPrice, maxPrice } = req.query;

  const parsedPage = parseInt(page, 10) || 1;
  const parsedLimit = parseInt(perPage, 10) || 10;

  let query = {};

  query.companyName = { $regex: company.toLowerCase(), $options: "i" };
  query.categoryName = { $regex: category.toLowerCase(), $options: "i" };

  if (minPrice && maxPrice) {
    query["price"] = { $gte: parseInt(minPrice), $lte: parseInt(maxPrice) };
  } else if (minPrice) {
    query["price"] = { $gte: parseInt(minPrice) };
  } else if (maxPrice) {
    query["price"] = { $lte: parseInt(maxPrice) };
  }

  let companies;

  if (_sort) {
    companies = await Company.aggregate([
      { $match: query },
      { $sort: { [_sort]: 1 } },
      { $skip: (parsedPage - 1) * parsedLimit },
      { $limit: parsedLimit },
    ]);
  } else {
    // Normal find with pagination
    companies = await Company.find(query)
      .skip((parsedPage - 1) * parsedLimit)
      .limit(parsedLimit);
  }

  const totalCount = await Company.countDocuments(query);
  const totalPages = Math.ceil(totalCount / parsedLimit);

  return res.status(200).json({
    status: 200,
    data: companies,
    message: "Companies fetched successfully",
    pagination: {
      totalItems: totalCount,
      totalPages,
      currentPage: parsedPage,
      pageSize: parsedLimit,
    },
  });
});

export { getProduct, getAllDetails };
