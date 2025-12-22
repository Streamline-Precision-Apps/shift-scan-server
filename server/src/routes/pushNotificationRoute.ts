import { Router } from "express";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = Router();

// Route to register an FCM token for a user
router.post("/user/:userId/fcm-token", verifyToken);

// Route to update a user's FCM token based on user platform
router.put("/user/:userId/fcm-token", verifyToken);

// Route to delete a user's FCM token based on user platform
router.delete("/user/:userId/fcm-token", verifyToken);

export default router;
