import express from "express";
import { getAllProductsUser, getProductByIdUser } from "../controllers/userProductController";

const router = express.Router();

router.get('/', getAllProductsUser);
router.get('/:id', getProductByIdUser);

export default router;