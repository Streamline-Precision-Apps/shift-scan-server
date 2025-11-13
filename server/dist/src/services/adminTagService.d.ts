export declare function getAllTags(search: string, page: number | undefined, pageSize: number | undefined, skip: number | undefined): Promise<{
    tagSummary: ({
        CostCodes: {
            id: string;
            name: string;
            isActive: boolean;
        }[];
        Jobsites: {
            id: string;
            name: string;
        }[];
    } & {
        id: string;
        name: string;
        description: string | null;
    })[];
    total: number;
    page: number;
    pageSize: undefined;
    totalPages: number;
} | {
    tagSummary: ({
        CostCodes: {
            id: string;
            name: string;
            isActive: boolean;
        }[];
        Jobsites: {
            id: string;
            name: string;
        }[];
    } & {
        id: string;
        name: string;
        description: string | null;
    })[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}>;
export declare function getTagById(id: string): Promise<({
    CostCodes: {
        id: string;
        name: string;
    }[];
    Jobsites: {
        id: string;
        name: string;
    }[];
} & {
    id: string;
    name: string;
    description: string | null;
}) | null>;
export declare function createTag(payload: {
    name: string;
    description: string;
    CostCodes: {
        id: string;
        name: string;
    }[];
    Jobsites: {
        id: string;
        name: string;
    }[];
}): Promise<{
    CostCodes: {
        id: string;
        name: string;
    }[];
    Jobsites: {
        id: string;
        name: string;
    }[];
} & {
    id: string;
    name: string;
    description: string | null;
}>;
export type UpdateTagPayload = {
    name?: string;
    description?: string;
    Jobsites?: {
        id: string;
        name?: string;
    }[];
    CostCodes?: {
        id: string;
        name?: string;
    }[];
};
export declare function updateTag(id: string, payload: UpdateTagPayload): Promise<{
    CostCodes: {
        id: string;
        name: string;
    }[];
    Jobsites: {
        id: string;
        name: string;
    }[];
} & {
    id: string;
    name: string;
    description: string | null;
}>;
export declare function deleteTag(id: string): Promise<{
    id: string;
    name: string;
    description: string | null;
}>;
//# sourceMappingURL=adminTagService.d.ts.map