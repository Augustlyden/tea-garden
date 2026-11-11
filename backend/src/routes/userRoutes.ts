import express from "express";
import { getMe, handleGoogleCallback, logoutUser, startGoogleLogin } from "../controllers/userController";
import { verifyCustomer } from "../middlewares/auth";

const router = express.Router();

router.get('/google', startGoogleLogin);
router.get('/google/callback', handleGoogleCallback);
router.post('/logout', logoutUser);
router.get('/me', verifyCustomer, getMe);

export default router;