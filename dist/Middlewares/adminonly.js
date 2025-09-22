"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminonly = void 0;
const adminonly = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized: No user found" });
    }
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Access denied: Admins only" });
    }
    next();
};
exports.adminonly = adminonly;
