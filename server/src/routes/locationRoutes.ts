import { Router } from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import {
  getUserLocations,
  getUserLocationHistory,
  postUserLocation,
  getAllUsersLocations,
} from "../controllers/locationController.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { locationUpdateSchema } from "../lib/validation/location.js";

const router = Router();

// Get all users' current locations for map view
router.get("/all", verifyToken, getAllUsersLocations);

// Get latest location for authenticated user
router.get("/user", verifyToken, getUserLocations);

// Get latest location for any user (admin/manager)
router.get("/:userId", verifyToken, getUserLocations);

// Get location history for any user
router.get("/:userId/history", verifyToken, getUserLocationHistory);

// Post a new location log (expects userId and sessionId in body)
router.post(
  "/",
  verifyToken,
  validateRequest(locationUpdateSchema),
  postUserLocation
);

export default router;
