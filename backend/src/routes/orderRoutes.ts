import express from "express";
import { cartToken } from "../middlewares/cartToken";
import { getAllOrders, getOrderById, createOrder, updateStatus } from "../controllers/orderController";

const router = express.Router();

router.post('/', cartToken, createOrder);
router.get('/', getAllOrders);
router.get('/:id', getOrderById);
router.patch('/:id', updateStatus);

export default router;