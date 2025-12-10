export interface GetEmployeeRequestsParams {
    filter: string;
    skip: number;
    take: number;
    managerId: string;
}
export interface CreateFormSubmissionParams {
    formTemplateId: string;
    userId: string;
}
export interface SaveDraftParams {
    formData: Record<string, string>;
    formTemplateId: string;
    userId: string;
    formType?: string;
    submissionId?: number;
    title?: string;
}
export interface SaveDraftToPendingParams {
    formData: Record<string, string>;
    isApprovalRequired: boolean;
    formTemplateId: string;
    userId: string;
    formType?: string;
    submissionId?: number;
    title?: string;
}
export interface SavePendingParams {
    formData: Record<string, string>;
    formTemplateId: string;
    userId: string;
    formType?: string;
    submissionId?: number;
    title?: string;
}
export interface CreateFormApprovalParams {
    formSubmissionId: number;
    signedBy: string;
    signature: string;
    comment: string;
    approval: string;
}
export interface UpdateFormApprovalParams {
    id: string;
    formSubmissionId: number;
    comment: string;
    isApproved: boolean;
    managerId: string;
}
/**
 * Get all forms
 * @returns {
 *   id: string;
 *   name: string;
 * }[]
 */
export declare const ServiceGetForms: () => Promise<{
    name: string;
    id: string;
}[]>;
/**
 * Get all form submissions
 */
export declare const ServiceGetFormSubmissions: () => Promise<{
    id: number;
}[]>;
/**
 * Create a form submission
 * @param {Object} params
 * @param {string} params.formTemplateId
 * @param {string} params.userId
 */
export declare const ServiceCreateFormSubmission: ({ formTemplateId, userId, }: CreateFormSubmissionParams) => Promise<{
    id: number;
    createdAt: Date;
    updatedAt: Date;
    formType: string | null;
    status: import("../../generated/prisma/index.js").$Enums.FormStatus;
    data: import("../../generated/prisma/runtime/library.js").JsonValue | null;
    title: string | null;
    userId: string;
    formTemplateId: string;
    submittedAt: Date | null;
}>;
/**
 * Delete a form submission
 * @param {number} id
 */
export declare const ServiceDeleteFormSubmission: (id: number) => Promise<boolean>;
/**
 * Save a draft form submission
 * @param {Object} params
 * @param {Record<string, string>} params.formData
 * @param {string} params.formTemplateId
 * @param {string} params.userId
 * @param {string} [params.formType]
 * @param {number} [params.submissionId]
 * @param {string} [params.title]
 */
export declare const ServiceSaveDraft: (params: SaveDraftParams) => Promise<{
    id: number;
    createdAt: Date;
    updatedAt: Date;
    formType: string | null;
    status: import("../../generated/prisma/index.js").$Enums.FormStatus;
    data: import("../../generated/prisma/runtime/library.js").JsonValue | null;
    title: string | null;
    userId: string;
    formTemplateId: string;
    submittedAt: Date | null;
}>;
/**
 * Save a draft and move to pending/approved
 * @param {Object} params
 * @param {Record<string, string>} params.formData
 * @param {boolean} params.isApprovalRequired
 * @param {string} params.formTemplateId
 * @param {string} params.userId
 * @param {string} [params.formType]
 * @param {number} [params.submissionId]
 * @param {string} [params.title]
 */
export declare const ServiceSaveDraftToPending: (params: SaveDraftToPendingParams) => Promise<{
    User: {
        firstName: string;
        lastName: string;
    };
} & {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    formType: string | null;
    status: import("../../generated/prisma/index.js").$Enums.FormStatus;
    data: import("../../generated/prisma/runtime/library.js").JsonValue | null;
    title: string | null;
    userId: string;
    formTemplateId: string;
    submittedAt: Date | null;
}>;
/**
 * Save a pending form submission
 * @param {Object} params
 * @param {Record<string, string>} params.formData
 * @param {string} params.formTemplateId
 * @param {string} params.userId
 * @param {string} [params.formType]
 * @param {number} [params.submissionId]
 * @param {string} [params.title]
 */
export declare const ServiceSavePending: (params: SavePendingParams) => Promise<{
    id: number;
    createdAt: Date;
    updatedAt: Date;
    formType: string | null;
    status: import("../../generated/prisma/index.js").$Enums.FormStatus;
    data: import("../../generated/prisma/runtime/library.js").JsonValue | null;
    title: string | null;
    userId: string;
    formTemplateId: string;
    submittedAt: Date | null;
}>;
export declare const ServiceGetFormsWithRequests: () => Promise<({
    User: {
        firstName: string;
        lastName: string;
    };
} & {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    formType: string | null;
    status: import("../../generated/prisma/index.js").$Enums.FormStatus;
    data: import("../../generated/prisma/runtime/library.js").JsonValue | null;
    title: string | null;
    userId: string;
    formTemplateId: string;
    submittedAt: Date | null;
})[]>;
/**
 * Create a form approval
 * @param {Object} params
 * @param {number} params.formSubmissionId
 * @param {string} params.signedBy
 * @param {string} params.signature
 * @param {string} params.comment
 * @param {string} params.approval
 */
export declare const ServiceCreateFormApproval: (params: CreateFormApprovalParams) => Promise<boolean>;
/**
 * Update a form approval
 * @param {Object} params
 * @param {string} params.id
 * @param {number} params.formSubmissionId
 * @param {string} params.comment
 * @param {boolean} params.isApproved
 */
export declare const ServiceUpdateFormApproval: (params: UpdateFormApprovalParams) => Promise<{
    approval: {
        id: string;
        updatedAt: Date;
        signature: string | null;
        comment: string | null;
        submittedAt: Date;
        formSubmissionId: number;
        signedBy: string | null;
    };
    updatedSubmission: {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        formType: string | null;
        status: import("../../generated/prisma/index.js").$Enums.FormStatus;
        data: import("../../generated/prisma/runtime/library.js").JsonValue | null;
        title: string | null;
        userId: string;
        formTemplateId: string;
        submittedAt: Date | null;
    };
}>;
/**
 * Fetch employee requests for a manager, with filter, skip, take
 */
export declare const ServiceGetEmployeeRequests: ({ filter, skip, take, managerId, }: GetEmployeeRequestsParams) => Promise<({
    FormTemplate: {
        formType: import("../../generated/prisma/index.js").$Enums.FormTemplateCategory;
    };
    User: {
        firstName: string;
        lastName: string;
    };
    Approvals: {
        id: string;
        Approver: {
            firstName: string;
            lastName: string;
        } | null;
    }[];
} & {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    formType: string | null;
    status: import("../../generated/prisma/index.js").$Enums.FormStatus;
    data: import("../../generated/prisma/runtime/library.js").JsonValue | null;
    title: string | null;
    userId: string;
    formTemplateId: string;
    submittedAt: Date | null;
})[] | ({
    FormTemplate: {
        formType: import("../../generated/prisma/index.js").$Enums.FormTemplateCategory;
    };
    User: {
        firstName: string;
        lastName: string;
    };
    Approvals: {
        signedBy: string | null;
    }[];
} & {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    formType: string | null;
    status: import("../../generated/prisma/index.js").$Enums.FormStatus;
    data: import("../../generated/prisma/runtime/library.js").JsonValue | null;
    title: string | null;
    userId: string;
    formTemplateId: string;
    submittedAt: Date | null;
})[]>;
export declare const ServiceGetUserSubmissions: ({ userId, filter, startDate, endDate, skip, take, }: {
    userId: string;
    filter: string;
    startDate: Date | null;
    endDate: Date | null;
    skip: number;
    take: number;
}) => Promise<({
    FormTemplate: {
        name: string;
        formType: import("../../generated/prisma/index.js").$Enums.FormTemplateCategory;
    };
    User: {
        id: string;
        firstName: string;
        lastName: string;
    };
} & {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    formType: string | null;
    status: import("../../generated/prisma/index.js").$Enums.FormStatus;
    data: import("../../generated/prisma/runtime/library.js").JsonValue | null;
    title: string | null;
    userId: string;
    formTemplateId: string;
    submittedAt: Date | null;
})[]>;
export declare const ServiceManagerFormApprovals: (id: string) => Promise<({
    Approvals: ({
        Approver: {
            firstName: string;
            lastName: string;
        } | null;
    } & {
        id: string;
        updatedAt: Date;
        signature: string | null;
        comment: string | null;
        submittedAt: Date;
        formSubmissionId: number;
        signedBy: string | null;
    })[];
} & {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    formType: string | null;
    status: import("../../generated/prisma/index.js").$Enums.FormStatus;
    data: import("../../generated/prisma/runtime/library.js").JsonValue | null;
    title: string | null;
    userId: string;
    formTemplateId: string;
    submittedAt: Date | null;
}) | null>;
export declare const ServiceFormSubmissions: (id: string) => Promise<({
    FormTemplate: {
        name: string;
        id: string;
    };
    User: {
        signature: string | null;
    };
    Approvals: {
        id: string;
        updatedAt: Date;
        comment: string | null;
        Approver: {
            firstName: string;
            lastName: string;
        } | null;
    }[];
} & {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    formType: string | null;
    status: import("../../generated/prisma/index.js").$Enums.FormStatus;
    data: import("../../generated/prisma/runtime/library.js").JsonValue | null;
    title: string | null;
    userId: string;
    formTemplateId: string;
    submittedAt: Date | null;
}) | null>;
export declare const ServiceTeamSubmissions: (id: string) => Promise<({
    User: {
        firstName: string;
        lastName: string;
    };
    Approvals: {
        comment: string | null;
        Approver: {
            firstName: string;
            lastName: string;
        } | null;
    }[];
} & {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    formType: string | null;
    status: import("../../generated/prisma/index.js").$Enums.FormStatus;
    data: import("../../generated/prisma/runtime/library.js").JsonValue | null;
    title: string | null;
    userId: string;
    formTemplateId: string;
    submittedAt: Date | null;
}) | null>;
export declare const ServiceFormDraft: (id: string, userId: string) => Promise<{
    FormTemplate: {
        name: string;
    };
    data: import("../../generated/prisma/runtime/library.js").JsonValue;
    title: string | null;
} | null>;
export declare const ServiceForm: (id: string, userId: string) => Promise<{
    id: string;
    name: string;
    formType: import("../../generated/prisma/index.js").$Enums.FormTemplateCategory;
    isActive: import("../../generated/prisma/index.js").$Enums.FormTemplateStatus;
    isSignatureRequired: boolean;
    groupings: {
        id: string;
        title: string;
        order: number;
        fields: {
            id: string;
            label: string;
            name: string;
            type: import("../../generated/prisma/index.js").$Enums.FieldType;
            required: boolean;
            order: number;
            defaultValue: undefined;
            placeholder: string | null;
            helperText: string | null;
            filter: string | null;
            multiple: boolean | null;
            options: string[];
        }[];
    }[];
}>;
export interface UpdateFormSubmissionParams {
    submissionId: number;
    formData?: Record<string, any>;
    status?: string;
    title?: string;
    formType?: string;
    isApprovalRequired?: boolean;
    userId?: string;
    submittedAt?: string;
}
/**
 * Update a form submission (partial update)
 * Supports updating data, status, title, and formType.
 * Returns the updated submission.
 */
export declare const updateFormSubmissionService: (body: UpdateFormSubmissionParams) => Promise<{
    FormTemplate: {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        companyId: string;
        spanishName: string | null;
        isSignatureRequired: boolean;
        description: string | null;
        isActive: import("../../generated/prisma/index.js").$Enums.FormTemplateStatus;
        formType: import("../../generated/prisma/index.js").$Enums.FormTemplateCategory;
        isApprovalRequired: boolean;
    };
    User: {
        id: string;
        companyId: string;
        firstName: string;
        lastName: string;
        username: string;
        email: string | null;
        password: string;
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
        accountSetup: boolean;
        clockedIn: boolean;
        passwordResetTokenId: string | null;
        workTypeId: string | null;
        middleName: string | null;
        secondLastName: string | null;
        lastSeen: Date | null;
    };
    Approvals: {
        id: string;
        updatedAt: Date;
        signature: string | null;
        comment: string | null;
        submittedAt: Date;
        formSubmissionId: number;
        signedBy: string | null;
    }[];
} & {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    formType: string | null;
    status: import("../../generated/prisma/index.js").$Enums.FormStatus;
    data: import("../../generated/prisma/runtime/library.js").JsonValue | null;
    title: string | null;
    userId: string;
    formTemplateId: string;
    submittedAt: Date | null;
}>;
//# sourceMappingURL=formsService.d.ts.map