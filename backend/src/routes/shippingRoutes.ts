// shippingRoutes.ts
import { Router } from 'express';
import { getDeliveryEstimates, getServicePoints, getShippingPrices } from '../controllers/shippingController';
import { cartToken } from "../middlewares/cartToken";

const router = Router();

router.get('/service-points', getServicePoints);
router.get('/delivery-estimates', getDeliveryEstimates);
router.get('/prices', cartToken, getShippingPrices);

export default router;