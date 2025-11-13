import type { Request, Response } from "express";
export declare function getAllFormTemplatesController(req: Request, res: Response): Promise<void>;
export declare function getFormTemplateByIdController(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function getFormSubmissionsController(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function getFormSubmissionByTemplateIdController(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function createFormTemplateController(req: Request, res: Response): Promise<void>;
export declare function updateFormTemplateController(req: Request, res: Response): Promise<void>;
export declare function deleteFormTemplateController(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function archiveFormTemplateController(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function publishFormTemplateController(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function draftFormTemplateController(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function createFormSubmissionController(req: Request, res: Response): Promise<void>;
export declare function updateFormSubmissionController(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function deleteFormSubmissionController(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function getFormSubmissionByIdController(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function approveFormSubmissionController(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=adminFormController.d.ts.map