
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="12be22d7-8ddd-5151-bfbb-4780aacfbc04")}catch(e){}}();
import { Router } from "express";
import { createCrewController, createUserAdminController, deleteCrewController, deleteUserController, editCrewController, editUserAdminController, getAllActiveEmployeesController, getAllCrewsController, getCrewByIdAdminController, getCrewEmployeesController, getCrewManagersController, getEmployeeInfoController, getPersonnelManagerController, } from "../controllers/adminPersonnelController.js";
const router = Router();
// get all users in crew
router.get("/getAllEmployees", getCrewEmployeesController);
// /api/v1/admins/employees/getAllActiveEmployees  - get all active users in crew
router.get("/getAllActiveEmployees", getAllActiveEmployeesController);
// get all crews
router.get("/getAllCrews", getAllCrewsController);
// get employee Info by id
router.get("/getEmployeeInfo/:id", getEmployeeInfoController);
// get crew Info by id
router.get("/getCrewByIdAdmin/:id", getCrewByIdAdminController);
// get all crew managers
router.get("/crewManagers", getCrewManagersController);
router.get("/personnelManager", getPersonnelManagerController);
// create user (admin)
router.post("/createUserAdmin", createUserAdminController);
// edit user (admin)
router.put("/editUserAdmin/:id", editUserAdminController);
// delete user (admin)
router.delete("/deleteUser/:id", deleteUserController);
// create crew
router.post("/createCrew", createCrewController);
// edit crew
router.put("/editCrew/:id", editCrewController);
// delete crew
router.delete("/deleteCrew/:id", deleteCrewController);
export default router;
//# sourceMappingURL=adminsPersonnelRoutes.js.map
//# debugId=12be22d7-8ddd-5151-bfbb-4780aacfbc04
