import express from "express";
import { 
  createProduct, 
  deleteProduct, 
  getAllProductsAdmin, 
  getProductByIdAdmin, 
  importProducts, 
  indexProductsToAlgolia, 
  recieveImage, 
  updateProduct 
} from "../controllers/adminProductController";
import { authenticateAdmin } from "../middlewares/authToken";

const router = express.Router();

router.use(authenticateAdmin);

router.post('/', recieveImage, createProduct);
router.get('/', getAllProductsAdmin);
router.get('/:id', getProductByIdAdmin);
router.patch('/:id', recieveImage, updateProduct);
router.delete('/:id', deleteProduct);
router.post('/import/:format', importProducts);
router.post('/search/index', indexProductsToAlgolia);

export default router;