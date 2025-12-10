export declare function getUserWithSettingsById(userId: string): Promise<{
    user: {
        id: string;
        companyId: string;
        firstName: string;
        lastName: string;
        username: string;
        email: string | null;
        signature: string | null;
        DOB: Date | null;
        truckView: boolean;
        tascoView: boolean;
        laborView: boolean;
        mechanicView: boolean;
        permission: import("../../generated/prisma/index.js").$Enums.Permission;
        image: string | null;
        terminationDate: Date | null;
        accountSetup: boolean;
        clockedIn: boolean;
        middleName: string | null;
        secondLastName: string | null;
        lastSeen: Date | null;
        accountSetupToken: {
            id: string;
            code: string;
            userId: string;
            expiresAt: Date;
            used: boolean;
        } | null;
        UserSettings: {
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
        } | null;
        Contact: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            phoneNumber: string | null;
            emergencyContact: string | null;
            emergencyContactNumber: string | null;
        } | null;
    } | null;
    jobsites: {
        name: string;
        id: string;
        qrId: string;
        approvalStatus: import("../../generated/prisma/index.js").$Enums.ApprovalStatus;
        archiveDate: Date | null;
        code: string | null;
        status: import("../../generated/prisma/index.js").$Enums.FormTemplateStatus;
    }[];
    equipments: {
        name: string;
        id: string;
        qrId: string;
        approvalStatus: import("../../generated/prisma/index.js").$Enums.ApprovalStatus;
        code: string | null;
        status: import("../../generated/prisma/index.js").$Enums.FormTemplateStatus;
        equipmentTag: import("../../generated/prisma/index.js").$Enums.EquipmentTags;
    }[];
    costCodes: {
        name: string;
        id: string;
        isActive: boolean;
        code: string | null;
        CCTags: {
            name: string;
            id: string;
            description: string | null;
            Jobsites: {
                name: string;
                id: string;
            }[];
        }[];
    }[];
}>;
//# sourceMappingURL=initService.d.ts.map