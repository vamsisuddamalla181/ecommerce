import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string; role: string };

    // 👇 check decoded payload
    console.log("Decoded token:", decoded);

    if (!decoded.id || !decoded.role) {
      return res.status(401).json({ message: "Invalid token payload" });
    }

    req.user = { id: decoded.id, role: decoded.role };
    return next(); // ✅ only call once
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
