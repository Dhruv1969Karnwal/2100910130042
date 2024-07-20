import express from "express";
import {
    getProduct,
  getAllDetails,
} from "../controllers/company.controller.js";

const router = express.Router();

router.post("/companies/:company/categories/:category/products/:productId", getProduct);
router.get("/companies/:company/categories/:category/products", getAllDetails);

export default router;