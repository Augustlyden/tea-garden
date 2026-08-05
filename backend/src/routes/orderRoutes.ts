import express from "express";
import { cartToken } from "../middlewares/cartToken";
import { placeOrder } from "../controllers/orderController";

const router = express.Router();

router.post('/', cartToken, placeOrder);

export default router;