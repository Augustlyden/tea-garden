import express from "express";
import { getMe, loginAdmin, logoutAdmin } from "../controllers/adminController";
import { authenticateAdmin } from "../middlewares/authToken";

const router = express.Router();

router.post('/login', loginAdmin);
router.post('/logout', logoutAdmin);
router.get('/me', authenticateAdmin, getMe);

export default router;