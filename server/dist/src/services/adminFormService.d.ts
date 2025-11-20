export interface FormSettingsData {
    name: string;
    description: string;
    formType: string;
    requireSignature: boolean;
    isApprovalRequired: boolean;
    isActive: string;
}
export interface FormFieldOption {
    id?: string;
    value: string;
}
export interface FormFieldData {
    id: string;
    formGroupingId?: string;
    label: string;
    type: string;
    required: boolean;
    order: number;
    placeholder?: string;
    minLength?: number;
    maxLength?: number;
    multiple?: boolean;
    content?: string | null;
    filter?: string | null;
    Options?: FormFieldOption[];
}
export interface SaveFormData {
    settings: FormSettingsData;
    fields: FormFieldData[];
    companyId: string;
    formId?: string;
}
export interface CreateFormSubmissionInput {
    formTemplateId: string;
    data: Record<string, string | number | boolean | null>;
    submittedBy: {
        id: string;
        firstName: string;
        lastName: string;
    };
    adminUserId?: string | null;
    comment?: string;
    signature?: string;
    status?: string;
}
export interface UpdateFormSubmissionInput {
    submissionId: number;
    data: Record<string, string | number | boolean | null>;
    adminUserId: string | null;
    comment?: string;
    signature?: string;
    updateStatus?: string;
}
export interface ApproveFormSubmissionInput {
    comment?: string;
    adminUserId?: string;
}
export declare function getAllFormTemplates(search: string, page: number | undefined, pageSize: number | undefined, skip: number | undefined, status: string[], formType: string[]): Promise<{
    data: ({
        _count: {
            Submissions: number;
        };
        FormGrouping: {
            title: string | null;
            id: string;
            Fields: {
                filter: string | null;
                order: number;
                label: string;
                type: import("../../generated/prisma/index.js").$Enums.FieldType;
                required: boolean;
                placeholder: string | null;
                maxLength: number | null;
                content: string | null;
                minLength: number | null;
                multiple: boolean | null;
                Options: {
                    id: string;
                    value: string;
                    fieldId: string;
                }[];
            }[];
            order: number;
        }[];
    } & {
        createdAt: Date;
        id: string;
        name: string;
        updatedAt: Date;
        companyId: string;
        description: string | null;
        isActive: import("../../generated/prisma/index.js").$Enums.FormTemplateStatus;
        isSignatureRequired: boolean;
        formType: import("../../generated/prisma/index.js").$Enums.FormTemplateCategory;
        isApprovalRequired: boolean;
    })[];
    page: undefined;
    pageSize: undefined;
    total: number;
    totalPages: number;
} | {
    data: ({
        _count: {
            Submissions: number;
        };
        FormGrouping: {
            title: string | null;
            id: string;
            Fields: {
                filter: string | null;
                order: number;
                label: string;
                type: import("../../generated/prisma/index.js").$Enums.FieldType;
                required: boolean;
                placeholder: string | null;
                maxLength: number | null;
                content: string | null;
                minLength: number | null;
                multiple: boolean | null;
                Options: {
                    id: string;
                    value: string;
                    fieldId: string;
                }[];
            }[];
            order: number;
        }[];
    } & {
        createdAt: Date;
        id: string;
        name: string;
        updatedAt: Date;
        companyId: string;
        description: string | null;
        isActive: import("../../generated/prisma/index.js").$Enums.FormTemplateStatus;
        isSignatureRequired: boolean;
        formType: import("../../generated/prisma/index.js").$Enums.FormTemplateCategory;
        isApprovalRequired: boolean;
    })[];
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
}>;
export declare function getFormSubmissionByTemplateId(id: string, search: string | null, page: number, pageSize: number, pendingOnly: boolean, statusFilter: string, dateRangeStart: string | null, dateRangeEnd: string | null): Promise<{
    Submissions: ({
        User: {
            id: string;
            firstName: string;
            lastName: string;
            signature: string | null;
        };
    } & {
        data: import("../../generated/prisma/runtime/library.js").JsonValue | null;
        title: string | null;
        createdAt: Date;
        id: number;
        userId: string;
        updatedAt: Date;
        status: import("../../generated/prisma/index.js").$Enums.FormStatus;
        formTemplateId: string;
        formType: string | null;
        submittedAt: Date | null;
    })[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
    pendingForms: number;
    FormGrouping?: {
        title: string | null;
        id: string;
        Fields: {
            filter: string | null;
            id: string;
            order: number;
            label: string;
            type: import("../../generated/prisma/index.js").$Enums.FieldType;
            required: boolean;
            placeholder: string | null;
            maxLength: number | null;
            content: string | null;
            minLength: number | null;
            multiple: boolean | null;
            Options: {
                id: string;
                value: string;
                fieldId: string;
            }[];
        }[];
        order: number;
    }[];
    createdAt?: Date;
    id?: string;
    name?: string;
    updatedAt?: Date;
    companyId?: string;
    description?: string | null;
    isActive?: import("../../generated/prisma/index.js").$Enums.FormTemplateStatus;
    isSignatureRequired?: boolean;
    formType?: import("../../generated/prisma/index.js").$Enums.FormTemplateCategory;
    isApprovalRequired?: boolean;
}>;
export declare function getFormTemplateById(id: string): Promise<({
    FormGrouping: ({
        Fields: ({
            Options: {
                id: string;
                value: string;
                fieldId: string;
            }[];
        } & {
            filter: string | null;
            id: string;
            order: number;
            formGroupingId: string;
            label: string;
            type: import("../../generated/prisma/index.js").$Enums.FieldType;
            required: boolean;
            placeholder: string | null;
            maxLength: number | null;
            content: string | null;
            minLength: number | null;
            multiple: boolean | null;
        })[];
    } & {
        title: string | null;
        id: string;
        order: number;
    })[];
} & {
    createdAt: Date;
    id: string;
    name: string;
    updatedAt: Date;
    companyId: string;
    description: string | null;
    isActive: import("../../generated/prisma/index.js").$Enums.FormTemplateStatus;
    isSignatureRequired: boolean;
    formType: import("../../generated/prisma/index.js").$Enums.FormTemplateCategory;
    isApprovalRequired: boolean;
}) | null>;
export declare function getFormSubmissions(formTemplateId: string, dateRange?: {
    from?: Date;
    to?: Date;
}): Promise<({
    User: {
        firstName: string;
        lastName: string;
    };
} & {
    data: import("../../generated/prisma/runtime/library.js").JsonValue | null;
    title: string | null;
    createdAt: Date;
    id: number;
    userId: string;
    updatedAt: Date;
    status: import("../../generated/prisma/index.js").$Enums.FormStatus;
    formTemplateId: string;
    formType: string | null;
    submittedAt: Date | null;
})[]>;
export declare function createFormTemplate(data: SaveFormData): Promise<{
    createdAt: Date;
    id: string;
    name: string;
    updatedAt: Date;
    companyId: string;
    description: string | null;
    isActive: import("../../generated/prisma/index.js").$Enums.FormTemplateStatus;
    isSignatureRequired: boolean;
    formType: import("../../generated/prisma/index.js").$Enums.FormTemplateCategory;
    isApprovalRequired: boolean;
}>;
export declare function updateFormTemplate(data: SaveFormData): Promise<{
    success: boolean;
    formId: string;
    message: string;
}>;
export declare function deleteFormTemplate(id: string): Promise<{
    createdAt: Date;
    id: string;
    name: string;
    updatedAt: Date;
    companyId: string;
    description: string | null;
    isActive: import("../../generated/prisma/index.js").$Enums.FormTemplateStatus;
    isSignatureRequired: boolean;
    formType: import("../../generated/prisma/index.js").$Enums.FormTemplateCategory;
    isApprovalRequired: boolean;
}>;
export declare function archiveFormTemplate(id: string): Promise<{
    createdAt: Date;
    id: string;
    name: string;
    updatedAt: Date;
    companyId: string;
    description: string | null;
    isActive: import("../../generated/prisma/index.js").$Enums.FormTemplateStatus;
    isSignatureRequired: boolean;
    formType: import("../../generated/prisma/index.js").$Enums.FormTemplateCategory;
    isApprovalRequired: boolean;
}>;
export declare function publishFormTemplate(id: string): Promise<{
    createdAt: Date;
    id: string;
    name: string;
    updatedAt: Date;
    companyId: string;
    description: string | null;
    isActive: import("../../generated/prisma/index.js").$Enums.FormTemplateStatus;
    isSignatureRequired: boolean;
    formType: import("../../generated/prisma/index.js").$Enums.FormTemplateCategory;
    isApprovalRequired: boolean;
}>;
export declare function draftFormTemplate(id: string): Promise<{
    createdAt: Date;
    id: string;
    name: string;
    updatedAt: Date;
    companyId: string;
    description: string | null;
    isActive: import("../../generated/prisma/index.js").$Enums.FormTemplateStatus;
    isSignatureRequired: boolean;
    formType: import("../../generated/prisma/index.js").$Enums.FormTemplateCategory;
    isApprovalRequired: boolean;
}>;
export declare function createFormSubmission(input: CreateFormSubmissionInput): Promise<{
    data: import("../../generated/prisma/runtime/library.js").JsonValue | null;
    title: string | null;
    createdAt: Date;
    id: number;
    userId: string;
    updatedAt: Date;
    status: import("../../generated/prisma/index.js").$Enums.FormStatus;
    formTemplateId: string;
    formType: string | null;
    submittedAt: Date | null;
}>;
export declare function updateFormSubmission(input: UpdateFormSubmissionInput): Promise<{
    data: import("../../generated/prisma/runtime/library.js").JsonValue | null;
    title: string | null;
    createdAt: Date;
    id: number;
    userId: string;
    updatedAt: Date;
    status: import("../../generated/prisma/index.js").$Enums.FormStatus;
    formTemplateId: string;
    formType: string | null;
    submittedAt: Date | null;
}>;
export declare function deleteFormSubmission(submissionId: number): Promise<{
    data: import("../../generated/prisma/runtime/library.js").JsonValue | null;
    title: string | null;
    createdAt: Date;
    id: number;
    userId: string;
    updatedAt: Date;
    status: import("../../generated/prisma/index.js").$Enums.FormStatus;
    formTemplateId: string;
    formType: string | null;
    submittedAt: Date | null;
}>;
export declare function getFormSubmissionById(submissionId: number): Promise<({
    User: {
        id: string;
        firstName: string;
        lastName: string;
        signature: string | null;
    };
    FormTemplate: {
        FormGrouping: ({
            Fields: ({
                Options: {
                    id: string;
                    value: string;
                    fieldId: string;
                }[];
            } & {
                filter: string | null;
                id: string;
                order: number;
                formGroupingId: string;
                label: string;
                type: import("../../generated/prisma/index.js").$Enums.FieldType;
                required: boolean;
                placeholder: string | null;
                maxLength: number | null;
                content: string | null;
                minLength: number | null;
                multiple: boolean | null;
            })[];
        } & {
            title: string | null;
            id: string;
            order: number;
        })[];
    } & {
        createdAt: Date;
        id: string;
        name: string;
        updatedAt: Date;
        companyId: string;
        description: string | null;
        isActive: import("../../generated/prisma/index.js").$Enums.FormTemplateStatus;
        isSignatureRequired: boolean;
        formType: import("../../generated/prisma/index.js").$Enums.FormTemplateCategory;
        isApprovalRequired: boolean;
    };
    Approvals: ({
        Approver: {
            id: string;
            firstName: string;
            lastName: string;
            signature: string | null;
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
    data: import("../../generated/prisma/runtime/library.js").JsonValue | null;
    title: string | null;
    createdAt: Date;
    id: number;
    userId: string;
    updatedAt: Date;
    status: import("../../generated/prisma/index.js").$Enums.FormStatus;
    formTemplateId: string;
    formType: string | null;
    submittedAt: Date | null;
}) | null>;
export declare function approveFormSubmission(submissionId: number, action: "APPROVED" | "REJECTED", formData: ApproveFormSubmissionInput): Promise<{
    data: import("../../generated/prisma/runtime/library.js").JsonValue | null;
    title: string | null;
    createdAt: Date;
    id: number;
    userId: string;
    updatedAt: Date;
    status: import("../../generated/prisma/index.js").$Enums.FormStatus;
    formTemplateId: string;
    formType: string | null;
    submittedAt: Date | null;
}>;
//# sourceMappingURL=adminFormService.d.ts.map