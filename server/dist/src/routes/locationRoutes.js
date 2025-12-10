
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="f38ddcbd-81df-5e19-b589-7f31afd5d19c")}catch(e){}}();
import { Router } from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { getUserLocations, getUserLocationHistory, postUserLocation, getAllUsersLocations, } from "../controllers/locationController.js";
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
router.post("/", postUserLocation);
export default router;
//# sourceMappingURL=locationRoutes.js.map
//# debugId=f38ddcbd-81df-5e19-b589-7f31afd5d19c
