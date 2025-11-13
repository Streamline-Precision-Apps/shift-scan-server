/**
 * TascoLog Service Layer
 * Handles all Prisma database operations for Tasco-related entities
 */
/**
 * Get a single Tasco Log by ID with all relations
 */
export declare function getTascoLogById(tascoLogId: string): Promise<({
    Equipment: {
        createdAt: Date;
        id: string;
        name: string;
        updatedAt: Date;
        qrId: string;
        description: string | null;
        creationReason: string | null;
        approvalStatus: import("../../generated/prisma/index.js").$Enums.ApprovalStatus;
        createdById: string | null;
        createdVia: import("../../generated/prisma/index.js").$Enums.CreatedVia;
        code: string | null;
        status: import("../../generated/prisma/index.js").$Enums.FormTemplateStatus;
        equipmentTag: import("../../generated/prisma/index.js").$Enums.EquipmentTags;
        state: import("../../generated/prisma/index.js").$Enums.EquipmentState;
        overWeight: boolean | null;
        currentWeight: number | null;
        acquiredDate: Date | null;
        color: string | null;
        licensePlate: string | null;
        licenseState: string | null;
        make: string | null;
        memo: string | null;
        model: string | null;
        ownershipType: import("../../generated/prisma/index.js").$Enums.OwnershipType | null;
        registrationExpiration: Date | null;
        serialNumber: string | null;
        year: string | null;
        acquiredCondition: import("../../generated/prisma/index.js").$Enums.Condition | null;
    } | null;
    TimeSheet: {
        createdAt: Date;
        id: number;
        userId: string;
        updatedAt: Date;
        sessionId: number | null;
        startTime: Date;
        endTime: Date | null;
        date: Date;
        comment: string | null;
        status: import("../../generated/prisma/index.js").$Enums.ApprovalStatus;
        jobsiteId: string;
        costcode: string;
        nu: string;
        Fp: string;
        statusComment: string | null;
        location: string | null;
        workType: import("../../generated/prisma/index.js").$Enums.WorkType;
        editedByUserId: string | null;
        newTimeSheetId: string | null;
        createdByAdmin: boolean;
        clockInLat: number | null;
        clockInLng: number | null;
        clockOutLat: number | null;
        clockOutLng: number | null;
        withinFenceIn: boolean | null;
        withinFenceOut: boolean | null;
        wasInjured: boolean | null;
    };
    RefuelLogs: {
        id: string;
        truckingLogId: string | null;
        employeeEquipmentLogId: string | null;
        tascoLogId: string | null;
        gallonsRefueled: number | null;
        milesAtFueling: number | null;
    }[];
    TascoFLoads: {
        id: number;
        screenType: import("../../generated/prisma/index.js").$Enums.LoadType | null;
        tascoLogId: string;
        weight: number | null;
    }[];
    TascoMaterialTypes: {
        id: string;
        name: string;
    } | null;
} & {
    id: string;
    laborType: string | null;
    equipmentId: string | null;
    timeSheetId: number;
    shiftType: string;
    materialType: string | null;
    LoadQuantity: number;
    screenType: import("../../generated/prisma/index.js").$Enums.LoadType | null;
}) | null>;
/**
 * Get all Tasco Logs for a timesheet
 */
export declare function getTascoLogsByTimesheet(timeSheetId: number): Promise<({
    Equipment: {
        createdAt: Date;
        id: string;
        name: string;
        updatedAt: Date;
        qrId: string;
        description: string | null;
        creationReason: string | null;
        approvalStatus: import("../../generated/prisma/index.js").$Enums.ApprovalStatus;
        createdById: string | null;
        createdVia: import("../../generated/prisma/index.js").$Enums.CreatedVia;
        code: string | null;
        status: import("../../generated/prisma/index.js").$Enums.FormTemplateStatus;
        equipmentTag: import("../../generated/prisma/index.js").$Enums.EquipmentTags;
        state: import("../../generated/prisma/index.js").$Enums.EquipmentState;
        overWeight: boolean | null;
        currentWeight: number | null;
        acquiredDate: Date | null;
        color: string | null;
        licensePlate: string | null;
        licenseState: string | null;
        make: string | null;
        memo: string | null;
        model: string | null;
        ownershipType: import("../../generated/prisma/index.js").$Enums.OwnershipType | null;
        registrationExpiration: Date | null;
        serialNumber: string | null;
        year: string | null;
        acquiredCondition: import("../../generated/prisma/index.js").$Enums.Condition | null;
    } | null;
    RefuelLogs: {
        id: string;
        truckingLogId: string | null;
        employeeEquipmentLogId: string | null;
        tascoLogId: string | null;
        gallonsRefueled: number | null;
        milesAtFueling: number | null;
    }[];
    TascoFLoads: {
        id: number;
        screenType: import("../../generated/prisma/index.js").$Enums.LoadType | null;
        tascoLogId: string;
        weight: number | null;
    }[];
    TascoMaterialTypes: {
        id: string;
        name: string;
    } | null;
} & {
    id: string;
    laborType: string | null;
    equipmentId: string | null;
    timeSheetId: number;
    shiftType: string;
    materialType: string | null;
    LoadQuantity: number;
    screenType: import("../../generated/prisma/index.js").$Enums.LoadType | null;
})[]>;
/**
 * Update Tasco Log (load quantity)
 */
export declare function updateTascoLogLoadQuantity(tascoLogId: string, loadCount: number): Promise<{
    Equipment: {
        createdAt: Date;
        id: string;
        name: string;
        updatedAt: Date;
        qrId: string;
        description: string | null;
        creationReason: string | null;
        approvalStatus: import("../../generated/prisma/index.js").$Enums.ApprovalStatus;
        createdById: string | null;
        createdVia: import("../../generated/prisma/index.js").$Enums.CreatedVia;
        code: string | null;
        status: import("../../generated/prisma/index.js").$Enums.FormTemplateStatus;
        equipmentTag: import("../../generated/prisma/index.js").$Enums.EquipmentTags;
        state: import("../../generated/prisma/index.js").$Enums.EquipmentState;
        overWeight: boolean | null;
        currentWeight: number | null;
        acquiredDate: Date | null;
        color: string | null;
        licensePlate: string | null;
        licenseState: string | null;
        make: string | null;
        memo: string | null;
        model: string | null;
        ownershipType: import("../../generated/prisma/index.js").$Enums.OwnershipType | null;
        registrationExpiration: Date | null;
        serialNumber: string | null;
        year: string | null;
        acquiredCondition: import("../../generated/prisma/index.js").$Enums.Condition | null;
    } | null;
    RefuelLogs: {
        id: string;
        truckingLogId: string | null;
        employeeEquipmentLogId: string | null;
        tascoLogId: string | null;
        gallonsRefueled: number | null;
        milesAtFueling: number | null;
    }[];
    TascoFLoads: {
        id: number;
        screenType: import("../../generated/prisma/index.js").$Enums.LoadType | null;
        tascoLogId: string;
        weight: number | null;
    }[];
    TascoMaterialTypes: {
        id: string;
        name: string;
    } | null;
} & {
    id: string;
    laborType: string | null;
    equipmentId: string | null;
    timeSheetId: number;
    shiftType: string;
    materialType: string | null;
    LoadQuantity: number;
    screenType: import("../../generated/prisma/index.js").$Enums.LoadType | null;
}>;
/**
 * Update Tasco Log comment (through TimeSheet relation)
 */
export declare function updateTascoLogComment(tascoLogId: string, comment: string): Promise<{
    Equipment: {
        createdAt: Date;
        id: string;
        name: string;
        updatedAt: Date;
        qrId: string;
        description: string | null;
        creationReason: string | null;
        approvalStatus: import("../../generated/prisma/index.js").$Enums.ApprovalStatus;
        createdById: string | null;
        createdVia: import("../../generated/prisma/index.js").$Enums.CreatedVia;
        code: string | null;
        status: import("../../generated/prisma/index.js").$Enums.FormTemplateStatus;
        equipmentTag: import("../../generated/prisma/index.js").$Enums.EquipmentTags;
        state: import("../../generated/prisma/index.js").$Enums.EquipmentState;
        overWeight: boolean | null;
        currentWeight: number | null;
        acquiredDate: Date | null;
        color: string | null;
        licensePlate: string | null;
        licenseState: string | null;
        make: string | null;
        memo: string | null;
        model: string | null;
        ownershipType: import("../../generated/prisma/index.js").$Enums.OwnershipType | null;
        registrationExpiration: Date | null;
        serialNumber: string | null;
        year: string | null;
        acquiredCondition: import("../../generated/prisma/index.js").$Enums.Condition | null;
    } | null;
    TimeSheet: {
        createdAt: Date;
        id: number;
        userId: string;
        updatedAt: Date;
        sessionId: number | null;
        startTime: Date;
        endTime: Date | null;
        date: Date;
        comment: string | null;
        status: import("../../generated/prisma/index.js").$Enums.ApprovalStatus;
        jobsiteId: string;
        costcode: string;
        nu: string;
        Fp: string;
        statusComment: string | null;
        location: string | null;
        workType: import("../../generated/prisma/index.js").$Enums.WorkType;
        editedByUserId: string | null;
        newTimeSheetId: string | null;
        createdByAdmin: boolean;
        clockInLat: number | null;
        clockInLng: number | null;
        clockOutLat: number | null;
        clockOutLng: number | null;
        withinFenceIn: boolean | null;
        withinFenceOut: boolean | null;
        wasInjured: boolean | null;
    };
    RefuelLogs: {
        id: string;
        truckingLogId: string | null;
        employeeEquipmentLogId: string | null;
        tascoLogId: string | null;
        gallonsRefueled: number | null;
        milesAtFueling: number | null;
    }[];
    TascoFLoads: {
        id: number;
        screenType: import("../../generated/prisma/index.js").$Enums.LoadType | null;
        tascoLogId: string;
        weight: number | null;
    }[];
    TascoMaterialTypes: {
        id: string;
        name: string;
    } | null;
} & {
    id: string;
    laborType: string | null;
    equipmentId: string | null;
    timeSheetId: number;
    shiftType: string;
    materialType: string | null;
    LoadQuantity: number;
    screenType: import("../../generated/prisma/index.js").$Enums.LoadType | null;
}>;
/**
 * Create a new Refuel Log for Tasco
 */
export declare function createTascoRefuelLog(tascoLogId: string): Promise<{
    id: string;
    truckingLogId: string | null;
    employeeEquipmentLogId: string | null;
    tascoLogId: string | null;
    gallonsRefueled: number | null;
    milesAtFueling: number | null;
}>;
/**
 * Get all Refuel Logs for a Tasco Log
 */
export declare function getTascoRefuelLogs(tascoLogId: string): Promise<{
    id: string;
    truckingLogId: string | null;
    employeeEquipmentLogId: string | null;
    tascoLogId: string | null;
    gallonsRefueled: number | null;
    milesAtFueling: number | null;
}[]>;
/**
 * Update Refuel Log
 */
export declare function updateTascoRefuelLog(refuelLogId: string, gallonsRefueled?: number, milesAtFueling?: number): Promise<{
    id: string;
    truckingLogId: string | null;
    employeeEquipmentLogId: string | null;
    tascoLogId: string | null;
    gallonsRefueled: number | null;
    milesAtFueling: number | null;
}>;
/**
 * Delete Refuel Log
 */
export declare function deleteTascoRefuelLog(refuelLogId: string): Promise<{
    id: string;
    truckingLogId: string | null;
    employeeEquipmentLogId: string | null;
    tascoLogId: string | null;
    gallonsRefueled: number | null;
    milesAtFueling: number | null;
}>;
/**
 * Create a new TascoFLoad
 */
export declare function createTascoFLoad(tascoLogId: string): Promise<{
    id: number;
    screenType: import("../../generated/prisma/index.js").$Enums.LoadType | null;
    tascoLogId: string;
    weight: number | null;
}>;
/**
 * Get all TascoFLoads for a Tasco Log
 */
export declare function getTascoFLoads(tascoLogId: string): Promise<{
    id: number;
    screenType: import("../../generated/prisma/index.js").$Enums.LoadType | null;
    tascoLogId: string;
    weight: number | null;
}[]>;
/**
 * Update TascoFLoad
 */
export declare function updateTascoFLoad(fLoadId: number, weight?: number | null, screenType?: string | null): Promise<{
    id: number;
    screenType: import("../../generated/prisma/index.js").$Enums.LoadType | null;
    tascoLogId: string;
    weight: number | null;
}>;
/**
 * Delete TascoFLoad
 */
export declare function deleteTascoFLoad(fLoadId: number): Promise<{
    id: number;
    screenType: import("../../generated/prisma/index.js").$Enums.LoadType | null;
    tascoLogId: string;
    weight: number | null;
}>;
/**
 * Get complete Tasco Log data including all nested relations
 */
export declare function getCompleteTascoLogData(tascoLogId: string): Promise<({
    Equipment: {
        createdAt: Date;
        id: string;
        name: string;
        updatedAt: Date;
        qrId: string;
        description: string | null;
        creationReason: string | null;
        approvalStatus: import("../../generated/prisma/index.js").$Enums.ApprovalStatus;
        createdById: string | null;
        createdVia: import("../../generated/prisma/index.js").$Enums.CreatedVia;
        code: string | null;
        status: import("../../generated/prisma/index.js").$Enums.FormTemplateStatus;
        equipmentTag: import("../../generated/prisma/index.js").$Enums.EquipmentTags;
        state: import("../../generated/prisma/index.js").$Enums.EquipmentState;
        overWeight: boolean | null;
        currentWeight: number | null;
        acquiredDate: Date | null;
        color: string | null;
        licensePlate: string | null;
        licenseState: string | null;
        make: string | null;
        memo: string | null;
        model: string | null;
        ownershipType: import("../../generated/prisma/index.js").$Enums.OwnershipType | null;
        registrationExpiration: Date | null;
        serialNumber: string | null;
        year: string | null;
        acquiredCondition: import("../../generated/prisma/index.js").$Enums.Condition | null;
    } | null;
    TimeSheet: {
        createdAt: Date;
        id: number;
        userId: string;
        updatedAt: Date;
        sessionId: number | null;
        startTime: Date;
        endTime: Date | null;
        date: Date;
        comment: string | null;
        status: import("../../generated/prisma/index.js").$Enums.ApprovalStatus;
        jobsiteId: string;
        costcode: string;
        nu: string;
        Fp: string;
        statusComment: string | null;
        location: string | null;
        workType: import("../../generated/prisma/index.js").$Enums.WorkType;
        editedByUserId: string | null;
        newTimeSheetId: string | null;
        createdByAdmin: boolean;
        clockInLat: number | null;
        clockInLng: number | null;
        clockOutLat: number | null;
        clockOutLng: number | null;
        withinFenceIn: boolean | null;
        withinFenceOut: boolean | null;
        wasInjured: boolean | null;
    };
    RefuelLogs: {
        id: string;
        truckingLogId: string | null;
        employeeEquipmentLogId: string | null;
        tascoLogId: string | null;
        gallonsRefueled: number | null;
        milesAtFueling: number | null;
    }[];
    TascoFLoads: {
        id: number;
        screenType: import("../../generated/prisma/index.js").$Enums.LoadType | null;
        tascoLogId: string;
        weight: number | null;
    }[];
    TascoMaterialTypes: {
        id: string;
        name: string;
    } | null;
} & {
    id: string;
    laborType: string | null;
    equipmentId: string | null;
    timeSheetId: number;
    shiftType: string;
    materialType: string | null;
    LoadQuantity: number;
    screenType: import("../../generated/prisma/index.js").$Enums.LoadType | null;
}) | null>;
/**
 * Delete entire Tasco Log with all relations (cascades handled by Prisma)
 */
export declare function deleteTascoLog(tascoLogId: string): Promise<{
    id: string;
    laborType: string | null;
    equipmentId: string | null;
    timeSheetId: number;
    shiftType: string;
    materialType: string | null;
    LoadQuantity: number;
    screenType: import("../../generated/prisma/index.js").$Enums.LoadType | null;
}>;
export declare function getTascoLogId(userId: string): Promise<{
    TascoLogs: {
        id: string;
    }[];
} | null>;
export declare function getTascoLogComment(tascoLogId: string): Promise<{
    TimeSheet: {
        comment: string | null;
    };
} | null>;
export declare function getTascoLogFLoad(tascoLogId: string): Promise<{
    id: number;
    screenType: import("../../generated/prisma/index.js").$Enums.LoadType | null;
    tascoLogId: string;
    weight: number | null;
}[]>;
export declare function getTascoLogLoadCount(tascoLogId: string): Promise<{
    LoadQuantity: number;
} | null>;
export declare function getTascoLogRefuelLogs(tascoLogId: string): Promise<{
    id: string;
    truckingLogId: string | null;
    employeeEquipmentLogId: string | null;
    tascoLogId: string | null;
    gallonsRefueled: number | null;
    milesAtFueling: number | null;
}[]>;
/**
 * Get the active Tasco Log for a user (from their active timesheet)
 */
export declare function getActiveTascoLogForUser(userId: string): Promise<{
    id: string;
    laborType: string | null;
    equipmentId: string | null;
    timeSheetId: number;
    shiftType: string;
    materialType: string | null;
    LoadQuantity: number;
    screenType: import("../../generated/prisma/index.js").$Enums.LoadType | null;
} | null | undefined>;
//# sourceMappingURL=tascoLogService.d.ts.map