export declare function getCostCodes(): Promise<{
    name: string;
    id: string;
    isActive: boolean;
    code: string | null;
    CCTags: {
        name: string;
        id: string;
        description: string | null;
        Jobsites: {
            name: string;
            id: string;
        }[];
    }[];
}[]>;
//# sourceMappingURL=costCodeService.d.ts.map