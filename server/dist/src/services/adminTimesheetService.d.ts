import type { Prisma } from "../../generated/prisma/index.js";
interface FilterOptions {
    jobsiteId: string[];
    costCode: string[];
    equipmentId: string[];
    equipmentLogTypes: string[];
    status: string[];
    changes: string[];
    id: string[];
    notificationId: string[];
    dateRange: {
        from?: Date | undefined;
        to?: Date | undefined;
    };
}
interface GetAllTimesheetsParams {
    status: string;
    page: number;
    pageSize: number;
    skip: number;
    search: string;
    filters: FilterOptions;
}
export declare function getAllTimesheets(params: GetAllTimesheetsParams): Promise<{
    timesheets: {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        User: {
            id: string;
            firstName: string;
            lastName: string;
        };
        Jobsite: {
            name: string;
            id: string;
            code: string | null;
        };
        _count: {
            ChangeLogs: number;
        };
        comment: string | null;
        status: import("../../generated/prisma/index.js").$Enums.ApprovalStatus;
        CostCode: {
            name: string;
            id: string;
            code: string | null;
        };
        startTime: Date;
        endTime: Date | null;
        date: Date;
        EmployeeEquipmentLogs: {
            id: string;
            Equipment: {
                name: string;
                id: string;
            } | null;
            startTime: Date;
            endTime: Date | null;
            equipmentId: string | null;
        }[];
        TascoLogs: {
            shiftType: string;
            LoadQuantity: number;
        }[];
        nu: string;
        Fp: string;
        workType: import("../../generated/prisma/index.js").$Enums.WorkType;
        TruckingLogs: {
            startingMileage: number | null;
            endingMileage: number | null;
            truckNumber: string | null;
            RefuelLogs: {
                milesAtFueling: number | null;
            }[];
        }[];
    }[];
    total: number;
    totalPages: number;
    page: number | undefined;
    pageSize: number | undefined;
    pendingTimesheets: number;
}>;
export declare function getTimesheetById(id: string | undefined): Promise<({
    User: {
        id: string;
        firstName: string;
        lastName: string;
    };
    Jobsite: {
        name: string;
        id: string;
        code: string | null;
    };
    CostCode: {
        name: string;
        id: string;
        code: string | null;
    };
    Maintenance: ({
        Equipment: {
            name: string;
            id: string;
        };
    } & {
        id: number;
        description: string | null;
        equipmentId: string;
        timeSheetId: number;
        hours: number | null;
    })[];
    EmployeeEquipmentLogs: ({
        Equipment: {
            name: string;
            id: string;
        } | null;
    } & {
        id: string;
        comment: string | null;
        startTime: Date;
        endTime: Date | null;
        equipmentId: string | null;
        timeSheetId: number;
        maintenanceId: string | null;
        rental: boolean;
    })[];
    TascoLogs: ({
        Equipment: {
            name: string;
            id: string;
        } | null;
        TascoFLoads: {
            id: number;
            screenType: import("../../generated/prisma/index.js").$Enums.LoadType | null;
            tascoLogId: string;
            weight: number | null;
        }[];
        RefuelLogs: {
            id: string;
            truckingLogId: string | null;
            employeeEquipmentLogId: string | null;
            tascoLogId: string | null;
            gallonsRefueled: number | null;
            milesAtFueling: number | null;
        }[];
    } & {
        id: string;
        laborType: string | null;
        equipmentId: string | null;
        timeSheetId: number;
        shiftType: string;
        materialType: string | null;
        LoadQuantity: number;
        screenType: import("../../generated/prisma/index.js").$Enums.LoadType | null;
    })[];
    ChangeLogs: ({
        User: {
            id: string;
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
    })[];
    TruckingLogs: ({
        Equipment: {
            name: string;
            id: string;
        } | null;
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
        Trailer: {
            name: string;
            id: string;
        } | null;
        Truck: {
            name: string;
            id: string;
        } | null;
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
    })[];
} & {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    comment: string | null;
    status: import("../../generated/prisma/index.js").$Enums.ApprovalStatus;
    userId: string;
    sessionId: number | null;
    startTime: Date;
    endTime: Date | null;
    date: Date;
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
export declare function getTimesheetChangeLogs(timesheetId: string | undefined): Promise<({
    User: {
        id: string;
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
})[]>;
export declare function createTimesheet(payload: any): Promise<{
    User: {
        id: string;
        companyId: string;
        firstName: string;
        lastName: string;
        username: string;
        email: string | null;
        password: string;
        signature: string | null;
        DOB: Date | null;
        truckView: boolean;
        tascoView: boolean;
        laborView: boolean;
        mechanicView: boolean;
        permission: import("../../generated/prisma/index.js").$Enums.Permission;
        image: string | null;
        startDate: Date | null;
        terminationDate: Date | null;
        accountSetup: boolean;
        clockedIn: boolean;
        passwordResetTokenId: string | null;
        workTypeId: string | null;
        middleName: string | null;
        secondLastName: string | null;
        lastSeen: Date | null;
    };
    Jobsite: {
        name: string;
        id: string;
        addressId: string | null;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        qrId: string;
        creationReason: string | null;
        approvalStatus: import("../../generated/prisma/index.js").$Enums.ApprovalStatus;
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
    CostCode: {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        code: string | null;
    };
} & {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    comment: string | null;
    status: import("../../generated/prisma/index.js").$Enums.ApprovalStatus;
    userId: string;
    sessionId: number | null;
    startTime: Date;
    endTime: Date | null;
    date: Date;
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
export declare function updateTimesheet(id: string | undefined, updateData: {
    data: any;
    originalData: any;
    changes: Record<string, {
        old: unknown;
        new: unknown;
    }>;
    editorId: string;
    changeReason: string;
    wasStatusChanged: boolean;
    numberOfChanges: number;
}): Promise<{
    success: boolean;
    onlyStatusUpdated: boolean;
    editorFullName: string;
    userFullname: string;
}>;
export declare function updateTimesheetStatus(id: string | undefined, status: string, changes: Record<string, {
    old: unknown;
    new: unknown;
}>, userId: string): Promise<void>;
export declare function deleteTimesheet(id: string | undefined): Promise<void>;
export declare function exportTimesheets(timesheetIds: number[], fields: string[], dateRange?: {
    from?: Date;
    to?: Date;
}, filters?: {
    users?: string[];
    crews?: string[];
    profitCenters?: string[];
}): Promise<{
    timesheets: ({
        User: {
            id: string;
            companyId: string;
            firstName: string;
            lastName: string;
            username: string;
            email: string | null;
            password: string;
            signature: string | null;
            DOB: Date | null;
            truckView: boolean;
            tascoView: boolean;
            laborView: boolean;
            mechanicView: boolean;
            permission: import("../../generated/prisma/index.js").$Enums.Permission;
            image: string | null;
            startDate: Date | null;
            terminationDate: Date | null;
            accountSetup: boolean;
            clockedIn: boolean;
            passwordResetTokenId: string | null;
            workTypeId: string | null;
            middleName: string | null;
            secondLastName: string | null;
            lastSeen: Date | null;
        };
        Jobsite: {
            name: string;
            id: string;
            addressId: string | null;
            createdAt: Date;
            updatedAt: Date;
            description: string;
            qrId: string;
            creationReason: string | null;
            approvalStatus: import("../../generated/prisma/index.js").$Enums.ApprovalStatus;
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
        CostCode: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            isActive: boolean;
            code: string | null;
        };
        Maintenance: ({
            Equipment: {
                model: string | null;
                name: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                state: import("../../generated/prisma/index.js").$Enums.EquipmentState;
                qrId: string;
                creationReason: string | null;
                approvalStatus: import("../../generated/prisma/index.js").$Enums.ApprovalStatus;
                createdById: string | null;
                createdVia: import("../../generated/prisma/index.js").$Enums.CreatedVia;
                code: string | null;
                status: import("../../generated/prisma/index.js").$Enums.FormTemplateStatus;
                equipmentTag: import("../../generated/prisma/index.js").$Enums.EquipmentTags;
                overWeight: boolean | null;
                currentWeight: number | null;
                acquiredDate: Date | null;
                color: string | null;
                licensePlate: string | null;
                licenseState: string | null;
                make: string | null;
                memo: string | null;
                ownershipType: import("../../generated/prisma/index.js").$Enums.OwnershipType | null;
                registrationExpiration: Date | null;
                serialNumber: string | null;
                year: string | null;
                acquiredCondition: import("../../generated/prisma/index.js").$Enums.Condition | null;
            };
        } & {
            id: number;
            description: string | null;
            equipmentId: string;
            timeSheetId: number;
            hours: number | null;
        })[];
        EmployeeEquipmentLogs: ({
            Equipment: {
                model: string | null;
                name: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                state: import("../../generated/prisma/index.js").$Enums.EquipmentState;
                qrId: string;
                creationReason: string | null;
                approvalStatus: import("../../generated/prisma/index.js").$Enums.ApprovalStatus;
                createdById: string | null;
                createdVia: import("../../generated/prisma/index.js").$Enums.CreatedVia;
                code: string | null;
                status: import("../../generated/prisma/index.js").$Enums.FormTemplateStatus;
                equipmentTag: import("../../generated/prisma/index.js").$Enums.EquipmentTags;
                overWeight: boolean | null;
                currentWeight: number | null;
                acquiredDate: Date | null;
                color: string | null;
                licensePlate: string | null;
                licenseState: string | null;
                make: string | null;
                memo: string | null;
                ownershipType: import("../../generated/prisma/index.js").$Enums.OwnershipType | null;
                registrationExpiration: Date | null;
                serialNumber: string | null;
                year: string | null;
                acquiredCondition: import("../../generated/prisma/index.js").$Enums.Condition | null;
            } | null;
        } & {
            id: string;
            comment: string | null;
            startTime: Date;
            endTime: Date | null;
            equipmentId: string | null;
            timeSheetId: number;
            maintenanceId: string | null;
            rental: boolean;
        })[];
        TascoLogs: ({
            Equipment: {
                model: string | null;
                name: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                state: import("../../generated/prisma/index.js").$Enums.EquipmentState;
                qrId: string;
                creationReason: string | null;
                approvalStatus: import("../../generated/prisma/index.js").$Enums.ApprovalStatus;
                createdById: string | null;
                createdVia: import("../../generated/prisma/index.js").$Enums.CreatedVia;
                code: string | null;
                status: import("../../generated/prisma/index.js").$Enums.FormTemplateStatus;
                equipmentTag: import("../../generated/prisma/index.js").$Enums.EquipmentTags;
                overWeight: boolean | null;
                currentWeight: number | null;
                acquiredDate: Date | null;
                color: string | null;
                licensePlate: string | null;
                licenseState: string | null;
                make: string | null;
                memo: string | null;
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
        } & {
            id: string;
            laborType: string | null;
            equipmentId: string | null;
            timeSheetId: number;
            shiftType: string;
            materialType: string | null;
            LoadQuantity: number;
            screenType: import("../../generated/prisma/index.js").$Enums.LoadType | null;
        })[];
        TruckingLogs: ({
            Equipment: {
                model: string | null;
                name: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                state: import("../../generated/prisma/index.js").$Enums.EquipmentState;
                qrId: string;
                creationReason: string | null;
                approvalStatus: import("../../generated/prisma/index.js").$Enums.ApprovalStatus;
                createdById: string | null;
                createdVia: import("../../generated/prisma/index.js").$Enums.CreatedVia;
                code: string | null;
                status: import("../../generated/prisma/index.js").$Enums.FormTemplateStatus;
                equipmentTag: import("../../generated/prisma/index.js").$Enums.EquipmentTags;
                overWeight: boolean | null;
                currentWeight: number | null;
                acquiredDate: Date | null;
                color: string | null;
                licensePlate: string | null;
                licenseState: string | null;
                make: string | null;
                memo: string | null;
                ownershipType: import("../../generated/prisma/index.js").$Enums.OwnershipType | null;
                registrationExpiration: Date | null;
                serialNumber: string | null;
                year: string | null;
                acquiredCondition: import("../../generated/prisma/index.js").$Enums.Condition | null;
            } | null;
            EquipmentHauled: ({
                Equipment: {
                    model: string | null;
                    name: string;
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    description: string | null;
                    state: import("../../generated/prisma/index.js").$Enums.EquipmentState;
                    qrId: string;
                    creationReason: string | null;
                    approvalStatus: import("../../generated/prisma/index.js").$Enums.ApprovalStatus;
                    createdById: string | null;
                    createdVia: import("../../generated/prisma/index.js").$Enums.CreatedVia;
                    code: string | null;
                    status: import("../../generated/prisma/index.js").$Enums.FormTemplateStatus;
                    equipmentTag: import("../../generated/prisma/index.js").$Enums.EquipmentTags;
                    overWeight: boolean | null;
                    currentWeight: number | null;
                    acquiredDate: Date | null;
                    color: string | null;
                    licensePlate: string | null;
                    licenseState: string | null;
                    make: string | null;
                    memo: string | null;
                    ownershipType: import("../../generated/prisma/index.js").$Enums.OwnershipType | null;
                    registrationExpiration: Date | null;
                    serialNumber: string | null;
                    year: string | null;
                    acquiredCondition: import("../../generated/prisma/index.js").$Enums.Condition | null;
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
            Trailer: {
                model: string | null;
                name: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                state: import("../../generated/prisma/index.js").$Enums.EquipmentState;
                qrId: string;
                creationReason: string | null;
                approvalStatus: import("../../generated/prisma/index.js").$Enums.ApprovalStatus;
                createdById: string | null;
                createdVia: import("../../generated/prisma/index.js").$Enums.CreatedVia;
                code: string | null;
                status: import("../../generated/prisma/index.js").$Enums.FormTemplateStatus;
                equipmentTag: import("../../generated/prisma/index.js").$Enums.EquipmentTags;
                overWeight: boolean | null;
                currentWeight: number | null;
                acquiredDate: Date | null;
                color: string | null;
                licensePlate: string | null;
                licenseState: string | null;
                make: string | null;
                memo: string | null;
                ownershipType: import("../../generated/prisma/index.js").$Enums.OwnershipType | null;
                registrationExpiration: Date | null;
                serialNumber: string | null;
                year: string | null;
                acquiredCondition: import("../../generated/prisma/index.js").$Enums.Condition | null;
            } | null;
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
        })[];
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        comment: string | null;
        status: import("../../generated/prisma/index.js").$Enums.ApprovalStatus;
        userId: string;
        sessionId: number | null;
        startTime: Date;
        endTime: Date | null;
        date: Date;
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
    fields: string[];
}>;
export declare function getAllTascoMaterialTypes(): Promise<{
    materialTypes: {
        name: string;
        id: string;
    }[];
    total: number;
}>;
/**
 * Check timesheet status and resolve associated notification
 * If timesheet is already approved/rejected, create notification response
 */
export declare function resolveTimecardNotification(timesheetId: string, notificationId: number, userId: string): Promise<{
    success: boolean;
    alreadyResolved: boolean;
    status: "APPROVED" | "REJECTED";
    resolved?: never;
} | {
    success: boolean;
    resolved: boolean;
    status: "APPROVED" | "REJECTED";
    alreadyResolved?: never;
} | {
    success: boolean;
    resolved: boolean;
    status: "DRAFT" | "PENDING";
    alreadyResolved?: never;
}>;
export {};
//# sourceMappingURL=adminTimesheetService.d.ts.map