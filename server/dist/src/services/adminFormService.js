
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="c30ba9cf-914e-5530-b289-1e9879e34a68")}catch(e){}}();
import prisma from "../lib/prisma.js";
import { FormTemplateCategory, FormTemplateStatus, FieldType, FormStatus, } from "../../generated/prisma/index.js";
export async function getAllFormTemplates(search, page, pageSize, skip, status, formType) {
    const filter = {};
    if (status.length === 1) {
        // Single status
        const statusForm = status[0];
        if (statusForm)
            filter.isActive = statusForm;
    }
    else if (status.length > 1) {
        const statusForms = status.map((s) => s).filter((s) => s);
        if (statusForms.length > 0)
            filter.isActive = { in: statusForms };
    }
    if (formType.length === 1 && formType[0] !== "ALL") {
        // Single form type
        const type = formType[0];
        if (type)
            filter.formType = type;
    }
    else if (formType.length > 1) {
        const types = formType.map((s) => s).filter((s) => s);
        if (types.length > 0)
            filter.formType = { in: types };
    }
    if (search !== "") {
        page = undefined;
        pageSize = undefined;
        skip = undefined;
        const totalPages = 1;
        const forms = await prisma.formTemplate.findMany({
            where: {
                ...filter,
            },
            include: {
                _count: {
                    select: {
                        Submissions: true,
                    },
                },
                FormGrouping: {
                    select: {
                        id: true,
                        title: true,
                        order: true,
                        Fields: {
                            select: {
                                label: true,
                                type: true,
                                required: true,
                                order: true,
                                placeholder: true,
                                minLength: true,
                                maxLength: true,
                                multiple: true,
                                content: true,
                                filter: true,
                                Options: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        const total = forms.length;
        return {
            data: forms,
            page,
            pageSize,
            total,
            totalPages,
        };
    }
    else {
        page = page || 1;
        pageSize = pageSize || 10;
        skip = (page - 1) * pageSize;
        const take = pageSize;
        // Fetch total count for pagination
        const total = await prisma.formTemplate.count();
        const totalPages = Math.ceil(total / pageSize);
        // Get total count for pagination
        const forms = await prisma.formTemplate.findMany({
            where: {
                ...filter,
            },
            skip,
            take,
            include: {
                _count: {
                    select: {
                        Submissions: true,
                    },
                },
                FormGrouping: {
                    select: {
                        id: true,
                        title: true,
                        order: true,
                        Fields: {
                            select: {
                                label: true,
                                type: true,
                                required: true,
                                order: true,
                                placeholder: true,
                                minLength: true,
                                maxLength: true,
                                multiple: true,
                                content: true,
                                filter: true,
                                Options: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        return {
            data: forms,
            page,
            pageSize,
            total,
            totalPages,
        };
    }
}
export async function getFormSubmissionByTemplateId(id, search, page, pageSize, pendingOnly, statusFilter, dateRangeStart, dateRangeEnd) {
    // If pendingOnly or searching, do not paginate (return all matching submissions)
    const isSearching = search !== null && search !== undefined && search !== "";
    const skip = pendingOnly || isSearching ? undefined : (page - 1) * pageSize;
    const take = pendingOnly || isSearching ? undefined : pageSize;
    // (moved up)
    // Determine the status condition for queries
    let statusCondition;
    if (pendingOnly) {
        statusCondition = "PENDING";
    }
    else if (statusFilter && statusFilter !== "ALL") {
        statusCondition = statusFilter;
    }
    const total = await prisma.formSubmission.count({
        where: {
            formTemplateId: id,
            NOT: {
                status: "DRAFT",
            },
            ...(statusCondition && { status: statusCondition }),
        },
    });
    // Count of pending submissions for inbox
    const pendingForms = await prisma.formSubmission.count({
        where: {
            formTemplateId: id,
            status: "PENDING",
        },
    });
    const formTemplate = await prisma.formTemplate.findUnique({
        where: { id },
        include: {
            FormGrouping: {
                select: {
                    id: true,
                    title: true,
                    order: true,
                    Fields: {
                        select: {
                            id: true,
                            label: true,
                            type: true,
                            required: true,
                            order: true,
                            placeholder: true,
                            minLength: true,
                            maxLength: true,
                            multiple: true,
                            content: true,
                            filter: true,
                            Options: true,
                        },
                    },
                },
            },
        },
    });
    const submissions = await prisma.formSubmission.findMany({
        where: {
            formTemplateId: id,
            NOT: {
                status: "DRAFT",
            },
            ...(statusCondition && { status: statusCondition }),
            ...(dateRangeStart || dateRangeEnd
                ? {
                    submittedAt: {
                        ...(dateRangeStart && { gte: new Date(dateRangeStart) }),
                        ...(dateRangeEnd && { lte: new Date(dateRangeEnd) }),
                    },
                }
                : {}),
        },
        ...(skip !== undefined ? { skip } : {}),
        ...(take !== undefined ? { take } : {}),
        orderBy: { submittedAt: "desc" },
        include: {
            User: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    signature: true,
                },
            },
        },
    });
    return {
        ...formTemplate,
        Submissions: submissions,
        total,
        page: pendingOnly || isSearching ? 1 : page,
        pageSize: pendingOnly || isSearching ? submissions.length : pageSize,
        totalPages: pendingOnly || isSearching ? 1 : Math.ceil(total / pageSize),
        pendingForms,
    };
}
export async function getFormTemplateById(id) {
    return await prisma.formTemplate.findUnique({
        where: { id },
        include: {
            FormGrouping: {
                include: {
                    Fields: {
                        include: {
                            Options: true,
                        },
                    },
                },
            },
        },
    });
}
export async function getFormSubmissions(formTemplateId, dateRange) {
    const submittedAtFilter = {};
    if (dateRange?.from)
        submittedAtFilter.gte = dateRange.from;
    if (dateRange?.to)
        submittedAtFilter.lte = dateRange.to;
    return await prisma.formSubmission.findMany({
        where: {
            formTemplateId,
            ...(Object.keys(submittedAtFilter).length > 0 && {
                submittedAt: submittedAtFilter,
            }),
        },
        include: {
            User: {
                select: {
                    firstName: true,
                    lastName: true,
                },
            },
        },
    });
}
// data: { settings, fields, companyId }
export async function createFormTemplate(data) {
    const { settings, fields, companyId } = data;
    return await prisma.$transaction(async (tx) => {
        const formTemplate = await tx.formTemplate.create({
            data: {
                companyId: companyId || "1",
                name: settings.name,
                description: settings.description || null,
                formType: settings.formType,
                isActive: settings.isActive,
                isSignatureRequired: settings.requireSignature,
                isApprovalRequired: settings.isApprovalRequired,
            },
        });
        const formGrouping = await tx.formGrouping.create({
            data: {
                title: settings.name,
                order: 0,
            },
        });
        await tx.formTemplate.update({
            where: { id: formTemplate.id },
            data: {
                FormGrouping: {
                    connect: { id: formGrouping.id },
                },
            },
        });
        for (const field of fields) {
            const formField = await tx.formField.create({
                data: {
                    formGroupingId: formGrouping.id,
                    label: field.label,
                    type: field.type,
                    required: field.required,
                    order: field.order,
                    placeholder: field.placeholder ?? null,
                    multiple: field.multiple || false,
                    content: field.content || null,
                    filter: field.filter || null,
                    minLength: field.minLength !== undefined ? field.minLength : null,
                    maxLength: field.maxLength !== undefined ? field.maxLength : null,
                },
            });
            if (["DROPDOWN", "RADIO", "MULTISELECT"].includes(field.type?.toUpperCase?.()) &&
                field.Options &&
                field.Options.length > 0) {
                for (const option of field.Options) {
                    const optionData = typeof option === "string" ? { value: option } : option;
                    await tx.formFieldOption.create({
                        data: {
                            fieldId: formField.id,
                            value: optionData.value,
                        },
                    });
                }
            }
        }
        return formTemplate;
    });
}
// data: { settings, fields, formId }
export async function updateFormTemplate(data) {
    const { settings, fields, formId } = data;
    if (!formId) {
        throw new Error("formId is required for updating a form template");
    }
    await prisma.formTemplate.update({
        where: { id: formId },
        data: {
            name: settings.name,
            formType: settings.formType,
            isActive: settings.isActive || FormTemplateStatus.DRAFT,
            isSignatureRequired: settings.requireSignature,
            isApprovalRequired: settings.isApprovalRequired,
            description: settings.description,
        },
    });
    const groupings = await prisma.formGrouping.findMany({
        where: { FormTemplate: { some: { id: formId } } },
    });
    let formGroupingId = groupings[0]?.id;
    if (!formGroupingId) {
        const newGrouping = await prisma.formGrouping.create({
            data: { title: settings.name, order: 0 },
        });
        await prisma.formTemplate.update({
            where: { id: formId },
            data: { FormGrouping: { connect: { id: newGrouping.id } } },
        });
        formGroupingId = newGrouping.id;
    }
    const existingFields = await prisma.formField.findMany({
        where: { formGroupingId },
        include: { Options: true },
    });
    const existingFieldMap = new Map(existingFields.map((f) => [f.id, f]));
    const submittedFieldIds = new Set(fields.map((f) => f.id));
    for (const oldField of existingFields) {
        if (!submittedFieldIds.has(oldField.id)) {
            await prisma.formFieldOption.deleteMany({
                where: { fieldId: oldField.id },
            });
            await prisma.formField.delete({ where: { id: oldField.id } });
        }
    }
    for (const field of fields) {
        let formFieldId = field.id;
        const isExisting = existingFieldMap.has(field.id);
        if (isExisting) {
            await prisma.formField.update({
                where: { id: field.id },
                data: {
                    label: field.label,
                    type: field.type,
                    required: field.required,
                    order: field.order,
                    placeholder: field.placeholder !== undefined ? field.placeholder : null,
                    minLength: field.minLength !== undefined ? field.minLength : null,
                    maxLength: field.maxLength !== undefined ? field.maxLength : null,
                    multiple: field.multiple !== undefined ? field.multiple : null,
                    content: field.content !== undefined ? field.content : null,
                    filter: field.filter !== undefined ? field.filter : null,
                    formGroupingId,
                },
            });
            await prisma.formFieldOption.deleteMany({ where: { fieldId: field.id } });
        }
        else {
            const created = await prisma.formField.create({
                data: {
                    id: field.id,
                    formGroupingId,
                    label: field.label,
                    type: field.type,
                    required: field.required,
                    order: field.order,
                    placeholder: field.placeholder !== undefined ? field.placeholder : null,
                    maxLength: field.maxLength !== undefined ? field.maxLength : null,
                    minLength: field.minLength !== undefined ? field.minLength : null,
                    multiple: field.multiple || false,
                    content: field.content || null,
                    filter: field.filter || null,
                },
            });
            formFieldId = created.id;
        }
        if (["DROPDOWN", "RADIO", "MULTISELECT"].includes(field.type) &&
            field.Options &&
            field.Options.length > 0) {
            for (const option of field.Options) {
                await prisma.formFieldOption.create({
                    data: {
                        fieldId: formFieldId,
                        value: option.value,
                    },
                });
            }
        }
        if (field.type === "TEXTAREA" ||
            field.type === "TEXT" ||
            field.type === "NUMBER") {
            await prisma.formField.update({
                where: { id: formFieldId },
                data: {
                    maxLength: field.maxLength !== undefined ? field.maxLength : null,
                },
            });
        }
        if (field.type === "DATE" || field.type === "TIME") {
            await prisma.formField.update({
                where: { id: formFieldId },
                data: {
                    placeholder: field.placeholder !== undefined ? field.placeholder : null,
                },
            });
        }
    }
    return { success: true, formId, message: "Form updated successfully" };
}
export async function deleteFormTemplate(id) {
    return await prisma.formTemplate.delete({
        where: { id },
    });
}
export async function archiveFormTemplate(id) {
    return await prisma.formTemplate.update({
        where: { id },
        data: { isActive: "ARCHIVED" },
    });
}
export async function publishFormTemplate(id) {
    return await prisma.formTemplate.update({
        where: { id },
        data: { isActive: "ACTIVE" },
    });
}
export async function draftFormTemplate(id) {
    return await prisma.formTemplate.update({
        where: { id },
        data: { isActive: "DRAFT" },
    });
}
// input: { formTemplateId, data, submittedBy, adminUserId, comment, signature }
export async function createFormSubmission(input) {
    const { formTemplateId, data, submittedBy, adminUserId, comment, signature } = input;
    if (!submittedBy.id)
        throw new Error("Submitted By is required");
    const created = await prisma.formSubmission.create({
        data: {
            formTemplateId,
            userId: submittedBy.id,
            data,
            status: "APPROVED",
            submittedAt: new Date(),
        },
    });
    await prisma.formApproval.create({
        data: {
            formSubmissionId: created.id,
            signedBy: adminUserId ?? null,
            comment: comment || null,
            signature: signature || null,
            submittedAt: new Date(),
            updatedAt: new Date(),
        },
    });
    return created;
}
// input: { submissionId, data, adminUserId, comment, signature, updateStatus }
export async function updateFormSubmission(input) {
    const { submissionId, data, adminUserId, comment, signature, updateStatus } = input;
    const updated = await prisma.formSubmission.update({
        where: { id: submissionId },
        data: {
            data,
            updatedAt: new Date(),
            ...(updateStatus && { status: updateStatus }),
        },
    });
    if (adminUserId) {
        const existingApproval = await prisma.formApproval.findFirst({
            where: { formSubmissionId: submissionId, signedBy: adminUserId },
        });
        if (existingApproval) {
            await prisma.formApproval.update({
                where: { id: existingApproval.id },
                data: {
                    updatedAt: new Date(),
                    comment: comment || existingApproval.comment,
                    signature: signature || existingApproval.signature,
                },
            });
        }
        else {
            await prisma.formApproval.create({
                data: {
                    formSubmissionId: submissionId,
                    signedBy: adminUserId,
                    updatedAt: new Date(),
                    comment: comment || null,
                    signature: signature || null,
                },
            });
        }
    }
    return updated;
}
export async function deleteFormSubmission(submissionId) {
    return await prisma.formSubmission.delete({
        where: { id: submissionId },
    });
}
export async function getFormSubmissionById(submissionId) {
    return await prisma.formSubmission.findUnique({
        where: { id: submissionId },
        include: {
            User: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    signature: true,
                },
            },
            FormTemplate: {
                include: {
                    FormGrouping: {
                        include: {
                            Fields: {
                                include: {
                                    Options: true,
                                },
                            },
                        },
                    },
                },
            },
            Approvals: {
                include: {
                    Approver: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            signature: true,
                        },
                    },
                },
                orderBy: { updatedAt: "desc" },
            },
        },
    });
}
// submissionId, action, formData
export async function approveFormSubmission(submissionId, action, formData) {
    const comment = formData.comment;
    const adminUserId = formData.adminUserId;
    const updated = await prisma.formSubmission.update({
        where: { id: submissionId },
        data: {
            status: action,
            updatedAt: new Date(),
            Approvals: {
                create: {
                    signedBy: adminUserId || null,
                    comment: comment || null,
                    submittedAt: new Date(),
                    updatedAt: new Date(),
                },
            },
        },
    });
    return updated;
}
//# sourceMappingURL=adminFormService.js.map
//# debugId=c30ba9cf-914e-5530-b289-1e9879e34a68
