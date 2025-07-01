import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export interface AuthRequest extends Request {
  user?: { id: string; role: 'USER' | 'ADMIN' }
}

export function authenticate(req: AuthRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization
  const token = authHeader?.split(' ')[1]

  if (!token) {
    res.status(401).json({ message: 'Token missing' })
    return
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
    req.user = { id: decoded.id, role: decoded.role }
    next()
  } catch {
    res.status(401).json({ message: 'Invalid token' })
  }
}

export function authorizeRole(role: 'ADMIN' | 'USER') {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (req.user?.role !== role) {
      res.status(403).json({ message: 'Access denied' })
      return
    }
    next()
  }
}
