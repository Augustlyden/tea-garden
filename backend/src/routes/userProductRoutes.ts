import express from "express";
import { getAllProductsUser, getProductByIdUser, userSearch } from "../controllers/userProductController";

const router = express.Router();

router.get('/', getAllProductsUser);
router.get('/search', userSearch);
router.get('/:id', getProductByIdUser);

export default router;