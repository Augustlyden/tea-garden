import express from "express";
import { createProduct } from "../controllers/productController";
import { upload } from "../middlewares/upload";

const router = express.Router();

router.post('/', upload.single('image'), createProduct);

export default router;