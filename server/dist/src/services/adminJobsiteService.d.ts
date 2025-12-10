import type { JobsiteUpdateBody } from "../controllers/adminJobsiteController.js";
export declare function getAllJobsites(status: string, page: number | undefined, pageSize: number | undefined, skip: number | undefined, totalPages: number | undefined, total: number | undefined): Promise<{
    jobsiteSummary: {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        _count: {
            TimeSheets: number;
        };
        Address: {
            id: string;
            street: string;
            city: string;
            state: string;
            zipCode: string;
        } | null;
        qrId: string;
        approvalStatus: import("../../generated/prisma/index.js").$Enums.ApprovalStatus;
        code: string | null;
        status: import("../../generated/prisma/index.js").$Enums.FormTemplateStatus;
    }[];
    total: number;
    page: undefined;
    pageSize: undefined;
    skip: undefined;
    totalPages: number;
} | {
    jobsiteSummary: {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        _count: {
            TimeSheets: number;
        };
        Address: {
            id: string;
            street: string;
            city: string;
            state: string;
            zipCode: string;
        } | null;
        qrId: string;
        approvalStatus: import("../../generated/prisma/index.js").$Enums.ApprovalStatus;
        code: string | null;
        status: import("../../generated/prisma/index.js").$Enums.FormTemplateStatus;
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
    Address: {
        id: string;
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
    } | null;
    CCTags: {
        name: string;
        id: string;
    }[];
} & {
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
        name: string;
        id: string;
        description: string | null;
    }[];
} & {
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
}>;
export declare function archiveJobsite(id: string): Promise<{
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
}>;
export declare function restoreJobsite(id: string): Promise<{
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
}>;
export declare function deleteJobsite(id: string): Promise<{
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
}>;
//# sourceMappingURL=adminJobsiteService.d.ts.map