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
/**
 * @swagger
 * /api/v1/location/all:
 *   get:
 *     summary: Get all users' current locations
 *     description: Retrieve the current locations of all users for map view (admin/manager only).
 *     tags:
 *       - Location
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all users' locations
 *       401:
 *         description: Unauthorized
 */
router.get("/all", verifyToken, getAllUsersLocations);

// Get latest location for authenticated user
/**
 * @swagger
 * /api/v1/location/user:
 *   get:
 *     summary: Get latest location for authenticated user
 *     description: Retrieve the latest location for the authenticated user.
 *     tags:
 *       - Location
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Latest user location
 *       401:
 *         description: Unauthorized
 */
router.get("/user", verifyToken, getUserLocations);

// Get latest location for any user (admin/manager)
/**
 * @swagger
 * /api/v1/location/{userId}:
 *   get:
 *     summary: Get latest location for any user
 *     description: Retrieve the latest location for any user (admin/manager only).
 *     tags:
 *       - Location
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: Latest user location
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.get("/:userId", verifyToken, getUserLocations);

// Get location history for any user
/**
 * @swagger
 * /api/v1/location/{userId}/history:
 *   get:
 *     summary: Get location history for a user
 *     description: Retrieve the location history for a user (admin/manager only).
 *     tags:
 *       - Location
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User location history
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.get("/:userId/history", verifyToken, getUserLocationHistory);

// Post a new location log (expects userId and sessionId in body)
/**
 * @swagger
 * /api/v1/location:
 *   post:
 *     summary: Post a new location log
 *     description: Post a new location log for a user. Expects userId and sessionId in the request body.
 *     tags:
 *       - Location
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LocationUpdateInput'
 *     responses:
 *       201:
 *         description: Location log created
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/",
  verifyToken,
  validateRequest(locationUpdateSchema),
  postUserLocation
);

export default router;
