import express from "express";
import { addToCart, getCartByToken } from "../controllers/cartController";
import { cartToken } from "../middlewares/cartToken";

const router = express.Router();

router.use(cartToken);

router.post('/', addToCart);
router.get('/', getCartByToken);

export default router;
