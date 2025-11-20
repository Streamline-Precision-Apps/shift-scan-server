import type { EquipmentState, Prisma } from "../../generated/prisma/client.js";
import type { GeneralTimesheetInput, MechanicTimesheetInput, TascoTimesheetInput, TruckTimesheetInput } from "../controllers/timesheetController.js";
export declare function updateTimesheetService({ id, editorId, changes, changeReason, numberOfChanges, startTime, endTime, Jobsite, CostCode, comment, }: {
    id: number;
    editorId: string;
    changes: string;
    changeReason?: string;
    numberOfChanges?: number;
    startTime: string;
    endTime?: string;
    Jobsite?: string;
    CostCode?: string;
    comment?: string;
}): Promise<{
    success: boolean;
    timesheet: {
        Jobsite: {
            createdAt: Date;
            id: string;
            name: string;
            updatedAt: Date;
            qrId: string;
            description: string;
            creationReason: string | null;
            approvalStatus: import("../../generated/prisma/index.js").$Enums.ApprovalStatus;
            addressId: string | null;
            comment: string | null;
            archiveDate: Date | null;
            createdById: string | null;
            createdVia: import("../../generated/prisma/index.js").$Enums.CreatedVia;
            code: string | null;
            latitude: number | null;
            longitude: number | null;
            radiusMeters: number | null;
            status: import("../../generated/prisma/index.js").$Enums.FormTemplateStatus;
        };
        User: {
            firstName: string;
            lastName: string;
        };
        CostCode: {
            createdAt: Date;
            id: string;
            name: string;
            updatedAt: Date;
            code: string | null;
            isActive: boolean;
        };
        ChangeLogs: {
            id: string;
            timeSheetId: number;
            changedBy: string;
            changedAt: Date;
            changeReason: string | null;
            changes: Prisma.JsonValue;
            wasStatusChange: boolean;
            numberOfChanges: number;
        }[];
    } & {
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
    editorLog: ({
        User: {
            firstName: string;
            lastName: string;
        };
    } & {
        id: string;
        timeSheetId: number;
        changedBy: string;
        changedAt: Date;
        changeReason: string | null;
        changes: Prisma.JsonValue;
        wasStatusChange: boolean;
        numberOfChanges: number;
    }) | null;
    userFullname: string;
    editorFullName: string;
    error?: never;
} | {
    error: string;
    success?: never;
    timesheet?: never;
    editorLog?: never;
    userFullname?: never;
    editorFullName?: never;
}>;
export declare function getUserTimesheetsByDate({ employeeId, dateParam, }: {
    employeeId: string;
    dateParam?: string | undefined;
}): Promise<{
    id: number;
    Jobsite: {
        name: string;
    };
    startTime: Date;
    endTime: Date | null;
    status: import("../../generated/prisma/index.js").$Enums.ApprovalStatus;
    workType: import("../../generated/prisma/index.js").$Enums.WorkType;
    CostCode: {
        name: string;
    };
}[]>;
export declare function getTimesheetDetailsManager({ timesheetId, }: {
    timesheetId: number;
}): Promise<{
    id: number;
    Jobsite: {
        id: string;
        name: string;
    };
    startTime: Date;
    endTime: Date | null;
    comment: string | null;
    CostCode: {
        id: string;
        name: string;
    };
} | null>;
export declare function getManagerCrewTimesheets({ managerId, }: {
    managerId: string;
}): Promise<{
    id: string;
    firstName: string;
    lastName: string;
    clockedIn: boolean;
    TimeSheets: {
        id: number;
        Jobsite: {
            name: string;
        };
        startTime: Date;
        endTime: Date | null;
        date: Date;
        status: import("../../generated/prisma/index.js").$Enums.ApprovalStatus;
        EmployeeEquipmentLogs: {
            id: string;
            Equipment: {
                id: string;
                name: string;
            } | null;
            startTime: Date;
            endTime: Date | null;
            RefuelLog: {
                id: string;
                gallonsRefueled: number | null;
            } | null;
        }[];
        TascoLogs: {
            id: string;
            Equipment: {
                id: string;
                name: string;
            } | null;
            laborType: string | null;
            RefuelLogs: {
                id: string;
                gallonsRefueled: number | null;
                TascoLog: {
                    Equipment: {
                        name: string;
                    } | null;
                } | null;
            }[];
            shiftType: string;
            materialType: string | null;
            LoadQuantity: number;
        }[];
        jobsiteId: string;
        workType: import("../../generated/prisma/index.js").$Enums.WorkType;
        CostCode: {
            name: string;
        };
        TruckingLogs: {
            id: string;
            Equipment: {
                id: string;
                name: string;
            } | null;
            EquipmentHauled: {
                id: string;
                Equipment: {
                    name: string;
                } | null;
                destination: string | null;
                source: string | null;
            }[];
            laborType: string;
            startingMileage: number | null;
            endingMileage: number | null;
            Materials: {
                id: string;
                name: string | null;
                LocationOfMaterial: string | null;
                quantity: number | null;
                materialWeight: number | null;
                loadType: import("../../generated/prisma/index.js").$Enums.LoadType | null;
                unit: import("../../generated/prisma/index.js").$Enums.materialUnit | null;
            }[];
            RefuelLogs: {
                id: string;
                TruckingLog: {
                    Equipment: {
                        name: string;
                    } | null;
                } | null;
                gallonsRefueled: number | null;
                milesAtFueling: number | null;
            }[];
            StateMileages: {
                id: string;
                state: string | null;
                TruckingLog: {
                    Equipment: {
                        name: string;
                    } | null;
                };
                stateLineMileage: number | null;
            }[];
            Trailer: {
                id: string;
                name: string;
            } | null;
            Truck: {
                id: string;
                name: string;
            } | null;
        }[];
    }[];
    Crews: {
        id: string;
        leadId: string;
    }[];
}[]>;
export declare function approveTimesheetsBatchService({ userId, timesheetIds, statusComment, editorId, }: {
    userId: string;
    timesheetIds: number[];
    statusComment: string;
    editorId: string;
}): Promise<{
    success: boolean;
    error?: never;
} | {
    success: boolean;
    error: string;
}>;
export declare function createGeneralTimesheetService({ data, type, }: {
    data: GeneralTimesheetInput;
    type?: string;
}): Promise<{
    User: {
        firstName: string;
        lastName: string;
    };
} & {
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
}>;
export declare function createMechanicTimesheetService({ data, type, }: {
    data: MechanicTimesheetInput;
    type?: string;
}): Promise<{
    User: {
        firstName: string;
        lastName: string;
    };
} & {
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
}>;
export declare function createTruckDriverTimesheetService({ data, type, }: {
    data: TruckTimesheetInput;
    type?: string;
}): Promise<{
    User: {
        firstName: string;
        lastName: string;
    };
} & {
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
}>;
export declare function createTascoTimesheetService({ data, type, }: {
    data: TascoTimesheetInput;
    type?: string;
}): Promise<{
    User: {
        firstName: string;
        lastName: string;
    };
} & {
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
}>;
export declare function getRecentTimeSheetForUser(userId: string): Promise<{
    id: number;
    endTime: Date | null;
} | null>;
export declare function getTimesheetActiveStatus({ userId }: {
    userId: string;
}): Promise<{
    hasActiveTimesheet: boolean;
    timesheetId: number | null;
}>;
export declare function getBannerDataForTimesheet(timesheetId: number, userId: string): Promise<{
    id: number;
    startTime: Date;
    jobsite: {
        id: string;
        qrId: string;
        name: string;
    } | null;
    costCode: {
        id: string;
        name: string;
    } | null;
    tascoLogs: {
        laborType: string | null;
        shiftType: string;
        equipment: {
            name: string;
            qrId: string;
        } | {
            qrId: null;
            name: string;
        };
    }[];
    truckingLogs: {
        laborType: string;
        equipment: {
            name: string;
            qrId: string;
        } | {
            qrId: null;
            name: string;
        };
    }[];
    employeeEquipmentLogs: {
        id: string;
        startTime: Date;
        endTime: Date | null;
        equipment: {
            id: string;
            name: string;
        } | {
            id: null;
            name: string;
        };
    }[];
}>;
type EquipmentLog = {
    id: string;
    type: "equipment";
    userId: string;
    equipment: {
        id: string;
        qrId: string;
        name: string;
    } | null;
};
type MaintenanceLog = {
    id: string;
    type: "mechanic";
    maintenanceId: string;
    userId: string;
    submitted: boolean;
};
type TruckingLog = {
    id: string;
    laborType: string;
    endingMileage: number | null;
    stateMileage: boolean;
    refueled: boolean;
    material: boolean;
    equipmentHauled: boolean;
};
type TascoLog = {
    id: string;
    shiftType: string | null;
    laborType: string | null;
    loadQuantity: number | null;
    refueled: boolean;
    fLoads: boolean;
};
export declare function getLogsForDashboard(userId: string): Promise<(EquipmentLog | MaintenanceLog | TruckingLog | TascoLog)[]>;
export declare function getClockOutComment(userId: string): Promise<string>;
export declare function getEquipmentLogs(userId: string, timesheetId: number): Promise<({
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
} & {
    id: string;
    startTime: Date;
    endTime: Date | null;
    comment: string | null;
    equipmentId: string | null;
    timeSheetId: number;
    maintenanceId: string | null;
    rental: boolean;
})[]>;
export declare function getRecentJobDetails(userId: string): Promise<{
    id: string;
    name: string;
    qrId: string;
}>;
export declare function createEmployeeEquipmentLogService({ equipmentId, timeSheetId, endTime, comment, }: {
    equipmentId: string;
    timeSheetId: string;
    endTime?: string | null;
    comment?: string | null;
}): Promise<{
    id: string;
    startTime: Date;
    endTime: Date | null;
    comment: string | null;
    equipmentId: string | null;
    timeSheetId: number;
    maintenanceId: string | null;
    rental: boolean;
}>;
export declare function getEmployeeEquipmentLogDetails(logId: string): Promise<{
    id: string;
    Equipment: {
        id: string;
        name: string;
        equipmentTag: import("../../generated/prisma/index.js").$Enums.EquipmentTags;
        state: import("../../generated/prisma/index.js").$Enums.EquipmentState;
        licensePlate: string | null;
        make: string | null;
        model: string | null;
        year: string | null;
    } | null;
    startTime: Date;
    endTime: Date | null;
    comment: string | null;
    Maintenance: {
        id: string;
        equipmentIssue: string | null;
        additionalInfo: string | null;
    } | null;
    equipmentId: string | null;
    RefuelLog: {
        id: string;
        gallonsRefueled: number | null;
    } | null;
} | null>;
export declare function deleteEmployeeEquipmentLog(logId: string): Promise<{
    success: boolean;
    error?: never;
} | {
    success: boolean;
    error: string;
}>;
export declare function updateEmployeeEquipmentLogService({ id, equipmentId, startTime, endTime, comment, status, disconnectRefuelLog, refuelLogId, gallonsRefueled, }: {
    id: string;
    equipmentId: string;
    startTime: string;
    endTime?: string;
    comment?: string;
    status?: EquipmentState;
    disconnectRefuelLog?: boolean;
    refuelLogId?: string | null;
    gallonsRefueled?: number | null;
}): Promise<{
    success: boolean;
    message: string;
    data: {
        name: string | null;
        id: string | null;
        createdBy: string | null;
    };
}>;
export declare function getClockOutDetailsService(userId: string): Promise<{
    timesheets: ({
        Jobsite: {
            createdAt: Date;
            id: string;
            name: string;
            updatedAt: Date;
            qrId: string;
            description: string;
            creationReason: string | null;
            approvalStatus: import("../../generated/prisma/index.js").$Enums.ApprovalStatus;
            addressId: string | null;
            comment: string | null;
            archiveDate: Date | null;
            createdById: string | null;
            createdVia: import("../../generated/prisma/index.js").$Enums.CreatedVia;
            code: string | null;
            latitude: number | null;
            longitude: number | null;
            radiusMeters: number | null;
            status: import("../../generated/prisma/index.js").$Enums.FormTemplateStatus;
        };
        TascoLogs: {
            id: string;
            laborType: string | null;
            equipmentId: string | null;
            timeSheetId: number;
            shiftType: string;
            materialType: string | null;
            LoadQuantity: number;
            screenType: import("../../generated/prisma/index.js").$Enums.LoadType | null;
        }[];
        TruckingLogs: {
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
        }[];
    } & {
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
    })[];
    signature: string;
    comment: string;
}>;
export declare function updateClockOutService(timeSheetId: string, userId: string, endTime: string, timeSheetComments?: string, wasInjured?: boolean, clockOutLat?: number, clockOutLong?: number): Promise<{
    success: boolean;
    data: {
        User: {
            firstName: string;
            lastName: string;
        };
    } & {
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
    error?: never;
} | {
    success: boolean;
    error: string;
    data?: never;
}>;
export declare function getPreviousTimesheet(userId: string): Promise<{
    id: number;
    endTime: Date | null;
} | null>;
export declare function getContinueTimesheetService(id: number, userId: string): Promise<({
    Jobsite: {
        id: string;
        name: string;
        qrId: string;
    };
    TascoLogs: {
        Equipment: {
            name: string;
            qrId: string;
        } | null;
        laborType: string | null;
        shiftType: string;
        materialType: string | null;
    }[];
    CostCode: {
        id: string;
        name: string;
    };
    TruckingLogs: {
        Equipment: {
            name: string;
            qrId: string;
        } | null;
        laborType: string;
        startingMileage: number | null;
        truckNumber: string | null;
    }[];
} & {
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
}) | null>;
export declare function returnToPreviousTimesheetService(id: number): Promise<{
    id: number;
    Jobsite: {
        id: string;
        name: string;
        qrId: string;
    };
    TascoLogs: {
        Equipment: {
            id: string;
            name: string;
            qrId: string;
        } | null;
        laborType: string | null;
        shiftType: string;
        materialType: string | null;
    }[];
    workType: import("../../generated/prisma/index.js").$Enums.WorkType;
    CostCode: {
        id: string;
        name: string;
    };
    TruckingLogs: {
        Equipment: {
            name: string;
            qrId: string;
        } | null;
        laborType: string;
        startingMileage: number | null;
    }[];
} | null>;
/**
 * Delete a refuel log for equipment logs
 */
export declare function deleteRefuelLogService(refuelLogId: string): Promise<{
    success: boolean;
    message: string;
    data: {
        id: string;
        truckingLogId: string | null;
        employeeEquipmentLogId: string | null;
        tascoLogId: string | null;
        gallonsRefueled: number | null;
        milesAtFueling: number | null;
    };
}>;
export {};
//# sourceMappingURL=timesheetService.d.ts.map