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
            id: string;
            title: string | null;
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
                    spanishValue: string | null;
                }[];
            }[];
            order: number;
        }[];
    } & {
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
            id: string;
            title: string | null;
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
                    spanishValue: string | null;
                }[];
            }[];
            order: number;
        }[];
    } & {
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
    })[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
    pendingForms: number;
    FormGrouping?: {
        id: string;
        title: string | null;
        Fields: {
            id: string;
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
                spanishValue: string | null;
            }[];
        }[];
        order: number;
    }[];
    name?: string;
    id?: string;
    createdAt?: Date;
    updatedAt?: Date;
    companyId?: string;
    spanishName?: string | null;
    isSignatureRequired?: boolean;
    description?: string | null;
    isActive?: import("../../generated/prisma/index.js").$Enums.FormTemplateStatus;
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
                spanishValue: string | null;
            }[];
        } & {
            id: string;
            filter: string | null;
            order: number;
            conditionalOnFieldId: string | null;
            conditionType: string | null;
            conditionalOnValue: string | null;
            formGroupingId: string;
            label: string;
            spanishLabel: string | null;
            type: import("../../generated/prisma/index.js").$Enums.FieldType;
            required: boolean;
            placeholder: string | null;
            maxLength: number | null;
            content: string | null;
            minLength: number | null;
            multiple: boolean | null;
        })[];
    } & {
        id: string;
        title: string | null;
        spanishTitle: string | null;
        order: number;
        conditionalOnFieldId: string | null;
        conditionType: string | null;
        conditionalOnValue: string | null;
    })[];
} & {
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
export declare function createFormTemplate(data: SaveFormData): Promise<{
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
}>;
export declare function updateFormTemplate(data: SaveFormData): Promise<{
    success: boolean;
    formId: string;
    message: string;
}>;
export declare function deleteFormTemplate(id: string): Promise<{
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
}>;
export declare function archiveFormTemplate(id: string): Promise<{
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
}>;
export declare function publishFormTemplate(id: string): Promise<{
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
}>;
export declare function draftFormTemplate(id: string): Promise<{
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
}>;
export declare function createFormSubmission(input: CreateFormSubmissionInput): Promise<{
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
export declare function updateFormSubmission(input: UpdateFormSubmissionInput): Promise<{
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
export declare function deleteFormSubmission(submissionId: number): Promise<{
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
export declare function getFormSubmissionById(submissionId: number): Promise<({
    FormTemplate: {
        FormGrouping: ({
            Fields: ({
                Options: {
                    id: string;
                    value: string;
                    fieldId: string;
                    spanishValue: string | null;
                }[];
            } & {
                id: string;
                filter: string | null;
                order: number;
                conditionalOnFieldId: string | null;
                conditionType: string | null;
                conditionalOnValue: string | null;
                formGroupingId: string;
                label: string;
                spanishLabel: string | null;
                type: import("../../generated/prisma/index.js").$Enums.FieldType;
                required: boolean;
                placeholder: string | null;
                maxLength: number | null;
                content: string | null;
                minLength: number | null;
                multiple: boolean | null;
            })[];
        } & {
            id: string;
            title: string | null;
            spanishTitle: string | null;
            order: number;
            conditionalOnFieldId: string | null;
            conditionType: string | null;
            conditionalOnValue: string | null;
        })[];
    } & {
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
        firstName: string;
        lastName: string;
        signature: string | null;
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
export declare function approveFormSubmission(submissionId: number, action: "APPROVED" | "REJECTED", formData: ApproveFormSubmissionInput): Promise<{
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
//# sourceMappingURL=adminFormService.d.ts.map