import express from "express";
import { cartToken } from "../middlewares/cartToken";
import { getAllOrders, getOrderById, createOrder, updateStatus } from "../controllers/orderController";
import { authenticateAdmin } from "../middlewares/authToken";

const router = express.Router();

router.post('/', cartToken, createOrder);
router.get('/', authenticateAdmin, getAllOrders);
router.get('/:id', authenticateAdmin, getOrderById);
router.patch('/:id', authenticateAdmin, updateStatus);

export default router;