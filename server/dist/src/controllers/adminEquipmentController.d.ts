import type { Request, Response } from "express";
export declare function listEquipment(req: Request, res: Response): Promise<void>;
export declare function getEquipmentSummary(req: Request, res: Response): Promise<void>;
export declare function getEquipmentById(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function createEquipment(req: Request, res: Response): Promise<void>;
export declare function updateEquipment(req: Request, res: Response): Promise<void>;
export declare function deleteEquipment(req: Request, res: Response): Promise<void>;
export declare function archiveEquipment(req: Request, res: Response): Promise<void>;
export declare function restoreEquipment(req: Request, res: Response): Promise<void>;
export declare function listArchivedEquipment(req: Request, res: Response): Promise<void>;
//# sourceMappingURL=adminEquipmentController.d.ts.map