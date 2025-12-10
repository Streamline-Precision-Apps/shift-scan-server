export declare function getCostCodes({ search, page, pageSize, skip, }: {
    search: string;
    page: number | undefined;
    pageSize: number | undefined;
    skip: number | undefined;
}): Promise<{
    costCodes: ({
        _count: {
            Timesheets: number;
        };
        CCTags: {
            name: string;
            id: string;
        }[];
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        code: string | null;
    })[];
    total: number;
    page: undefined;
    pageSize: undefined;
    totalPages: number;
} | {
    costCodes: ({
        _count: {
            Timesheets: number;
        };
        CCTags: {
            name: string;
            id: string;
        }[];
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        code: string | null;
    })[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}>;
export declare function getCostCodesById(id: string): Promise<({
    CCTags: {
        name: string;
        id: string;
    }[];
} & {
    name: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    isActive: boolean;
    code: string | null;
}) | null>;
export declare function getCostCodeSummary(): Promise<{
    name: string;
    id: string;
    isActive: boolean;
    code: string | null;
}[]>;
export declare function createCostCodes(payload: {
    code: string;
    name: string;
    isActive: boolean;
    CCTags: {
        id: string;
        name: string;
    }[];
}): Promise<{
    name: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    isActive: boolean;
    code: string | null;
}>;
export type UpdateCostCodePayload = {
    code?: string;
    name?: string;
    isActive?: boolean;
    CCTags?: {
        id: string;
        name?: string;
    }[];
};
export declare function updateCostCodes(id: string, payload: UpdateCostCodePayload): Promise<{
    CCTags: {
        name: string;
        id: string;
        description: string | null;
    }[];
} & {
    name: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    isActive: boolean;
    code: string | null;
}>;
export declare function deleteCostCodes(id: string): Promise<void>;
export declare function restoreCostCodes(id: string): Promise<{
    name: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    isActive: boolean;
    code: string | null;
}>;
export declare function archiveCostCodes(id: string): Promise<{
    name: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    isActive: boolean;
    code: string | null;
}>;
//# sourceMappingURL=adminsCostCodeService.d.ts.map