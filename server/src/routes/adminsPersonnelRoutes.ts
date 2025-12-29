import { Router } from "express";
import {
  createCrewController,
  createUserAdminController,
  deleteCrewController,
  deleteUserController,
  editCrewController,
  editUserAdminController,
  getAllActiveEmployeesController,
  getAllCrewsController,
  getCrewByIdAdminController,
  getCrewEmployeesController,
  getCrewManagersController,
  getEmployeeInfoController,
  getPersonnelManagerController,
} from "../controllers/adminPersonnelController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import {
  createUserAdminSchema,
  editUserAdminSchema,
  createCrewSchema,
  editCrewSchema,
} from "../lib/validation/dashboard/personnel.js";

const router = Router();

/**
 * @swagger
 * /api/v1/admins/employees/getAllEmployees:
 *   get:
 *     summary: Get all employees in crew
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Employees retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/getAllEmployees", verifyToken, getCrewEmployeesController);

/**
 * @swagger
 * /api/v1/admins/employees/getAllActiveEmployees:
 *   get:
 *     summary: Get all active employees in crew
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Active employees retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/getAllActiveEmployees",
  verifyToken,
  getAllActiveEmployeesController
);

/**
 * @swagger
 * /api/v1/admins/employees/getAllCrews:
 *   get:
 *     summary: Get all crews
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Crews retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/getAllCrews", verifyToken, getAllCrewsController);

/**
 * @swagger
 * /api/v1/admins/employees/getEmployeeInfo/{id}:
 *   get:
 *     summary: Get employee info by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Employee info retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Employee not found
 */
router.get("/getEmployeeInfo/:id", verifyToken, getEmployeeInfoController);

/**
 * @swagger
 * /api/v1/admins/employees/getCrewByIdAdmin/{id}:
 *   get:
 *     summary: Get crew info by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Crew info retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Crew not found
 */
router.get("/getCrewByIdAdmin/:id", verifyToken, getCrewByIdAdminController);

/**
 * @swagger
 * /api/v1/admins/employees/crewManagers:
 *   get:
 *     summary: Get all crew managers
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Crew managers retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/crewManagers", verifyToken, getCrewManagersController);

/**
 * @swagger
 * /api/v1/admins/employees/personnelManager:
 *   get:
 *     summary: Get personnel manager data
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Personnel manager data retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/personnelManager", verifyToken, getPersonnelManagerController);

/**
 * @swagger
 * /api/v1/admins/employees/createUserAdmin:
 *   post:
 *     summary: Create a new user (admin)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserAdminRequest'
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/createUserAdmin",
  verifyToken,
  validateRequest(createUserAdminSchema),
  createUserAdminController
);

/**
 * @swagger
 * /api/v1/admins/employees/editUserAdmin/{id}:
 *   put:
 *     summary: Edit a user (admin)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EditUserAdminRequest'
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.put(
  "/editUserAdmin/:id",
  verifyToken,
  validateRequest(editUserAdminSchema),
  editUserAdminController
);

/**
 * @swagger
 * /api/v1/admins/employees/deleteUser/{id}:
 *   delete:
 *     summary: Delete a user (admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.delete("/deleteUser/:id", verifyToken, deleteUserController);

/**
 * @swagger
 * /api/v1/admins/employees/createCrew:
 *   post:
 *     summary: Create a new crew
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCrewRequest'
 *     responses:
 *       201:
 *         description: Crew created successfully
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/createCrew",
  verifyToken,
  validateRequest(createCrewSchema),
  createCrewController
);

/**
 * @swagger
 * /api/v1/admins/employees/editCrew/{id}:
 *   put:
 *     summary: Edit a crew
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EditCrewRequest'
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Crew updated successfully
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Crew not found
 */
router.put(
  "/editCrew/:id",
  verifyToken,
  validateRequest(editCrewSchema),
  editCrewController
);

/**
 * @swagger
 * /api/v1/admins/employees/deleteCrew/{id}:
 *   delete:
 *     summary: Delete a crew
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Crew deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Crew not found
 */
router.delete("/deleteCrew/:id", verifyToken, deleteCrewController);

export default router;
