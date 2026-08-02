import express from "express";
import { 
  createProduct, 
  deleteProduct, 
  getAllProductsAdmin, 
  getProductByIdAdmin, 
  updateProduct 
} from "../controllers/adminProductController";
import { upload } from "../middlewares/upload";

const router = express.Router();

router.post('/', upload.single('image'), createProduct);
router.get('/', getAllProductsAdmin);
router.get('/:id', getProductByIdAdmin);
router.patch('/:id', upload.single('image'), updateProduct);
router.delete('/:id', deleteProduct);

export default router;