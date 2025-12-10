export declare function getTruckingLogService(userId: string): Promise<{
    id: number;
    startTime: Date;
    TruckingLogs: {
        id: string;
    }[];
} | null>;
export declare function getTruckStartingMileage(timeSheetId: string): Promise<{
    startingMileage: number | null;
} | null>;
export declare function getTruckEndingMileage(timeSheetId: string): Promise<{
    endingMileage: number | null;
} | null>;
export declare function getTruckNotes(timeSheetId: string): Promise<string>;
export declare function getRefueledLogs(timeSheetId: string): Promise<{
    id: string;
    truckingLogId: string | null;
    employeeEquipmentLogId: string | null;
    tascoLogId: string | null;
    gallonsRefueled: number | null;
    milesAtFueling: number | null;
}[]>;
export declare function getTruckMaterial(timeSheetId: string): Promise<{
    name: string | null;
    id: string;
    createdAt: Date | null;
    truckingLogId: string;
    LocationOfMaterial: string | null;
    quantity: number | null;
    materialWeight: number | null;
    loadType: import("../../generated/prisma/index.js").$Enums.LoadType | null;
    unit: import("../../generated/prisma/index.js").$Enums.materialUnit | null;
}[]>;
export declare function getTruckEquipmentHauled(timeSheetId: string): Promise<({
    Equipment: {
        name: string;
        id: string;
    } | null;
} & {
    id: string;
    createdAt: Date;
    equipmentId: string | null;
    destination: string | null;
    truckingLogId: string | null;
    endMileage: number | null;
    startMileage: number | null;
    source: string | null;
})[]>;
export declare function getStateMileage(timeSheetId: string): Promise<{
    id: string;
    state: string | null;
    truckingLogId: string;
    stateLineMileage: number | null;
}[]>;
export declare function getAllTruckingLogData(truckingLogId: string): Promise<({
    TimeSheet: {
        comment: string | null;
    };
    EquipmentHauled: ({
        Equipment: {
            name: string;
            id: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        equipmentId: string | null;
        destination: string | null;
        truckingLogId: string | null;
        endMileage: number | null;
        startMileage: number | null;
        source: string | null;
    })[];
    Materials: {
        name: string | null;
        id: string;
        createdAt: Date | null;
        truckingLogId: string;
        LocationOfMaterial: string | null;
        quantity: number | null;
        materialWeight: number | null;
        loadType: import("../../generated/prisma/index.js").$Enums.LoadType | null;
        unit: import("../../generated/prisma/index.js").$Enums.materialUnit | null;
    }[];
    RefuelLogs: {
        id: string;
        truckingLogId: string | null;
        employeeEquipmentLogId: string | null;
        tascoLogId: string | null;
        gallonsRefueled: number | null;
        milesAtFueling: number | null;
    }[];
    StateMileages: {
        id: string;
        state: string | null;
        truckingLogId: string;
        stateLineMileage: number | null;
    }[];
} & {
    id: string;
    laborType: string;
    taskName: string | null;
    equipmentId: string | null;
    startingMileage: number | null;
    endingMileage: number | null;
    truckLaborLogId: string | null;
    trailerNumber: string | null;
    truckNumber: string | null;
    timeSheetId: number;
}) | null>;
export declare function createEquipmentHauledService(truckingLogId: string): Promise<{
    id: string;
    createdAt: Date;
    equipmentId: string | null;
    destination: string | null;
    truckingLogId: string | null;
    endMileage: number | null;
    startMileage: number | null;
    source: string | null;
}>;
export declare function createHaulingLogsService(truckingLogId: string, body: {
    name: string;
    quantity: number;
    createdAt: Date;
}): Promise<{
    name: string | null;
    id: string;
    createdAt: Date | null;
    truckingLogId: string;
    LocationOfMaterial: string | null;
    quantity: number | null;
    materialWeight: number | null;
    loadType: import("../../generated/prisma/index.js").$Enums.LoadType | null;
    unit: import("../../generated/prisma/index.js").$Enums.materialUnit | null;
}>;
export declare function editEquipmentHauledService(id: string, body: {
    truckingLogId?: string;
    source?: string | null;
    destination?: string | null;
    startMileage?: number | null;
    endMileage?: number | null;
}): Promise<{
    id: string;
    createdAt: Date;
    equipmentId: string | null;
    destination: string | null;
    truckingLogId: string | null;
    endMileage: number | null;
    startMileage: number | null;
    source: string | null;
}>;
export declare function deleteEquipmentHauledService(id: string): Promise<{
    id: string;
    createdAt: Date;
    equipmentId: string | null;
    destination: string | null;
    truckingLogId: string | null;
    endMileage: number | null;
    startMileage: number | null;
    source: string | null;
}>;
export declare function updateTruckingLogEndingMileageService(id: string, endingMileage: number): Promise<{
    id: string;
    laborType: string;
    taskName: string | null;
    equipmentId: string | null;
    startingMileage: number | null;
    endingMileage: number | null;
    truckLaborLogId: string | null;
    trailerNumber: string | null;
    truckNumber: string | null;
    timeSheetId: number;
}>;
export declare function updateTruckingLogStartingMileageService(id: string, startingMileage: number): Promise<{
    id: string;
    laborType: string;
    taskName: string | null;
    equipmentId: string | null;
    startingMileage: number | null;
    endingMileage: number | null;
    truckLaborLogId: string | null;
    trailerNumber: string | null;
    truckNumber: string | null;
    timeSheetId: number;
}>;
export declare function updateTruckingLogNotesService(id: string, notes: string): Promise<{
    TimeSheet: {
        comment: string | null;
    };
} & {
    id: string;
    laborType: string;
    taskName: string | null;
    equipmentId: string | null;
    startingMileage: number | null;
    endingMileage: number | null;
    truckLaborLogId: string | null;
    trailerNumber: string | null;
    truckNumber: string | null;
    timeSheetId: number;
}>;
export declare function updateStateMileageService(stateMileageId: string, data: {
    state?: string;
    stateLineMileage?: number;
}): Promise<{
    id: string;
    state: string | null;
    truckingLogId: string;
    stateLineMileage: number | null;
}>;
export declare function updateRefuelLogService(refuelLogId: string, data: {
    gallonsRefueled?: number;
    milesAtFueling?: number;
}): Promise<{
    id: string;
    truckingLogId: string | null;
    employeeEquipmentLogId: string | null;
    tascoLogId: string | null;
    gallonsRefueled: number | null;
    milesAtFueling: number | null;
}>;
export declare function updateMaterialService(materialId: string, data: {
    name?: string;
    quantity?: number;
    LocationOfMaterial?: string;
    unit?: string;
    loadType?: string | null;
}): Promise<{
    name: string | null;
    id: string;
    createdAt: Date | null;
    truckingLogId: string;
    LocationOfMaterial: string | null;
    quantity: number | null;
    materialWeight: number | null;
    loadType: import("../../generated/prisma/index.js").$Enums.LoadType | null;
    unit: import("../../generated/prisma/index.js").$Enums.materialUnit | null;
} | null>;
export declare function deleteStateMileageService(id: string): Promise<{
    id: string;
    state: string | null;
    truckingLogId: string;
    stateLineMileage: number | null;
}>;
export declare function deleteRefuelLogService(id: string): Promise<{
    id: string;
    truckingLogId: string | null;
    employeeEquipmentLogId: string | null;
    tascoLogId: string | null;
    gallonsRefueled: number | null;
    milesAtFueling: number | null;
}>;
export declare function deleteMaterialService(id: string): Promise<{
    name: string | null;
    id: string;
    createdAt: Date | null;
    truckingLogId: string;
    LocationOfMaterial: string | null;
    quantity: number | null;
    materialWeight: number | null;
    loadType: import("../../generated/prisma/index.js").$Enums.LoadType | null;
    unit: import("../../generated/prisma/index.js").$Enums.materialUnit | null;
}>;
export declare function createStateMileageService(truckingLogId: string, data?: {
    state?: string;
    stateLineMileage?: number;
}): Promise<{
    id: string;
    state: string | null;
    truckingLogId: string;
    stateLineMileage: number | null;
}>;
export declare function createRefuelLogService(truckingLogId: string, data?: {
    gallonsRefueled?: number;
    milesAtFueling?: number;
}): Promise<{
    id: string;
    truckingLogId: string | null;
    employeeEquipmentLogId: string | null;
    tascoLogId: string | null;
    gallonsRefueled: number | null;
    milesAtFueling: number | null;
}>;
export declare function createMaterialService(truckingLogId: string, data: {
    name: string;
    quantity: number;
    LocationOfMaterial?: string;
    unit?: string;
    loadType?: string | null;
}): Promise<{
    name: string | null;
    id: string;
    createdAt: Date | null;
    truckingLogId: string;
    LocationOfMaterial: string | null;
    quantity: number | null;
    materialWeight: number | null;
    loadType: import("../../generated/prisma/index.js").$Enums.LoadType | null;
    unit: import("../../generated/prisma/index.js").$Enums.materialUnit | null;
}>;
export declare function updateEquipmentHauledService(equipmentHauledId: string, data: {
    equipmentId?: string;
    source?: string | null;
    destination?: string | null;
    startMileage?: number | null;
    endMileage?: number | null;
}): Promise<{
    Equipment: {
        name: string;
        id: string;
    } | null;
} & {
    id: string;
    createdAt: Date;
    equipmentId: string | null;
    destination: string | null;
    truckingLogId: string | null;
    endMileage: number | null;
    startMileage: number | null;
    source: string | null;
}>;
//# sourceMappingURL=truckingLogService.d.ts.map