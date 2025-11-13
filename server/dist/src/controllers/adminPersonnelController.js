
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="3167a714-c8cd-5d06-ac18-afc343146784")}catch(e){}}();
import { getCrewEmployees, getAllCrews, getEmployeeInfo, getCrewByIdAdmin, createCrew, editCrew, deleteCrew, createUserAdmin, editUserAdmin, deleteUser, getPersonnelManager, getAllActiveEmployees, } from "../services/adminPersonnelServices.js";
export const getCrewEmployeesController = async (req, res) => {
    try {
        const result = await getCrewEmployees();
        res.json(result);
    }
    catch (error) {
        res.status(500).json({
            error: error instanceof Error
                ? error.message
                : "Failed to fetch crew employees",
        });
    }
};
export const getAllCrewsController = async (req, res) => {
    try {
        const result = await getAllCrews();
        res.json(result);
    }
    catch (error) {
        res.status(500).json({
            error: error instanceof Error ? error.message : "Failed to fetch crews",
        });
    }
};
export const getAllActiveEmployeesController = async (req, res) => {
    try {
        const result = await getAllActiveEmployees();
        res.json(result);
    }
    catch (error) {
        res.status(500).json({
            error: error instanceof Error ? error.message : "Failed to fetch crews",
        });
    }
};
export const getEmployeeInfoController = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: "Employee ID is required" });
        }
        const result = await getEmployeeInfo(id);
        if (!result)
            return res.status(404).json({ error: "Employee not found" });
        res.json(result);
    }
    catch (error) {
        res.status(500).json({
            error: error instanceof Error
                ? error.message
                : "Failed to fetch employee info",
        });
    }
};
export const getCrewByIdAdminController = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: "Crew ID is required" });
        }
        const result = await getCrewByIdAdmin(id);
        if (!result)
            return res.status(404).json({ error: "Crew not found" });
        res.json(result);
    }
    catch (error) {
        res.status(500).json({
            error: error instanceof Error ? error.message : "Failed to fetch crew info",
        });
    }
};
// Placeholder for getCrewManagersController
export const getCrewManagersController = async (req, res) => {
    res.status(501).json({ error: "Not implemented" });
};
export const createCrewController = async (req, res) => {
    try {
        const { name, Users, leadId, crewType } = req.body;
        const result = await createCrew(name, Users, leadId, crewType);
        res.status(201).json(result);
    }
    catch (error) {
        res.status(400).json({
            error: error instanceof Error ? error.message : "Failed to create crew",
        });
    }
};
export const editCrewController = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, Users, leadId, crewType } = req.body;
        if (!id) {
            return res.status(400).json({ error: "Crew ID is required" });
        }
        const result = await editCrew(id, name, Users, leadId, crewType);
        res.json(result);
    }
    catch (error) {
        res.status(400).json({
            error: error instanceof Error ? error.message : "Failed to edit crew",
        });
    }
};
export const deleteCrewController = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: "Crew ID is required" });
        }
        const result = await deleteCrew(id);
        res.json(result);
    }
    catch (error) {
        res.status(400).json({
            error: error instanceof Error ? error.message : "Failed to delete crew",
        });
    }
};
export const createUserAdminController = async (req, res) => {
    try {
        const result = await createUserAdmin(req.body);
        res.status(201).json(result);
    }
    catch (error) {
        res.status(400).json({
            error: error instanceof Error ? error.message : "Failed to create user",
        });
    }
};
export const editUserAdminController = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await editUserAdmin({ ...req.body, id });
        res.json(result);
    }
    catch (error) {
        res.status(400).json({
            error: error instanceof Error ? error.message : "Failed to edit user",
        });
    }
};
export const deleteUserController = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: "User ID is required" });
        }
        const result = await deleteUser(id);
        res.json(result);
    }
    catch (error) {
        res.status(400).json({
            error: error instanceof Error ? error.message : "Failed to delete user",
        });
    }
};
export const getPersonnelManagerController = async (req, res) => {
    try {
        const result = await getPersonnelManager();
        res.json(result);
    }
    catch (error) {
        res.status(500).json({
            error: error instanceof Error
                ? error.message
                : "Failed to fetch crew employees",
        });
    }
};
//# sourceMappingURL=adminPersonnelController.js.map
//# debugId=3167a714-c8cd-5d06-ac18-afc343146784
