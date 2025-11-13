
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="9c2ede55-a887-5fa0-ad66-77597d7d6115")}catch(e){}}();
import Express from "express";
import { getTruckEndingMileage, getTruckEquipmentHauled, getTruckingLogService, getTruckMaterial, getTruckNotes, getTruckStartingMileage, getStateMileage, getRefueledLogs, getAllTruckingLogData, createEquipmentHauledService, createHaulingLogsService, createStateMileageService, createRefuelLogService, createMaterialService, deleteEquipmentHauledService, deleteStateMileageService, deleteRefuelLogService, deleteMaterialService, editEquipmentHauledService, updateEquipmentHauledService, updateTruckingLogEndingMileageService, updateTruckingLogStartingMileageService, updateTruckingLogNotesService, updateStateMileageService, updateRefuelLogService, updateMaterialService, } from "../services/truckingLogService.js";
import prisma from "../lib/prisma.js";
export async function getTruckingLogsController(req, res) {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({ error: "User ID is required." });
        }
        const status = await getTruckingLogService(userId);
        if (!status) {
            throw new Error("No trucking logs found for the given ID.");
        }
        return res.json(status);
    }
    catch (error) {
        console.error("Error fetching trucking logs:", error);
        return res.status(500).json({ error: "Internal server error." });
    }
}
export async function getTruckingLogsById(req, res) {
    try {
        const { id } = req.params;
        const { field } = req.query;
        if (!id) {
            return res.status(400).json({ error: "Trucking log ID is required." });
        }
        // Fetch all data first
        const allData = await getAllTruckingLogData(id);
        if (!allData) {
            return res.status(204).send(); // No content found
        }
        // If a specific field is requested, refetch just that field
        if (field) {
            let fieldData;
            switch (field) {
                case "startingMileage":
                    fieldData = await getTruckStartingMileage(id);
                    return res.json({ ...allData, startingMileage: fieldData });
                case "endingMileage":
                    fieldData = await getTruckEndingMileage(id);
                    return res.json({ ...allData, endingMileage: fieldData });
                case "stateMileage":
                    fieldData = await getStateMileage(id);
                    return res.json({ ...allData, stateMileage: fieldData });
                case "notes":
                    fieldData = await getTruckNotes(id);
                    return res.json({ ...allData, notes: fieldData });
                case "refuelLogs":
                    fieldData = await getRefueledLogs(id);
                    return res.json({ ...allData, refuelLogs: fieldData });
                case "equipmentHauled":
                    fieldData = await getTruckEquipmentHauled(id);
                    return res.json({ ...allData, equipmentHauled: fieldData });
                case "material":
                    fieldData = await getTruckMaterial(id);
                    return res.json({ ...allData, material: fieldData });
                default:
                    return res.json(allData);
            }
        }
        else {
            return res.json(allData);
        }
    }
    catch (error) {
        console.error("Error fetching trucking logs:", error);
        return res.status(500).json({ error: "Internal server error." });
    }
}
export async function createTruckingLogsController(req, res) {
    try {
        const { id } = req.params;
        const { field } = req.query;
        if (!id) {
            return res.status(400).json({ error: "Trucking Log ID is required." });
        }
        // id is now the TruckingLog ID (not TimeSheet ID)
        const truckingLogId = id;
        // Verify the trucking log exists
        const truckingLog = await prisma.truckingLog.findUnique({
            where: { id: truckingLogId },
        });
        if (!truckingLog) {
            return res
                .status(404)
                .json({ error: "No TruckingLog found with this ID." });
        }
        let fieldData;
        switch (field) {
            case "equipmentHauled":
                fieldData = await createEquipmentHauledService(truckingLogId);
                return res.status(201).json({ equipmentHauled: fieldData });
            case "material": {
                const { name, quantity, LocationOfMaterial, unit, loadType } = req.body;
                if (!name || quantity === undefined) {
                    return res.status(400).json({
                        error: "Material name and quantity are required.",
                    });
                }
                fieldData = await createMaterialService(truckingLogId, {
                    name,
                    quantity,
                    LocationOfMaterial,
                    unit,
                    loadType,
                });
                return res.status(201).json({ material: fieldData });
            }
            case "stateMileage": {
                const { state, stateLineMileage } = req.body;
                fieldData = await createStateMileageService(truckingLogId, {
                    state,
                    stateLineMileage,
                });
                return res.status(201).json({ stateMileage: fieldData });
            }
            case "refuelLogs": {
                const { gallonsRefueled, milesAtFueling } = req.body;
                fieldData = await createRefuelLogService(truckingLogId, {
                    gallonsRefueled,
                    milesAtFueling,
                });
                return res.status(201).json({ refuelLogs: fieldData });
            }
            case "haulingLogs": {
                const { name, quantity, createdAt } = req.body;
                if (!name || quantity === undefined) {
                    return res
                        .status(400)
                        .json({ error: "Hauling logs name and quantity are required." });
                }
                fieldData = await createHaulingLogsService(truckingLogId, {
                    name,
                    quantity,
                    createdAt,
                });
                return res.status(201).json({ haulingLogs: fieldData });
            }
            default:
                return res.status(400).json({
                    error: "Invalid field parameter. Allowed: equipmentHauled, material, stateMileage, refuelLogs, haulingLogs",
                });
        }
    }
    catch (error) {
        console.error("Error creating trucking logs:", error);
        return res.status(500).json({ error: "Internal server error." });
    }
}
export async function updateTruckingLogsController(req, res) {
    try {
        const { id } = req.params;
        const { field } = req.query;
        if (!id) {
            return res.status(400).json({ error: "Trucking Log ID is required." });
        }
        if (!field) {
            return res.status(400).json({ error: "Field parameter is required." });
        }
        let result;
        switch (field) {
            case "endingMileage": {
                const { endingMileage } = req.body;
                if (endingMileage === undefined) {
                    return res
                        .status(400)
                        .json({ error: "endingMileage value is required." });
                }
                result = await updateTruckingLogEndingMileageService(id, endingMileage);
                return res.json(result);
            }
            case "startingMileage": {
                const { startingMileage } = req.body;
                if (startingMileage === undefined) {
                    return res
                        .status(400)
                        .json({ error: "startingMileage value is required." });
                }
                result = await updateTruckingLogStartingMileageService(id, startingMileage);
                return res.json(result);
            }
            case "notes": {
                const { notes } = req.body;
                if (notes === undefined) {
                    return res.status(400).json({ error: "notes value is required." });
                }
                result = await updateTruckingLogNotesService(id, notes);
                return res.json(result);
            }
            case "equipmentHauled": {
                const { equipmentHauledId, equipmentId, source, destination, startMileage, endMileage, } = req.body;
                if (!equipmentHauledId) {
                    return res
                        .status(400)
                        .json({ error: "equipmentHauledId is required." });
                }
                result = await updateEquipmentHauledService(equipmentHauledId, {
                    equipmentId,
                    source,
                    destination,
                    startMileage,
                    endMileage,
                });
                return res.json(result);
            }
            case "stateMileage": {
                const { stateMileageId, state, stateLineMileage } = req.body;
                if (!stateMileageId) {
                    return res.status(400).json({ error: "stateMileageId is required." });
                }
                result = await updateStateMileageService(stateMileageId, {
                    state,
                    stateLineMileage,
                });
                return res.json(result);
            }
            case "refuelLogs": {
                const { refuelLogId, gallonsRefueled, milesAtFueling } = req.body;
                if (!refuelLogId) {
                    return res.status(400).json({ error: "refuelLogId is required." });
                }
                result = await updateRefuelLogService(refuelLogId, {
                    gallonsRefueled,
                    milesAtFueling,
                });
                return res.json(result);
            }
            case "material": {
                const { materialId, name, quantity, LocationOfMaterial, unit, loadType, } = req.body;
                if (!materialId) {
                    return res.status(400).json({ error: "materialId is required." });
                }
                result = await updateMaterialService(materialId, {
                    name,
                    quantity,
                    LocationOfMaterial,
                    unit,
                    loadType,
                });
                return res.json(result);
            }
            default:
                return res.status(400).json({
                    error: "Invalid field parameter. Allowed: endingMileage, startingMileage, notes, equipmentHauled, stateMileage, refuelLogs, material",
                });
        }
    }
    catch (error) {
        console.error("Error updating trucking log:", error);
        return res.status(500).json({ error: "Internal server error." });
    }
}
export async function deleteTruckingLogController(req, res) {
    try {
        const { id } = req.params;
        const { field } = req.query;
        const { resourceId } = req.body;
        if (!id || !resourceId) {
            return res
                .status(400)
                .json({ error: "Trucking Log ID and resourceId are required." });
        }
        if (!field) {
            return res.status(400).json({ error: "Field parameter is required." });
        }
        switch (field) {
            case "equipmentHauled":
                await deleteEquipmentHauledService(resourceId);
                return res.status(204).send();
            case "material":
                await deleteMaterialService(resourceId);
                return res.status(204).send();
            case "stateMileage":
                await deleteStateMileageService(resourceId);
                return res.status(204).send();
            case "refuelLogs":
                await deleteRefuelLogService(resourceId);
                return res.status(204).send();
            default:
                return res.status(400).json({
                    error: "Invalid field parameter. Allowed: equipmentHauled, material, stateMileage, refuelLogs",
                });
        }
    }
    catch (error) {
        console.error("Error deleting trucking log:", error);
        return res.status(500).json({ error: "Internal server error." });
    }
}
//# sourceMappingURL=truckingLogsController.js.map
//# debugId=9c2ede55-a887-5fa0-ad66-77597d7d6115
