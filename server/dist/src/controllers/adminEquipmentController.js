
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="00dd1bc9-470d-5d48-b217-c4c7e58b55f4")}catch(e){}}();
import { createEquipmentService, editEquipmentService, archiveEquipmentService, restoreEquipmentService, deleteEquipmentService, getAllEquipmentService, getEquipmentByIdService, getEquipmentSummaryService, } from "../services/adminsEquipmentService.js";
// GET /api/v1/admins/equipment - List all equipment
export async function listEquipment(req, res) {
    try {
        const { status, filters, search = "", page = 1, pageSize = 25 } = req.query;
        const params = {
            status: status,
            filtersParam: filters,
            searchTerm: search,
            requestedPage: parseInt(page, 10) || 1,
            requestedPageSize: parseInt(pageSize, 10) || 25,
        };
        const result = await getAllEquipmentService(params);
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch equipment", error });
    }
}
export async function getEquipmentSummary(req, res) {
    try {
        const result = await getEquipmentSummaryService();
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch equipment", error });
    }
}
// GET /api/v1/admins/equipment/:id - Get equipment by ID
export async function getEquipmentById(req, res) {
    try {
        const id = req.params.id;
        const equipment = await getEquipmentByIdService(id);
        if (!equipment) {
            return res.status(404).json({ message: "Equipment not found" });
        }
        res.json(equipment);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch equipment", error });
    }
}
// POST /api/v1/admins/equipment - Create new equipment
export async function createEquipment(req, res) {
    try {
        // TODO: Get createdById and qrId from auth/session or request
        const createdById = req.body.createdById || "";
        const qrId = req.body.qrId || "";
        const equipment = await createEquipmentService(req.body, createdById, qrId);
        res.status(201).json(equipment);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to create equipment", error });
    }
}
// PUT /api/v1/admins/equipment/:id - Update equipment by ID
export async function updateEquipment(req, res) {
    try {
        const id = req.params.id;
        const userId = req.user?.id || "";
        if (!userId) {
            return res.status(401).json({ message: "User not authenticated" });
        }
        const equipment = await editEquipmentService(id, req.body, userId);
        res.json(equipment);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to update equipment", error });
    }
}
// DELETE /api/v1/admins/equipment/:id - Delete equipment by ID (hard delete)
export async function deleteEquipment(req, res) {
    try {
        const id = req.params.id;
        const equipment = await deleteEquipmentService(id);
        res.json(equipment);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to delete equipment", error });
    }
}
// PUT /api/v1/admins/equipment/:id/archive - Archive equipment by ID (update status)
export async function archiveEquipment(req, res) {
    try {
        const id = req.params.id;
        const equipment = await archiveEquipmentService(id);
        res.json(equipment);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to archive equipment", error });
    }
}
// PUT /api/v1/admins/equipment/:id/restore - Restore archived equipment by ID
export async function restoreEquipment(req, res) {
    try {
        const id = req.params.id;
        const equipment = await restoreEquipmentService(id);
        res.json(equipment);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to restore equipment", error });
    }
}
// GET /api/v1/admins/equipment/archived - List all archived equipment
export async function listArchivedEquipment(req, res) {
    try {
        // Reuse listEquipment with status filter
        req.query.status = "ARCHIVED";
        await listEquipment(req, res);
    }
    catch (error) {
        res
            .status(500)
            .json({ message: "Failed to fetch archived equipment", error });
    }
}
//# sourceMappingURL=adminEquipmentController.js.map
//# debugId=00dd1bc9-470d-5d48-b217-c4c7e58b55f4
