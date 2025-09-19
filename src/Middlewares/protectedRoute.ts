import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthRequest } from "./adminmiddleware";

export const protectedRoute = (req: AuthRequest, res: Response, next: NextFunction) => {

    const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "No token provided, access denied" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string; role: string };
        console.log("Decoded JWT:", decoded);  
        req.user = { id: decoded.id, role: decoded.role };
        next();
    } catch (err) {
        res.status(401).json({ message: "Invalid token" });
    }
};
export const isAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.user?.role !== "admin") {
        return res.status(403).json({ message: "Access denied: Admins only" });
    }
    next();
};

