import { type CookieOptions, Request, Response } from 'express';
import { randomString, toCodeChallenge } from '../lib/pkce';
import { exchangeCode, getAuthorizeUrl } from '../integrations/googleAdapter';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const CLIENT_URL = process.env.CLIENT_URL;
const SESSION_TOKEN_SECRET = process.env.SESSION_TOKEN_SECRET;

if (!SESSION_TOKEN_SECRET || !CLIENT_URL) {
  throw new Error('SESSION_TOKEN_SECRET or CLIENT_URL is not set in the environment variables');
}

const SESSION_SECONDS = 8 * 60 * 60;
const COOKIE: CookieOptions = { 
  httpOnly: true, 
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', 
  secure: process.env.NODE_ENV === 'production'
};
const FLOW_COOKIE: CookieOptions = { 
  ...COOKIE, 
  sameSite: 'lax',
  path: '/api/auth/google', 
  maxAge: 10 * 60 * 1000 
};

export const startGoogleLogin = (req: Request, res: Response) => {
  const state = randomString();
  const codeVerifier = randomString();
  res.cookie('oauth_state', state, FLOW_COOKIE)
  res.cookie('oauth_verifier', codeVerifier, FLOW_COOKIE);
  res.redirect(getAuthorizeUrl(state, toCodeChallenge(codeVerifier)));
};

export const handleGoogleCallback = async (req: Request, res: Response) => {
  const { code, state, error } = req.query;
  const expectedState = req.cookies.oauth_state;
  const codeVerifier = req.cookies.oauth_verifier;
  res.clearCookie('oauth_state', FLOW_COOKIE);
  res.clearCookie('oauth_verifier', FLOW_COOKIE);

  if (error) {
    res.redirect(CLIENT_URL + '/?error=cancelled')
    return
  }

  if (typeof code !== 'string' || !expectedState || state !== expectedState || !codeVerifier) {
    res.redirect(CLIENT_URL + '/?error=state');
    return;
  }

  try {
    const user = await exchangeCode(code, codeVerifier);
    if (!user.emailVerified) {
      res.redirect(CLIENT_URL + '/?error=not-verified');
      return;
    }

    const loggedUser = await User.findOrCreateByGoogle(user);

    const token = jwt.sign(
      { id: loggedUser.id, email: loggedUser.email, name: loggedUser.name },
      SESSION_TOKEN_SECRET,
      { expiresIn: SESSION_SECONDS }
    )
    res.cookie('session', token, { ...COOKIE, maxAge: SESSION_SECONDS * 1000 });
    console.log('[OAUTH] 3. Logged in – the shop\'s own cookie is set');
    res.redirect(CLIENT_URL);
  } catch (err) {
    console.error(err);
    res.redirect(CLIENT_URL + '/?error=google');
  }
};

export const getMe = (req: Request, res: Response) => {
  res.json({ customer: res.locals.customer });
};

export const logoutUser = (req: Request, res: Response) => {
  res.clearCookie('session', COOKIE);
  res.json({ success: true, message: 'Logged out' });
};