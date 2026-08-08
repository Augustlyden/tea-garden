import express from "express";
import { cartToken } from "../middlewares/cartToken";
import { getAllOrders, placeOrder } from "../controllers/orderController";

const router = express.Router();

router.post('/', cartToken, placeOrder);
router.get('/', getAllOrders);

export default router;