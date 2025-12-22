import { Router } from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import {
  pushReminderController,
  upsertFCMToken,
} from "../controllers/pushNotificationController.js";

const router = Router();

// Route to register an FCM token for a user
router.post("/user/:userId/fcm-tokens", verifyToken, upsertFCMToken);

// send push notification single user and single device
// user forgets to clock out and needs to be reminded
router.post(
  "/user/:userId/device/:deviceId/send-notification",
  verifyToken,
  pushReminderController
);

// send push notification to all users

export default router;
