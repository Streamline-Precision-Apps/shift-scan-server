import { Router } from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import {
  getUserById,
  getUsers,
  updateSettings,
  updateUser,
  getUserSettingsByQuery,
  getUserContact,
  getAllUsers,
  getUsersTimeSheetByDate,
  getTeamsByUserId,
  getCrewMembers,
  getCrewOnlineStatus,
  getUserOnlineStatus,
  getUserInfo,
  sessionController,
  endSessionController,
  userSignatureController,
  getAllTeams,
  getUserLocaleController,
} from "../controllers/UserController.js";
import { validateRequest } from "../middleware/validateRequest.js";
import {
  updateUserSchema,
  updateUserSettingsSchema,
  emptyBodySchema,
} from "../lib/validation/app/user.js";

const router = Router();

// 1. Static and admin routes
/**
 * @swagger
 * /api/v1/user:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get all users
 *     description: Retrieve a list of all users (requires authentication)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users retrieved successfully
 *       401:
 *         description: Unauthorized - invalid or missing bearer token
 */
router.get("/", verifyToken, getUsers);
/**
 * @swagger
 * /api/v1/user/All:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get all users (admin)
 *     description: Retrieve a list of all users (admin access, requires authentication)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users retrieved successfully
 *       401:
 *         description: Unauthorized - invalid or missing bearer token
 */
router.get("/All", verifyToken, getAllUsers);
/**
 * @swagger
 * /api/v1/user/teams:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get all teams
 *     description: Retrieve a list of all teams
 *     responses:
 *       200:
 *         description: List of teams retrieved successfully
 */
router.get("/teams", getAllTeams);
/**
 * @swagger
 * /api/v1/user/settings:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get user settings by query
 *     description: Retrieve user settings using query parameters
 *     responses:
 *       200:
 *         description: User settings retrieved successfully
 *       404:
 *         description: User not found
 */
router.get("/settings", getUserSettingsByQuery);
/**
 * @swagger
 * /api/v1/user/settings:
 *   put:
 *     tags:
 *       - Users
 *     summary: Update user settings
 *     description: Update the settings of an existing user (requires authentication)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               email:
 *                 type: string
 *               emergencyContact:
 *                 type: string
 *               emergencyContactNumber:
 *                 type: string
 *               language:
 *                 type: string
 *               generalReminders:
 *                 type: boolean
 *               personalReminders:
 *                 type: boolean
 *               cameraAccess:
 *                 type: boolean
 *               locationAccess:
 *                 type: boolean
 *               cookiesAccess:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: User settings updated successfully
 *       401:
 *         description: Unauthorized - invalid or missing bearer token
 *       400:
 *         description: Bad request
 */
router.put(
  "/settings",
  verifyToken,
  validateRequest(updateUserSettingsSchema),
  updateSettings
);
/**
 * @swagger
 * /api/v1/user/contact:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get user contact info
 *     description: Retrieve user contact information by query
 *     responses:
 *       200:
 *         description: User contact info retrieved successfully
 *       404:
 *         description: User not found
 */
router.get("/contact", getUserContact);

// 2. Most specific dynamic routes (with multiple params)
/**
 * @swagger
 * /api/v1/user/{userId}/timesheet/{date}:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get user's timesheet by date
 *     description: Retrieve a user's timesheet for a specific date (requires authentication)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *       - name: date
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Timesheet retrieved successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Timesheet not found
 */
router.get("/:userId/timesheet/:date", getUsersTimeSheetByDate);
/**
 * @swagger
 * /api/v1/user/{userId}/crew/{crewId}/online:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get online status for a crew
 *     description: Retrieve online status for all members of a crew
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *       - name: crewId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Crew online status retrieved successfully
 *       404:
 *         description: User or crew not found
 */
router.get("/:userId/crew/:crewId/online", getCrewOnlineStatus);
/**
 * @swagger
 * /api/v1/user/{userId}/crew/{crewId}:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get crew members for a user
 *     description: Retrieve all crew members for a given user and crew
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *       - name: crewId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Crew members retrieved successfully
 *       404:
 *         description: User or crew not found
 */
router.get("/:userId/crew/:crewId", getCrewMembers);
/**
 * @swagger
 * /api/v1/user/{userId}/teams:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get teams for a user
 *     description: Retrieve all teams associated with a user
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Teams retrieved successfully
 *       404:
 *         description: User or teams not found
 */
router.get("/:userId/teams", getTeamsByUserId);
/**
 * @swagger
 * /api/v1/user/{userId}/info:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get user info (profile + contact)
 *     description: Retrieve a user's profile and contact info by userId
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User info retrieved successfully
 *       404:
 *         description: User not found
 */
router.get("/:userId/info", getUserInfo);
/**
 * @swagger
 * /api/v1/user/{userId}/online:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get user's online status
 *     description: Retrieve a user's online (clocked in) status by userId
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User online status retrieved successfully
 *       404:
 *         description: User not found
 */
router.get("/:userId/online", getUserOnlineStatus);

// 3. Session/signature routes (by id)
/**
 * @swagger
 * /api/v1/user/{id}/session:
 *   post:
 *     tags:
 *       - Users
 *     summary: Start a user session
 *     description: Start a new session for a user (e.g., clock in)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Empty body required
 *     responses:
 *       200:
 *         description: Session started successfully
 *       401:
 *         description: Unauthorized - invalid or missing bearer token
 *       404:
 *         description: User not found
 */
router.post(
  "/:id/session",
  verifyToken,
  validateRequest(emptyBodySchema),
  sessionController
);
/**
 * @swagger
 * /api/v1/user/{id}/session/{sessionId}:
 *   put:
 *     tags:
 *       - Users
 *     summary: End a user session
 *     description: End an existing session for a user (e.g., clock out)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *       - name: sessionId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Empty body required
 *     responses:
 *       200:
 *         description: Session ended successfully
 *       401:
 *         description: Unauthorized - invalid or missing bearer token
 *       404:
 *         description: User or session not found
 */
router.put(
  "/:id/session/:sessionId",
  verifyToken,
  validateRequest(emptyBodySchema),
  endSessionController
);
/**
 * @swagger
 * /api/v1/user/{id}/signature:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get user signature
 *     description: Retrieve the signature image or data for a user by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User signature retrieved successfully
 *       401:
 *         description: Unauthorized - invalid or missing bearer token
 *       404:
 *         description: User or signature not found
 */
router.get("/:id/signature", verifyToken, userSignatureController);

// 4. User by id and related
/**
 * @swagger
 * /api/v1/user/{id}/locale:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get user locale
 *     description: Retrieve the locale setting for a user by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User locale retrieved successfully
 *       404:
 *         description: User not found
 */
router.get("/:id/locale", getUserLocaleController);
/**
 * @swagger
 * /api/v1/user/{id}:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get user by ID
 *     description: Retrieve a specific user by their ID (requires authentication)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *       401:
 *         description: Unauthorized - invalid or missing bearer token
 *       404:
 *         description: User not found
 *   put:
 *     tags:
 *       - Users
 *     summary: Update user by ID
 *     description: Update a user's information by their ID (requires authentication)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserRequest'
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 *       401:
 *         description: Unauthorized - invalid or missing bearer token
 *       400:
 *         description: Bad request
 *       404:
 *         description: User not found
 */
router.get("/:id", verifyToken, getUserById);
router.put("/:id", verifyToken, validateRequest(updateUserSchema), updateUser);

/**
 * @swagger
 * /api/v1/user/{userId}/online:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get user's online status
 *     description: Retrieve a user's online (clocked in) status by userId
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User online status retrieved successfully
 *       404:
 *         description: User not found
 */
router.get("/:userId/online", getUserOnlineStatus);

/**
 * @swagger
 * /api/v1/user/{userId}/info:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get user info (profile + contact)
 *     description: Retrieve a user's profile and contact info by userId
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User info retrieved successfully
 *       404:
 *         description: User not found
 */
router.get("/:userId/info", getUserInfo);

/**
 * @swagger
 * /api/v1/user/{userId}/timesheet/{date}:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get user's timesheet by date
 *     description: Retrieve a user's timesheet for a specific date (requires authentication)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *       - name: date
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Timesheet retrieved successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Timesheet not found
 */
router.get("/:userId/timesheet/:date", getUsersTimeSheetByDate);

/**
 * @swagger
 * /api/v1/user/{userId}/teams:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get teams for a user
 *     description: Retrieve all teams associated with a user
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Teams retrieved successfully
 *       404:
 *         description: User or teams not found
 */
router.get("/:userId/teams", getTeamsByUserId);

/**
 * @swagger
 * /api/v1/user/{userId}/crew/{crewId}:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get crew members for a user
 *     description: Retrieve all crew members for a given user and crew
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *       - name: crewId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Crew members retrieved successfully
 *       404:
 *         description: User or crew not found
 */
router.get("/:userId/crew/:crewId", getCrewMembers);

/**
 * @swagger
 * /api/v1/user/{userId}/crew/{crewId}/online:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get online status for a crew
 *     description: Retrieve online status for all members of a crew
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *       - name: crewId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Crew online status retrieved successfully
 *       404:
 *         description: User or crew not found
 */
router.get("/:userId/crew/:crewId/online", getCrewOnlineStatus);

/**
 * @swagger
 * /api/v1/user/All:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get all users (admin)
 *     description: Retrieve a list of all users (admin access, requires authentication)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users retrieved successfully
 *       401:
 *         description: Unauthorized - invalid or missing bearer token
 */
router.get("/All", verifyToken, getAllUsers);

/**
 * @swagger
 * /api/v1/user/teams:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get all teams
 *     description: Retrieve a list of all teams
 *     responses:
 *       200:
 *         description: List of teams retrieved successfully
 */
router.get("/teams", getAllTeams);

/**
 * @swagger
 * /api/v1/user/{id}:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get user by ID
 *     description: Retrieve a specific user by their ID (requires authentication)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *       401:
 *         description: Unauthorized - invalid or missing bearer token
 *       404:
 *         description: User not found
 *   put:
 *     tags:
 *       - Users
 *     summary: Update user by ID
 *     description: Update a user's information by their ID (requires authentication)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserRequest'
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 *       401:
 *         description: Unauthorized - invalid or missing bearer token
 *       400:
 *         description: Bad request
 *       404:
 *         description: User not found
 */
router.get("/:id", verifyToken, getUserById);
router.put("/:id", verifyToken, validateRequest(updateUserSchema), updateUser);

/**
 * @swagger
 * /api/v1/user/settings:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get user settings by query
 *     description: Retrieve user settings using query parameters
 *     responses:
 *       200:
 *         description: User settings retrieved successfully
 *       404:
 *         description: User not found
 */
router.get("/settings", getUserSettingsByQuery);

/**
 * @swagger
 * /api/v1/user/settings:
 *   put:
 *     tags:
 *       - Users
 *     summary: Update user settings
 *     description: Update the settings of an existing user (requires authentication)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               email:
 *                 type: string
 *               emergencyContact:
 *                 type: string
 *               emergencyContactNumber:
 *                 type: string
 *               language:
 *                 type: string
 *               generalReminders:
 *                 type: boolean
 *               personalReminders:
 *                 type: boolean
 *               cameraAccess:
 *                 type: boolean
 *               locationAccess:
 *                 type: boolean
 *               cookiesAccess:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: User settings updated successfully
 *       401:
 *         description: Unauthorized - invalid or missing bearer token
 *       400:
 *         description: Bad request
 */

router.put(
  "/settings",
  verifyToken,
  validateRequest(updateUserSettingsSchema),
  updateSettings
);

/**
 * @swagger
 * /api/v1/user/contact:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get user contact info
 *     description: Retrieve user contact information by query
 *     responses:
 *       200:
 *         description: User contact info retrieved successfully
 *       404:
 *         description: User not found
 */
router.get("/contact", getUserContact);

/**
 * @swagger
 * /api/v1/user/{id}/locale:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get user locale
 *     description: Retrieve the locale setting for a user by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User locale retrieved successfully
 *       404:
 *         description: User not found
 */
router.get("/:id/locale", getUserLocaleController);

export default router;
