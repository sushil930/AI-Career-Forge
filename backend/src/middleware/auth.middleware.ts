import { Request, Response, NextFunction } from 'express';
import admin from 'firebase-admin';

// Extend Express Request interface to include 'user' property
declare global {
    namespace Express {
        interface Request {
            user?: admin.auth.DecodedIdToken;
        }
    }
}

export const authenticateToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1]; // Expecting "Bearer <token>"

    if (!token) {
        res.status(401).json({ message: 'Unauthorized: No token provided' });
        return;
    }

    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = decodedToken; // Attach decoded user info to the request object
        console.log(`[auth]: User authenticated: ${decodedToken.uid}`);
        next(); // Proceed to the next middleware or route handler
    } catch (error: any) {
        console.error("[auth]: Token verification failed:", error);
        if (error.code === 'auth/id-token-expired') {
            res.status(401).json({ message: 'Unauthorized: Token expired' });
        } else {
            res.status(403).json({ message: 'Forbidden: Invalid token' });
        }
    }
}; 