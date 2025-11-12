import prisma from "../lib/prisma.js";
import {
  FormTemplateCategory,
  FormTemplateStatus,
  FieldType,
  FormStatus,
} from "../../generated/prisma/index.js";

// --- Types ---
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

export async function getAllFormTemplates(
  search: string,
  page: number | undefined,
  pageSize: number | undefined,
  skip: number | undefined,
  status: string[],
  formType: string[]
) {
  const filter: Record<string, unknown> = {};

  if (status.length === 1) {
    // Single status
    const statusForm = status[0];
    if (statusForm) filter.isActive = statusForm;
  } else if (status.length > 1) {
    const statusForms = status.map((s) => s).filter((s) => s);
    if (statusForms.length > 0) filter.isActive = { in: statusForms };
  }

  if (formType.length === 1 && formType[0] !== "ALL") {
    // Single form type
    const type = formType[0];
    if (type) filter.formType = type;
  } else if (formType.length > 1) {
    const types = formType.map((s) => s).filter((s) => s);
    if (types.length > 0) filter.formType = { in: types };
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
  } else {
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

export async function getFormTemplateById(id: string) {
  return await prisma.formTemplate.findUnique({
    where: { id },
    include: {
      FormGrouping: {
        include: {
          Fields: true,
        },
      },
    },
  });
}

export async function getFormSubmissions(
  formTemplateId: string,
  dateRange?: {
    from?: Date;
    to?: Date;
  }
) {
  const submittedAtFilter: Record<string, Date> = {};
  if (dateRange?.from) submittedAtFilter.gte = dateRange.from;
  if (dateRange?.to) submittedAtFilter.lte = dateRange.to;

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
export async function createFormTemplate(data: SaveFormData) {
  const { settings, fields, companyId } = data;
  return await prisma.$transaction(async (tx) => {
    const formTemplate = await tx.formTemplate.create({
      data: {
        companyId: companyId || "1",
        name: settings.name,
        description: settings.description || null,
        formType: settings.formType as FormTemplateCategory,
        isActive: settings.isActive as FormTemplateStatus,
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
          type: field.type as FieldType,
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
      if (
        ["DROPDOWN", "RADIO", "MULTISELECT"].includes(
          field.type?.toUpperCase?.()
        ) &&
        field.Options &&
        field.Options.length > 0
      ) {
        for (const option of field.Options) {
          const optionData =
            typeof option === "string" ? { value: option } : option;
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
export async function updateFormTemplate(data: SaveFormData) {
  const { settings, fields, formId } = data;
  if (!formId) {
    throw new Error("formId is required for updating a form template");
  }
  await prisma.formTemplate.update({
    where: { id: formId },
    data: {
      name: settings.name,
      formType: settings.formType as FormTemplateCategory,
      isActive:
        (settings.isActive as FormTemplateStatus) || FormTemplateStatus.DRAFT,
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
          type: field.type as FieldType,
          required: field.required,
          order: field.order,
          placeholder:
            field.placeholder !== undefined ? field.placeholder : null,
          minLength: field.minLength !== undefined ? field.minLength : null,
          maxLength: field.maxLength !== undefined ? field.maxLength : null,
          multiple: field.multiple !== undefined ? field.multiple : null,
          content: field.content !== undefined ? field.content : null,
          filter: field.filter !== undefined ? field.filter : null,
          formGroupingId,
        },
      });
      await prisma.formFieldOption.deleteMany({ where: { fieldId: field.id } });
    } else {
      const created = await prisma.formField.create({
        data: {
          id: field.id,
          formGroupingId,
          label: field.label,
          type: field.type as FieldType,
          required: field.required,
          order: field.order,
          placeholder:
            field.placeholder !== undefined ? field.placeholder : null,
          maxLength: field.maxLength !== undefined ? field.maxLength : null,
          minLength: field.minLength !== undefined ? field.minLength : null,
          multiple: field.multiple || false,
          content: field.content || null,
          filter: field.filter || null,
        },
      });
      formFieldId = created.id;
    }
    if (
      ["DROPDOWN", "RADIO", "MULTISELECT"].includes(field.type) &&
      field.Options &&
      field.Options.length > 0
    ) {
      for (const option of field.Options) {
        await prisma.formFieldOption.create({
          data: {
            fieldId: formFieldId,
            value: option.value,
          },
        });
      }
    }
    if (
      field.type === "TEXTAREA" ||
      field.type === "TEXT" ||
      field.type === "NUMBER"
    ) {
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
          placeholder:
            field.placeholder !== undefined ? field.placeholder : null,
        },
      });
    }
  }
  return { success: true, formId, message: "Form updated successfully" };
}

export async function deleteFormTemplate(id: string) {
  return await prisma.formTemplate.delete({
    where: { id },
  });
}

export async function archiveFormTemplate(id: string) {
  return await prisma.formTemplate.update({
    where: { id },
    data: { isActive: "ARCHIVED" },
  });
}

export async function publishFormTemplate(id: string) {
  return await prisma.formTemplate.update({
    where: { id },
    data: { isActive: "ACTIVE" },
  });
}

export async function draftFormTemplate(id: string) {
  return await prisma.formTemplate.update({
    where: { id },
    data: { isActive: "DRAFT" },
  });
}

// input: { formTemplateId, data, submittedBy, adminUserId, comment, signature }
export async function createFormSubmission(input: CreateFormSubmissionInput) {
  const { formTemplateId, data, submittedBy, adminUserId, comment, signature } =
    input;
  if (!submittedBy.id) throw new Error("Submitted By is required");
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
export async function updateFormSubmission(input: UpdateFormSubmissionInput) {
  const { submissionId, data, adminUserId, comment, signature, updateStatus } =
    input;
  const updated = await prisma.formSubmission.update({
    where: { id: submissionId },
    data: {
      data,
      updatedAt: new Date(),
      ...(updateStatus && { status: updateStatus as any }),
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
    } else {
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

export async function deleteFormSubmission(submissionId: number) {
  return await prisma.formSubmission.delete({
    where: { id: submissionId },
  });
}

export async function getFormSubmissionById(submissionId: number) {
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
            select: { id: true, firstName: true, lastName: true },
          },
        },
        orderBy: { updatedAt: "desc" },
      },
    },
  });
}

// submissionId, action, formData
export async function approveFormSubmission(
  submissionId: number,
  action: "APPROVED" | "REJECTED",
  formData: ApproveFormSubmissionInput
) {
  const comment = formData.comment;
  const adminUserId = formData.adminUserId;
  const updated = await prisma.formSubmission.update({
    where: { id: submissionId },
    data: {
      status: action as FormStatus,
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
