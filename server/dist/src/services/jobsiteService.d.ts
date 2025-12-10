export declare function getJobsites(query: {
    qrg?: boolean;
    clock?: boolean;
}): Promise<{
    name: string;
    id: string;
    qrId: string;
    code: string | null;
    status: import("../../generated/prisma/index.js").$Enums.FormTemplateStatus;
}[]>;
export declare function getJobsiteByQrId(qrId: string): Promise<{
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
} | null>;
export declare function getJobsiteById(id: string): Promise<{
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
} | null>;
export declare function createJobsite(data: any): Promise<{
    createdBy: {
        firstName: string;
        lastName: string;
    } | null;
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
export declare function updateJobsite(id: string, updates: any): Promise<{
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
export declare function deleteJobsite(id: string): Promise<boolean>;
//# sourceMappingURL=jobsiteService.d.ts.map