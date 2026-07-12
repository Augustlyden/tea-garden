import express from "express";
import { createProduct, getAllProducts } from "../controllers/adminProductController";
import { upload } from "../middlewares/upload";

const router = express.Router();

router.post('/', upload.single('image'), createProduct);
router.get('/', getAllProducts);

export default router;