import { CookieOptions, Request, Response } from "express";
import Admin from "../models/Admin";
import bcrypt from 'bcrypt';
import { generateToken } from "../utils/jwt";
import { AuthRequest } from "../types/tokenTypes";
import { randomString, toCodeChallenge } from "../lib/pkce";
import { exchangeCode, getAuthorizeUrl, getUser, listOpenIssues, createIssue } from "../integrations/githubAdapter";
import { z } from 'zod';

const ADMINS = process.env.ADMIN_GITHUB_LOGINS?.split(',') ?? [];
const CLIENT_URL = process.env.CLIENT_URL;

if (!CLIENT_URL) {
  throw new Error('CLIENT_URL is not set in the environment variables');
}

const COOKIE: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
};

const COOKIE_MAX_AGE = process.env.NODE_ENV === 'production'
  ? 24 * 60 * 60 * 1000
  : 7 * 24 * 60 * 60 * 1000;

const FLOW_COOKIE: CookieOptions = { 
  ...COOKIE, 
  path: '/api/admin/github', 
  maxAge: 10 * 60 * 1000 
};

const verifyPassword = async (plainPassword: string, hashedPassword: string) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

export const loginAdmin = async (
  req: Request<{ username: string, password: string }>, res: Response
) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, error: 'Användarnamn och lösenord krävs' });
    }

    const admin = await Admin.findByUsername(username);
    if (!admin) {
      return res.status(401).json({ success: false, error: 'Ogiltiga inloggningsuppgifter' });
    }

    if (!admin.password) {
      return res.status(400).json({ success: false, error: 'Admin lösenord saknas, logga in med GitHub' });
    }

    const isValid = await verifyPassword(password, admin.password);
    if (!isValid) {
      return res.status(401).json({ success: false, error: 'Ogiltiga inloggningsuppgifter' });
    }

    const token = generateToken(admin.id, admin.username);

    res.cookie('token', token, {
      ...COOKIE,
      maxAge: COOKIE_MAX_AGE
    }); 

    res.json({ success: true, data: { id: admin.id, username: admin.username }});
  } catch (error) {
    console.error('Login failed:', error);
    res.status(500).json({ success: false, error: 'Inloggning misslyckades'});
  }
};

export const logoutAdmin = async (req: Request, res: Response) => {
  try {
    res.clearCookie('token', COOKIE);
    res.json({ success: true, message: 'Utloggad' });
  } catch (error) {
    console.error('Logout failed:', error);
    res.status(500).json({ success: false, error: 'Utloggning misslyckades' });
  }
};

export const getMe = async (req: AuthRequest, res: Response) => {
  res.json({ success: true, data: { id: req.admin!.id, username: req.admin!.username} });
};

export const startGithubLogin = (req: Request, res: Response) => {
  const state = randomString();
  const codeVerifier = randomString();
  res.cookie('oauth_state', state, FLOW_COOKIE);
  res.cookie('oauth_verifier', codeVerifier, FLOW_COOKIE);
  res.redirect(getAuthorizeUrl(state, toCodeChallenge(codeVerifier)));
};

export const handleGithubCallback = async (req: Request, res: Response) => {
  const { code, state, error } = req.query;
  const { oauth_state, oauth_verifier } = req.cookies;
  res.clearCookie('oauth_state', FLOW_COOKIE);
  res.clearCookie('oauth_verifier', FLOW_COOKIE);

  if (error) {
    res.redirect(CLIENT_URL + '/admin/login/?error=cancelled');
    return;
  }

  if (!state || state !== oauth_state) {
    res.redirect(CLIENT_URL + '/admin/login/?error=state');
    return;
  }

  try {
    const accessToken = await exchangeCode(code as string, oauth_verifier);
    const user = await getUser(accessToken);

    if (!ADMINS.includes(user.login)) {
      res.redirect(CLIENT_URL + '/admin/login/?error=not-admin');
      return;
    }

    const loggedUser = await Admin.findOrCreateByGithub(user.id, user.login);

    const token = generateToken(loggedUser.id, loggedUser.username);
    
    res.cookie('token', token, { ...COOKIE, maxAge: COOKIE_MAX_AGE });
    res.redirect(CLIENT_URL + '/admin/products');
  } catch (err) {
    console.error(err);
    res.redirect(CLIENT_URL + '/admin/login/?error=github');
  }
};

export const getIssues = async (req: Request, res: Response) => {
  try {
    const issues = await listOpenIssues();
    res.json({ success: true, data: issues });
  } catch (error) {
    console.error('Error while retrieving issues from GitHub:', error);
    res.status(502).json({ success: false, error: 'Misslyckades att hämta Issues från GitHub' });
  }
};

const IssueBody = z.object({
  title: z.string().trim().min(1).max(100),
  description: z.string().trim().min(1).max(2000)
});

export const openIssue = async (req: AuthRequest, res: Response) => {
  const username = req.admin!.username;
  const parsed = IssueBody.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({ success: false, error: 'Title or Description has the wrong format' });
    return;
  }
  
  try {
    const issue = await createIssue(parsed.data.title, `${parsed.data.description}\n\n---\nReported by admin ${username} in the admin panel.`);
    res.status(201).json({ success: true, data: issue });
  } catch (error) {
    console.error('Error while creating issue in GitHub', error);
    res.status(502).json({ success: false, error: 'GitHub did not create the issue. Check GITHUB_ISSUES_TOKEN and GITHUB_REPO.' })
  }
};