import express from "express";
import { exchangeCurrency } from "../integrations/currencyAdapter";

const router = express.Router();

router.get('/rates', exchangeCurrency);

export default router;