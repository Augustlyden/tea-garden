import express from "express";
import { getIssues, getMe, handleGithubCallback, loginAdmin, logoutAdmin, openIssue, startGithubLogin } from "../controllers/adminController";
import { authenticateAdmin } from "../middlewares/authToken";

const router = express.Router();

router.post('/login', loginAdmin);
router.post('/logout', logoutAdmin);
router.get('/me', authenticateAdmin, getMe);
router.get('/github', startGithubLogin);
router.get('/github/callback', handleGithubCallback);
router.get('/issues', authenticateAdmin, getIssues);
router.post('/issues', authenticateAdmin, openIssue);

export default router;