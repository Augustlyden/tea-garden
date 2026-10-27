import express from "express";
import { cartToken } from "../middlewares/cartToken";
import { getAllOrders, getOrderById, createOrder, updateStatus, getStatusHistoryById, getOrderByStripeSessionId } from "../controllers/orderController";
import { authenticateAdmin } from "../middlewares/authToken";

const router = express.Router();

router.post('/', cartToken, createOrder);
router.get('/session/:sessionId', getOrderByStripeSessionId);
router.get('/', authenticateAdmin, getAllOrders);
router.get('/:id', authenticateAdmin, getOrderById);
router.patch('/:id', authenticateAdmin, updateStatus);
router.get('/:id/history', authenticateAdmin, getStatusHistoryById);

export default router;