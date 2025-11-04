import Express from "express";
export declare function getTimesheetActiveStatusController(req: Express.Request, res: Express.Response): Promise<Express.Response<any, Record<string, any>>>;
export declare function getRecentTimesheetController(req: Express.Request, res: Express.Response): Promise<Express.Response<any, Record<string, any>>>;
export declare function getRecentReturnTimesheetController(req: Express.Request, res: Express.Response): Promise<Express.Response<any, Record<string, any>>>;
export declare function updateTimesheet(req: Express.Request, res: Express.Response): Promise<Express.Response<any, Record<string, any>>>;
export declare function getUserTimesheetsByDateController(req: Express.Request, res: Express.Response): Promise<Express.Response<any, Record<string, any>>>;
export declare function getTimesheetDetailsManagerController(req: Express.Request, res: Express.Response): Promise<Express.Response<any, Record<string, any>>>;
export declare function getManagerCrewTimesheetsController(req: Express.Request, res: Express.Response): Promise<Express.Response<any, Record<string, any>>>;
export declare function approveTimesheetsBatchController(req: Express.Request, res: Express.Response): Promise<Express.Response<any, Record<string, any>>>;
export interface GeneralTimesheetInput {
    date: string;
    jobsiteId: string;
    workType: string;
    userId: string;
    costCode: string;
    startTime: string;
    clockInLat?: number | null;
    clockInLong?: number | null;
    type?: string;
    previousTimeSheetId?: number;
    endTime?: string;
    previoustimeSheetComments?: string;
    clockOutLat?: number | null;
    clockOutLong?: number | null;
}
export interface MechanicTimesheetInput {
    date: string;
    jobsiteId: string;
    workType: string;
    userId: string;
    costCode: string;
    startTime: string;
    clockInLat?: number | null;
    clockInLong?: number | null;
    type?: string;
    previousTimeSheetId?: number;
    endTime?: string;
    previoustimeSheetComments?: string;
    clockOutLat?: number | null;
    clockOutLong?: number | null;
}
export interface TascoTimesheetInput {
    date: string;
    jobsiteId: string;
    workType: string;
    userId: string;
    costCode: string;
    startTime: string;
    clockInLat?: number | null;
    clockInLong?: number | null;
    type?: string;
    previousTimeSheetId?: number;
    endTime?: string;
    previoustimeSheetComments?: string;
    clockOutLat?: number | null;
    clockOutLong?: number | null;
    shiftType?: string;
    laborType?: string;
    materialType?: string;
    equipmentId?: string;
}
export interface TruckTimesheetInput {
    date: string;
    jobsiteId: string;
    workType: string;
    userId: string;
    costCode: string;
    startTime: string;
    clockInLat?: number | null;
    clockInLong?: number | null;
    type?: string;
    previousTimeSheetId?: number;
    endTime?: string;
    previoustimeSheetComments?: string;
    clockOutLat?: number | null;
    clockOutLong?: number | null;
    startingMileage: number;
    laborType: string;
    truck: string;
    equipmentId?: string;
}
export declare function createTimesheetAndSwitchJobsController(req: Express.Request, res: Express.Response): Promise<Express.Response<any, Record<string, any>>>;
export declare function getBannerDataController(req: Express.Request, res: Express.Response): Promise<Express.Response<any, Record<string, any>>>;
export declare function getDashboardLogsController(req: Express.Request, res: Express.Response): Promise<Express.Response<any, Record<string, any>>>;
export declare function getClockOutCommentController(req: Express.Request, res: Express.Response): Promise<Express.Response<any, Record<string, any>>>;
export declare function getUserEquipmentLogsController(req: Express.Request, res: Express.Response): Promise<Express.Response<any, Record<string, any>>>;
export declare function getUserRecentJobsiteDetailsController(req: Express.Request, res: Express.Response): Promise<Express.Response<any, Record<string, any>>>;
export declare function createEmployeeEquipmentLogController(req: Express.Request, res: Express.Response): Promise<Express.Response<any, Record<string, any>>>;
export declare function getEmployeeEquipmentLogDetailsController(req: Express.Request, res: Express.Response): Promise<Express.Response<any, Record<string, any>>>;
export declare function deleteEmployeeEquipmentLogController(req: Express.Request, res: Express.Response): Promise<Express.Response<any, Record<string, any>>>;
export declare function updateEmployeeEquipmentLogController(req: Express.Request, res: Express.Response): Promise<Express.Response<any, Record<string, any>>>;
export declare function getClockOutDetailsController(req: Express.Request, res: Express.Response): Promise<Express.Response<any, Record<string, any>>>;
export declare function updateClockOutController(req: Express.Request, res: Express.Response): Promise<Express.Response<any, Record<string, any>>>;
export declare function getPreviousWorkController(req: import("express").Request, res: import("express").Response): Promise<Express.Response<any, Record<string, any>>>;
export declare function getContinueTimesheetController(req: import("express").Request, res: import("express").Response): Promise<Express.Response<any, Record<string, any>>>;
export declare function deleteRefuelLogController(req: Express.Request, res: Express.Response): Promise<Express.Response>;
//# sourceMappingURL=timesheetController.d.ts.map