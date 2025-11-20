import type { WorkType } from "../../generated/prisma/index.js";
export declare function getCrewEmployees(): Promise<{
    id: string;
    firstName: string;
    lastName: string;
    truckView: boolean;
    tascoView: boolean;
    laborView: boolean;
    mechanicView: boolean;
    permission: import("../../generated/prisma/index.js").$Enums.Permission;
    image: string | null;
    terminationDate: Date | null;
    middleName: string | null;
    secondLastName: string | null;
}[]>;
export declare function getAllCrews({ page, pageSize, status, search, }?: {
    page?: number | undefined;
    pageSize?: number | undefined;
    status?: string | undefined;
    search?: string | undefined;
}): Promise<{
    crews: ({
        Users: {
            id: string;
            firstName: string;
            lastName: string;
            image: string | null;
            middleName: string | null;
            secondLastName: string | null;
        }[];
    } & {
        createdAt: Date;
        id: string;
        name: string;
        updatedAt: Date;
        leadId: string;
        crewType: import("../../generated/prisma/index.js").$Enums.WorkType;
    })[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}>;
export declare function getEmployeeInfo(id: string): Promise<{
    id: string;
    email: string | null;
    username: string;
    firstName: string;
    lastName: string;
    signature: string | null;
    DOB: Date | null;
    truckView: boolean;
    tascoView: boolean;
    laborView: boolean;
    mechanicView: boolean;
    permission: import("../../generated/prisma/index.js").$Enums.Permission;
    image: string | null;
    startDate: Date | null;
    terminationDate: Date | null;
    middleName: string | null;
    secondLastName: string | null;
    Contact: {
        phoneNumber: string | null;
        emergencyContact: string | null;
        emergencyContactNumber: string | null;
    } | null;
    Crews: {
        id: string;
        name: string;
        leadId: string;
    }[];
} | null>;
export declare function getCrewByIdAdmin(id: string): Promise<({
    Users: {
        id: string;
        firstName: string;
        lastName: string;
        middleName: string | null;
        secondLastName: string | null;
    }[];
} & {
    createdAt: Date;
    id: string;
    name: string;
    updatedAt: Date;
    leadId: string;
    crewType: import("../../generated/prisma/index.js").$Enums.WorkType;
}) | null>;
/**
 * Get paginated and filtered personnel summary for admin panel
 * @param {Object} params
 * @returns {Promise<Object>}
 */
export declare function getPersonnelManager({ page, pageSize, status, search, accessLevel, roles, accountSetup, crews, }?: {
    page?: number | undefined;
    pageSize?: number | undefined;
    status?: string | undefined;
    search?: string | undefined;
    accessLevel?: string | undefined;
    roles?: string | undefined;
    accountSetup?: string | undefined;
    crews?: string | undefined;
}): Promise<{
    users: {
        Crews: {
            leadName: any;
            id: string;
            name: string;
            leadId: string;
        }[];
        id: string;
        email: string | null;
        username: string;
        firstName: string;
        lastName: string;
        DOB: Date | null;
        truckView: boolean;
        tascoView: boolean;
        laborView: boolean;
        mechanicView: boolean;
        permission: import("../../generated/prisma/index.js").$Enums.Permission;
        image: string | null;
        terminationDate: Date | null;
        accountSetup: boolean;
        middleName: string | null;
        secondLastName: string | null;
        Contact: {
            phoneNumber: string | null;
            emergencyContact: string | null;
            emergencyContactNumber: string | null;
        } | null;
    }[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}>;
export declare function createCrew(name: string, Users: string, leadId: string, crewType: WorkType): Promise<{
    success: boolean;
    crewId: string;
    message: string;
}>;
export declare function editCrew(id: string, name: string, Users: string, leadId: string, crewType: WorkType): Promise<{
    success: boolean;
    crewId: string;
    message: string;
}>;
export declare function deleteCrew(id: string): Promise<{
    success: boolean;
}>;
export declare function createUserAdmin(payload: {
    terminationDate: Date | null;
    createdById: string;
    username: string;
    firstName: string;
    middleName: string;
    lastName: string;
    secondLastName: string;
    password: string;
    permission: string;
    truckView: boolean;
    tascoView: boolean;
    mechanicView: boolean;
    laborView: boolean;
    crews: {
        id: string;
    }[];
}): Promise<{
    success: boolean;
    userId: string;
}>;
export declare function editUserAdmin(payload: {
    id: string;
    terminationDate: string | null;
    username: string;
    firstName: string;
    middleName: string | null;
    lastName: string;
    secondLastName: string | null;
    permission: string;
    truckView: boolean;
    tascoView: boolean;
    mechanicView: boolean;
    laborView: boolean;
    crews: {
        id: string;
    }[];
}): Promise<{
    success: boolean;
    userId: string;
}>;
export declare function deleteUser(id: string): Promise<{
    success: boolean;
}>;
export declare function getAllActiveEmployees(): Promise<{
    id: string;
    firstName: string;
    lastName: string;
}[]>;
//# sourceMappingURL=adminPersonnelServices.d.ts.map