import { Response } from "express";
import { Review } from "../models/Reviews";
import { AuthRequest } from "../Middlewares/adminmiddleware";
import { Product } from "../models/product";
import { Order } from "../models/orders";
import { Types, isValidObjectId } from "mongoose";

export class ReviewController {
  // Create a review
  createReview = async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user!.id;
      const { productId, rating, comment } = req.body;

      // Validate productId format
      if (!productId || !isValidObjectId(productId)) {
        return res.status(400).json({ message: "Invalid productId format" });
      }
      const productObjectId = new Types.ObjectId(productId);

      // Check product exists
      const product = await Product.findById(productObjectId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      // Ensure order exists and product was delivered
      const order = await Order.findOne({
        userId: new Types.ObjectId(userId), // make sure type matches
        "products.productId": { $in: [productId, productObjectId] }, // flexible match
        orderStatus: "Delivered",
      });

      if (!order) {
        return res
          .status(400)
          .json({ message: "You can review only after delivery" });
      }

      // Check if user already reviewed
      const existingReview = await Review.findOne({
        userId,
        productId: productObjectId,
      });
      if (existingReview) {
        return res
          .status(400)
          .json({ message: "You have already reviewed this product" });
      }

      // Create review
      const review = await Review.create({
        userId,
        productId: productObjectId,
        rating,
        comment,
      });

      // Update product ratings
      const existing = product.ratings?.[0];
      if (existing) {
        const totalRatings = existing.numberOfRatings + 1;
        const newAverage =
          (existing.averageRating * existing.numberOfRatings + rating) /
          totalRatings;
        product.ratings[0] = {
          averageRating: newAverage,
          numberOfRatings: totalRatings,
        };
      } else {
        product.ratings = [{ averageRating: rating, numberOfRatings: 1 }];
      }
      await product.save();

      res
        .status(201)
        .json({ message: "Review added successfully", review });
    } catch (error: any) {
      res
        .status(500)
        .json({ message: "Failed to add review", error: error.message });
    }
  };

  // Get reviews for a product
  getProductReviews = async (req: AuthRequest, res: Response) => {
    try {
      const { productId } = req.params;
      if (!isValidObjectId(productId)) {
        return res.status(400).json({ message: "Invalid productId format" });
      }

      const reviews = await Review.find({
        productId: new Types.ObjectId(productId),
      }).populate("userId", "name email");
      res.json(reviews);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  // Delete a review (user or admin)
  deleteReview = async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params; // review ID
      if (!isValidObjectId(id)) {
        return res.status(400).json({ message: "Invalid reviewId format" });
      }

      const review = await Review.findById(id);
      if (!review) return res.status(404).json({ message: "Review not found" });

      if (
        req.user!.role !== "admin" &&
        review.userId.toString() !== req.user!.id
      ) {
        return res.status(403).json({ message: "Access denied" });
      }

      await review.deleteOne();
      res.json({ message: "Review deleted" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };
}
