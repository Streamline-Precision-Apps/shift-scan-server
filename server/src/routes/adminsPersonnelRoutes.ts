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

// get all users in crew
router.get("/getAllEmployees", verifyToken, getCrewEmployeesController);

// /api/v1/admins/employees/getAllActiveEmployees  - get all active users in crew
router.get(
  "/getAllActiveEmployees",
  verifyToken,
  getAllActiveEmployeesController
);
// get all crews
router.get("/getAllCrews", verifyToken, getAllCrewsController);
// get employee Info by id
router.get("/getEmployeeInfo/:id", verifyToken, getEmployeeInfoController);
// get crew Info by id
router.get("/getCrewByIdAdmin/:id", verifyToken, getCrewByIdAdminController);
// get all crew managers
router.get("/crewManagers", verifyToken, getCrewManagersController);

router.get("/personnelManager", verifyToken, getPersonnelManagerController);

// create user (admin)
router.post(
  "/createUserAdmin",
  verifyToken,
  validateRequest(createUserAdminSchema),
  createUserAdminController
);
// edit user (admin)
router.put(
  "/editUserAdmin/:id",
  verifyToken,
  validateRequest(editUserAdminSchema),
  editUserAdminController
);
// delete user (admin)
router.delete("/deleteUser/:id", verifyToken, deleteUserController);

// create crew
router.post(
  "/createCrew",
  verifyToken,
  validateRequest(createCrewSchema),
  createCrewController
);
// edit crew
router.put(
  "/editCrew/:id",
  verifyToken,
  validateRequest(editCrewSchema),
  editCrewController
);
// delete crew
router.delete("/deleteCrew/:id", verifyToken, deleteCrewController);

export default router;
