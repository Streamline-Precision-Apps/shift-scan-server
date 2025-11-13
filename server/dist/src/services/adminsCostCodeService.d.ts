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
            id: string;
            name: string;
        }[];
    } & {
        createdAt: Date;
        id: string;
        name: string;
        updatedAt: Date;
        code: string | null;
        isActive: boolean;
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
            id: string;
            name: string;
        }[];
    } & {
        createdAt: Date;
        id: string;
        name: string;
        updatedAt: Date;
        code: string | null;
        isActive: boolean;
    })[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}>;
export declare function getCostCodesById(id: string): Promise<({
    CCTags: {
        id: string;
        name: string;
    }[];
} & {
    createdAt: Date;
    id: string;
    name: string;
    updatedAt: Date;
    code: string | null;
    isActive: boolean;
}) | null>;
export declare function getCostCodeSummary(): Promise<{
    id: string;
    name: string;
    code: string | null;
    isActive: boolean;
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
    createdAt: Date;
    id: string;
    name: string;
    updatedAt: Date;
    code: string | null;
    isActive: boolean;
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
        id: string;
        name: string;
        description: string | null;
    }[];
} & {
    createdAt: Date;
    id: string;
    name: string;
    updatedAt: Date;
    code: string | null;
    isActive: boolean;
}>;
export declare function deleteCostCodes(id: string): Promise<void>;
export declare function restoreCostCodes(id: string): Promise<{
    createdAt: Date;
    id: string;
    name: string;
    updatedAt: Date;
    code: string | null;
    isActive: boolean;
}>;
export declare function archiveCostCodes(id: string): Promise<{
    createdAt: Date;
    id: string;
    name: string;
    updatedAt: Date;
    code: string | null;
    isActive: boolean;
}>;
//# sourceMappingURL=adminsCostCodeService.d.ts.map