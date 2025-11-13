import type { Request, Response } from "express";
export declare const getCrewEmployeesController: (req: Request, res: Response) => Promise<void>;
export declare const getAllCrewsController: (req: Request, res: Response) => Promise<void>;
export declare const getAllActiveEmployeesController: (req: Request, res: Response) => Promise<void>;
export declare const getEmployeeInfoController: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getCrewByIdAdminController: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getCrewManagersController: (req: Request, res: Response) => Promise<void>;
export declare const createCrewController: (req: Request, res: Response) => Promise<void>;
export declare const editCrewController: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteCrewController: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const createUserAdminController: (req: Request, res: Response) => Promise<void>;
export declare const editUserAdminController: (req: Request, res: Response) => Promise<void>;
export declare const deleteUserController: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getPersonnelManagerController: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=adminPersonnelController.d.ts.map