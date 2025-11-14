import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken'

interface JwtPayload {
    id: string
}

declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload
        }
    }
}

export const auth = (req: Request, res: Response, next: NextFunction): void => {
    const token = req.header('Authorization')?. replace('Bearer ', '')

    if (!token) { 
        res.status(401).json({ message: 'No token, authorization denied'})
        return
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload
        req.user = decoded
        next()
    }
    catch (error) {
        res.status(401).json({ message: 'Token is not valid'})
    }
}