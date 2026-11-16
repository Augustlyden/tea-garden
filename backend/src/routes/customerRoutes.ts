import express from "express";
import { verifyCustomer } from "../middlewares/auth";
import { getOrderByCustomer, getOrdersByCustomer } from "../controllers/orderController";

const router = express.Router();

router.get('/', verifyCustomer, getOrdersByCustomer);
router.get('/:id', verifyCustomer, getOrderByCustomer);

export default router;