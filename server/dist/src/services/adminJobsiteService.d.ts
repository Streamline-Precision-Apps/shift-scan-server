import type { JobsiteUpdateBody } from "../controllers/adminJobsiteController.js";
export declare function getAllJobsites(status: string, page: number | undefined, pageSize: number | undefined, skip: number | undefined, totalPages: number | undefined, total: number | undefined): Promise<{
    jobsiteSummary: {
        createdAt: Date;
        id: string;
        name: string;
        updatedAt: Date;
        _count: {
            TimeSheets: number;
        };
        qrId: string;
        description: string;
        approvalStatus: import("../../generated/prisma/index.js").$Enums.ApprovalStatus;
        code: string | null;
        status: import("../../generated/prisma/index.js").$Enums.FormTemplateStatus;
        Address: {
            id: string;
            state: string;
            city: string;
            zipCode: string;
            street: string;
        } | null;
    }[];
    total: number;
    page: undefined;
    pageSize: undefined;
    skip: undefined;
    totalPages: number;
} | {
    jobsiteSummary: {
        createdAt: Date;
        id: string;
        name: string;
        updatedAt: Date;
        _count: {
            TimeSheets: number;
        };
        qrId: string;
        description: string;
        approvalStatus: import("../../generated/prisma/index.js").$Enums.ApprovalStatus;
        code: string | null;
        status: import("../../generated/prisma/index.js").$Enums.FormTemplateStatus;
        Address: {
            id: string;
            state: string;
            city: string;
            zipCode: string;
            street: string;
        } | null;
    }[];
    total: number;
    page: number;
    pageSize: number;
    skip: number;
    totalPages: number;
}>;
export declare function getJobsiteById(id: string): Promise<({
    createdBy: {
        firstName: string;
        lastName: string;
    } | null;
    CCTags: {
        id: string;
        name: string;
    }[];
} & {
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
}) | null>;
export declare function createJobsite(payload: {
    code: string;
    name: string;
    description: string;
    ApprovalStatus: string;
    status: string;
    Address: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
    };
    Client?: {
        id: string;
    } | null;
    CCTags?: Array<{
        id: string;
    }>;
    CreatedVia: string;
    createdById: string;
}): Promise<void>;
export declare function updateJobsite(id: string, data: JobsiteUpdateBody): Promise<{
    CCTags: {
        id: string;
        name: string;
        description: string | null;
    }[];
} & {
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
}>;
export declare function archiveJobsite(id: string): Promise<{
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
}>;
export declare function restoreJobsite(id: string): Promise<{
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
}>;
export declare function deleteJobsite(id: string): Promise<{
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
}>;
//# sourceMappingURL=adminJobsiteService.d.ts.map