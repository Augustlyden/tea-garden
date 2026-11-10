import jwt from 'jsonwebtoken'
import { z } from 'zod'

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID ?? ''
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET ?? ''
const CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL ?? ''

if (!CLIENT_ID || !CLIENT_SECRET || !CALLBACK_URL) {
  throw new Error('Google is not configured. Copy .env.example to .env and fill in the GOOGLE_ values.')
}

const IdTokenClaims = z.object({
  iss: z.enum(['https://accounts.google.com', 'accounts.google.com']),
  aud: z.literal(CLIENT_ID),
  exp: z.number(),
  sub: z.string().min(1),
  email: z.email(),
  email_verified: z.boolean().default(false),
  name: z.string().optional(),
})

export const getAuthorizeUrl = (state: string, codeChallenge: string) => {
  const params = new URLSearchParams({
    response_type: 'code', 
    client_id: CLIENT_ID,
    scope: 'openid email profile', 
    redirect_uri: CALLBACK_URL, 
    state, 
    code_challenge: codeChallenge, 
    code_challenge_method: 'S256', 
  })

  return `https://accounts.google.com/o/oauth2/v2/auth?${params}`
}

export const exchangeCode = async (code: string, codeVerifier: string) => { 
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code,
      code_verifier: codeVerifier, 
      grant_type: 'authorization_code',
      redirect_uri: CALLBACK_URL,
    }),
    signal: AbortSignal.timeout(5_000),
  })
  const answer: any = await response.json()
  if (!response.ok || !answer.id_token) {
    throw new Error(`Google refused the code: ${answer.error ?? response.status}`)
  }

  const parsed = IdTokenClaims.safeParse(jwt.decode(answer.id_token))
  if (!parsed.success) {
    const fields = parsed.error.issues.map((issue) => issue.path.join('.')).join(', ')
    throw new Error(`The ID token is invalid or not meant for this app (${fields})`)
  }
  const claims = parsed.data

  if (claims.aud !== CLIENT_ID) throw new Error('The ID token is for another app')
  if (!claims.exp || claims.exp * 1000 < Date.now()) throw new Error('The ID token has expired')

  return {
    sub: String(claims.sub),
    email: String(claims.email),
    emailVerified: claims.email_verified === true,
    name: String(claims.name ?? claims.email),
  }
}