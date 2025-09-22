import express from "express";
import { isAdmin, protectedRoute } from "../Middlewares/protectedRoute";
import { ReviewController } from "../Controllers/reviewController";

const reviewrouter = express.Router();
const reviewController = new ReviewController();


reviewrouter.post("/", protectedRoute, reviewController.createReview);
reviewrouter.get("/product/:productId", reviewController.getProductReviews);
reviewrouter.delete("/:id", protectedRoute, isAdmin, reviewController.deleteReview);

export default reviewrouter;
