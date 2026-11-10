import type { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = jwt.verify(req.cookies.session ?? '', process.env.SESSION_TOKEN_SECRET as string) as jwt.JwtPayload
    res.locals.customer = { id: payload.id, email: payload.email, name: payload.name }
    next()
  } catch {
    res.status(401).json({ error: 'Log in with Google' })
  }
}