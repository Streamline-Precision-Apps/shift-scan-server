import type { Request, Response } from "express";
export declare function getAllJobsitesController(req: Request, res: Response): Promise<void>;
export declare function getJobsiteByIdController(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export interface JobsiteCreateBody {
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
}
export interface JobsiteUpdateBody {
    code?: string;
    name?: string;
    description?: string;
    approvalStatus?: string;
    status?: string;
    creationReason?: string;
    CCTags?: Array<{
        id: string;
    }>;
    updatedAt?: Date;
    userId: string;
}
export declare function createJobsiteController(req: Request<{}, {}, JobsiteCreateBody>, res: Response): Promise<void>;
export declare function updateJobsiteController(req: Request<{
    id: string;
}, {}, JobsiteUpdateBody>, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function archiveJobsiteController(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function restoreJobsiteController(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function deleteJobsiteController(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=adminJobsiteController.d.ts.map