export declare function getMechanicLogsService(timesheetId: number): Promise<{
    id: number;
    description: string | null;
    Equipment: {
        name: string;
        id: string;
    };
    equipmentId: string;
    hours: number | null;
}[]>;
export declare function createMechanicLogService({ timeSheetId, equipmentId, hours, description, }: {
    timeSheetId: number;
    equipmentId: string;
    hours?: number;
    description?: string;
}): Promise<{
    id: number;
    description: string | null;
    equipmentId: string;
    timeSheetId: number;
    hours: number | null;
}>;
export declare function updateMechanicLogService(projectId: number, { equipmentId, hours, description, }: {
    equipmentId?: string;
    hours?: number;
    description?: string;
}): Promise<{
    id: number;
    description: string | null;
    equipmentId: string;
    timeSheetId: number;
    hours: number | null;
}>;
export declare function deleteMechanicLogService(projectId: number): Promise<{
    id: number;
    description: string | null;
    equipmentId: string;
    timeSheetId: number;
    hours: number | null;
}>;
export declare function getMechanicLogService(id: number): Promise<{
    id: number;
    description: string | null;
    Equipment: {
        name: string;
        id: string;
    };
    equipmentId: string;
    hours: number | null;
} | null>;
//# sourceMappingURL=mechanicService.d.ts.map