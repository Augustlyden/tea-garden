import express from "express";
import { getMe, handleGithubCallback, loginAdmin, logoutAdmin, startGithubLogin } from "../controllers/adminController";
import { authenticateAdmin } from "../middlewares/authToken";

const router = express.Router();

router.post('/login', loginAdmin);
router.post('/logout', logoutAdmin);
router.get('/me', authenticateAdmin, getMe);
router.get('/github', startGithubLogin);
router.get('/github/callback', handleGithubCallback);

export default router;