import express from "express";
import { addToCart, decreaseQuantity, getCartByToken, removeFromCart } from "../controllers/cartController";
import { cartToken } from "../middlewares/cartToken";

const router = express.Router();

router.use(cartToken);

router.post('/', addToCart);
router.get('/', getCartByToken);
router.delete('/:id', removeFromCart);
router.patch('/:id', decreaseQuantity);

export default router;
