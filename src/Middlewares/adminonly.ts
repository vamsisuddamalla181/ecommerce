// src/middleware/adminOnly.ts
import { Response, NextFunction } from "express";
import { AuthRequest } from "./adminmiddleware";

export const adminonly = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized: No user found" });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied: Admins only" });
  }

  next();
};
