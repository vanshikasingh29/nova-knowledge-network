import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";


export interface AuthenticatedRequest extends Request {
    userId?: string;
}


export function authenticateToken(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) {

    const authHeader = req.headers.authorization;


    if (!authHeader) {

        return res.status(401).json({
            message: "Authentication required"
        });

    }


    if (!authHeader.startsWith("Bearer ")) {

        return res.status(401).json({
            message: "Invalid authentication format"
        });

    }


    const token = authHeader.substring(7);


    const secret = process.env.JWT_SECRET;


    if (!secret) {

        return res.status(500).json({
            message: "Authentication configuration error"
        });

    }


    try {

        const decoded = jwt.verify(
            token,
            secret
        ) as {
            userId: string
        };


        req.userId = decoded.userId;


        next();


    } catch {

        return res.status(401).json({
            message: "Invalid or expired token"
        });

    }

}