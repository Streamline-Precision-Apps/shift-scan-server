import type { User, Prisma } from "../../generated/prisma/index.js";
export declare function createUserWithCompanyId(userData: Omit<Prisma.UserCreateInput, "Company"> & {
    companyId: string;
}): Prisma.UserCreateInput;
export declare function getAllUsers(): Promise<User[]>;
export declare function getUserById(id: string): Promise<{
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
}>;
export declare function getUserByIdQuery(id: string, query: string): Promise<{
    [x: string]: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        token: string;
        platform: string | null;
        lastUsedAt: Date | null;
        isValid: boolean;
    }[] | {
        id: string;
        createdAt: Date;
        topic: string;
        userId: string;
    }[] | {
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
    }[] | {
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
    }[] | {
        id: number;
        readAt: Date;
        userId: string;
        notificationId: number;
    }[] | {
        id: string;
        email: string;
        token: string;
        expiration: Date;
    }[] | {
        id: number;
        userId: string;
        startTime: Date;
        endTime: Date | null;
    }[] | {
        id: string;
        updatedAt: Date;
        signature: string | null;
        comment: string | null;
        submittedAt: Date;
        formSubmissionId: number;
        signedBy: string | null;
    }[] | {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        formType: string | null;
        status: import("../../generated/prisma/index.js").$Enums.FormStatus;
        data: Prisma.JsonValue | null;
        title: string | null;
        userId: string;
        formTemplateId: string;
        submittedAt: Date | null;
    }[] | {
        id: string;
        comment: string | null;
        userId: string;
        startTime: Date;
        endTime: Date | null;
        timeSheetId: number;
        maintenanceId: string;
    }[] | {
        id: number;
        userId: string;
        notificationId: number;
        response: string | null;
        respondedAt: Date;
    }[] | {
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
    }[] | {
        id: string;
        timeSheetId: number;
        changedBy: string;
        changedAt: Date;
        changeReason: string | null;
        changes: Prisma.JsonValue;
        wasStatusChange: boolean;
        numberOfChanges: number;
    }[] | {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        leadId: string;
        crewType: import("../../generated/prisma/index.js").$Enums.WorkType;
    }[];
}>;
export declare function createUser(userData: Prisma.UserCreateInput): Promise<User>;
export declare function updateUser(id: string, userData: Prisma.UserUpdateInput): Promise<User>;
export declare function deleteUser(id: string): Promise<{
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
}>;
export declare function getUserSettings(userId: string): Promise<{
    id: string;
    createdAt: Date;
    userId: string;
    language: string;
    generalReminders: boolean;
    personalReminders: boolean;
    cameraAccess: boolean;
    locationAccess: boolean;
    cookiesAccess: boolean;
    lastUpdated: Date;
} | null>;
export declare function updateUserSettings(userId: string, data: Partial<Prisma.UserSettingsUpdateInput>): Promise<{
    id: string;
    createdAt: Date;
    userId: string;
    language: string;
    generalReminders: boolean;
    personalReminders: boolean;
    cameraAccess: boolean;
    locationAccess: boolean;
    cookiesAccess: boolean;
    lastUpdated: Date;
}>;
export declare function updateContact(userId: string, data: Partial<Prisma.ContactsUpdateInput>): Promise<{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    phoneNumber: string | null;
    emergencyContact: string | null;
    emergencyContactNumber: string | null;
}>;
export declare function getAllActiveEmployees(): Promise<{
    id: string;
    firstName: string;
    lastName: string;
}[]>;
export declare function getUsersTimeSheetByDate(userId: string, dateParam: string): Promise<({
    Jobsite: {
        name: string;
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
})[]>;
export declare function getTeamsByUserId(userId: string): Promise<{
    name: string;
    id: string;
    _count: {
        Users: number;
    };
}[]>;
export declare function crewStatus(crewId: string): Promise<{
    Users: {
        id: string;
        clockedIn: boolean;
    }[];
} | null>;
export declare function getCrewMembers(crewId: string): Promise<{
    crewMembers: {
        id: string;
        firstName: string;
        lastName: string;
        image: string | null;
    }[];
    crewType: import("../../generated/prisma/index.js").$Enums.WorkType;
}>;
export declare function getAllTeamsService(): Promise<{
    id: string;
}[]>;
export declare function getUserInfo(userId: string): Promise<{
    employeeData: {
        id: string;
        firstName: string;
        lastName: string;
        email: string | null;
        DOB: Date | null;
        image: string | null;
    };
    contact: {
        phoneNumber: string | null;
        emergencyContact: string | null;
        emergencyContactNumber: string | null;
    } | null;
}>;
export declare function getUserOnlineStatus(userId: string): Promise<{
    id: string;
    clockedIn: boolean;
} | null>;
export declare function createSession(userId: string): Promise<{
    id: number;
    userId: string;
    startTime: Date;
    endTime: Date | null;
}>;
export declare function EndSession(id: number): Promise<{
    id: number;
    userId: string;
    startTime: Date;
    endTime: Date | null;
}>;
export declare function handleUserSignature(userId: string): Promise<{
    signature: string | null;
} | null>;
//# sourceMappingURL=UserService.d.ts.map