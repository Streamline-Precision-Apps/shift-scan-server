import type { Request, Response } from "express";
export declare function getTagSummaryController(req: Request, res: Response): Promise<void>;
export declare function getTagByIdController(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function createTagController(req: Request, res: Response): Promise<void>;
export declare function updateTagController(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function deleteTagController(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=adminTagsController.d.ts.map