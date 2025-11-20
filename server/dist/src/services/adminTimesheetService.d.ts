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
        createdAt: Date;
        id: number;
        updatedAt: Date;
        _count: {
            ChangeLogs: number;
        };
        Jobsite: {
            id: string;
            name: string;
            code: string | null;
        };
        User: {
            id: string;
            firstName: string;
            lastName: string;
        };
        startTime: Date;
        endTime: Date | null;
        date: Date;
        comment: string | null;
        status: import("../../generated/prisma/index.js").$Enums.ApprovalStatus;
        EmployeeEquipmentLogs: {
            id: string;
            Equipment: {
                id: string;
                name: string;
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
        CostCode: {
            id: string;
            name: string;
            code: string | null;
        };
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
    Jobsite: {
        id: string;
        name: string;
        code: string | null;
    };
    User: {
        id: string;
        firstName: string;
        lastName: string;
    };
    EmployeeEquipmentLogs: ({
        Equipment: {
            id: string;
            name: string;
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
    })[];
    TascoLogs: ({
        Equipment: {
            id: string;
            name: string;
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
    Maintenance: ({
        Equipment: {
            id: string;
            name: string;
        };
    } & {
        id: number;
        description: string | null;
        equipmentId: string;
        timeSheetId: number;
        hours: number | null;
    })[];
    CostCode: {
        id: string;
        name: string;
        code: string | null;
    };
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
            id: string;
            name: string;
        } | null;
        EquipmentHauled: ({
            Equipment: {
                id: string;
                name: string;
            } | null;
        } & {
            createdAt: Date;
            id: string;
            equipmentId: string | null;
            destination: string | null;
            truckingLogId: string | null;
            endMileage: number | null;
            startMileage: number | null;
            source: string | null;
        })[];
        Materials: {
            createdAt: Date | null;
            id: string;
            name: string | null;
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
            id: string;
            name: string;
        } | null;
        Truck: {
            id: string;
            name: string;
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
        id: string;
        email: string | null;
        username: string;
        firstName: string;
        lastName: string;
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
        companyId: string;
        passwordResetTokenId: string | null;
        workTypeId: string | null;
        middleName: string | null;
        secondLastName: string | null;
        lastSeen: Date | null;
    };
    CostCode: {
        createdAt: Date;
        id: string;
        name: string;
        updatedAt: Date;
        code: string | null;
        isActive: boolean;
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
            id: string;
            email: string | null;
            username: string;
            firstName: string;
            lastName: string;
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
            companyId: string;
            passwordResetTokenId: string | null;
            workTypeId: string | null;
            middleName: string | null;
            secondLastName: string | null;
            lastSeen: Date | null;
        };
        EmployeeEquipmentLogs: ({
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
        })[];
        TascoLogs: ({
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
        Maintenance: ({
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
            };
        } & {
            id: number;
            description: string | null;
            equipmentId: string;
            timeSheetId: number;
            hours: number | null;
        })[];
        CostCode: {
            createdAt: Date;
            id: string;
            name: string;
            updatedAt: Date;
            code: string | null;
            isActive: boolean;
        };
        TruckingLogs: ({
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
            EquipmentHauled: ({
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
                createdAt: Date;
                id: string;
                equipmentId: string | null;
                destination: string | null;
                truckingLogId: string | null;
                endMileage: number | null;
                startMileage: number | null;
                source: string | null;
            })[];
            Materials: {
                createdAt: Date | null;
                id: string;
                name: string | null;
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
    fields: string[];
}>;
export declare function getAllTascoMaterialTypes(): Promise<{
    materialTypes: {
        id: string;
        name: string;
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