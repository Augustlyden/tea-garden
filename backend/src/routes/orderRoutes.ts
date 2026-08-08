import express from "express";
import { cartToken } from "../middlewares/cartToken";
import { getAllOrders, getOrderById, placeOrder } from "../controllers/orderController";

const router = express.Router();

router.post('/', cartToken, placeOrder);
router.get('/', getAllOrders);
router.get('/:id', getOrderById);

export default router;