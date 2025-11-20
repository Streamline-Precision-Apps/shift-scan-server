export declare function getTruckingReport(): Promise<{
    id: string;
    driver: string;
    truckId: string | null;
    truckName: string | null;
    trailerId: string | null;
    trailerName: string | null;
    date: Date;
    jobId: string;
    Equipment: {
        name: string;
        id: string | null;
        source: string | null;
        destination: string | null;
        startMileage: number | null;
        endMileage: number | null;
    }[];
    Materials: {
        id: string;
        name: string | null;
        location: string | null;
        quantity: number | null;
        unit: import("../../generated/prisma/index.js").$Enums.materialUnit | null;
    }[];
    StartingMileage: number | null;
    Fuel: {
        id: string | null;
        milesAtFueling: number | null;
        gallonsRefueled: number | null;
    }[];
    StateMileages: {
        id: string;
        state: string | null;
        stateLineMileage: number | null;
    }[];
    EndingMileage: number | null;
    notes: string | null;
}[]>;
type TascoReportRow = {
    id: string;
    shiftType: string;
    submittedDate: Date;
    employee: string;
    employeeId: string;
    dateWorked: Date;
    laborType: string | null;
    equipment: string;
    equipmentId: string;
    profitId: string;
    jobsiteId: string;
    loadsABCDE: number | null;
    loadsF: number | null;
    materials: string;
    startTime: Date;
    endTime: Date | null;
    LoadType: "SCREENED" | "UNSCREENED";
};
export declare function getTascoReport(filters?: {
    jobsiteIds?: string[];
    shiftTypes?: string[];
    employeeIds?: string[];
    laborTypes?: string[];
    equipmentIds?: string[];
    materialTypes?: string[];
}): Promise<TascoReportRow[]>;
export declare function getMechanicReport(): Promise<{
    id: number;
    employeeName: string;
    equipmentWorkedOn: string;
    hours: number;
    comments: string;
    dateWorked: Date;
}[]>;
export declare function getTascoFilterOptions(): Promise<{
    employees: {
        id: string;
        name: string;
    }[];
    materialTypes: {
        name: string;
    }[];
}>;
export {};
//# sourceMappingURL=adminsReportService.d.ts.map