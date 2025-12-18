import { z } from "zod";

/**
 * Zod schema for creating equipment (POST /api/v1/admins/equipment)
 */
export const createEquipmentSchema = z.object({
  code: z.string().optional(),
  name: z.string().min(1, "Equipment name is required"),
  description: z.string().optional(),
  memo: z.string().optional(),
  ownershipType: z.string().optional().nullable(),
  make: z.string().optional().nullable(),
  model: z.string().optional().nullable(),
  year: z.string().optional().nullable(),
  color: z.string().optional().nullable(),
  serialNumber: z.string().optional().nullable(),
  acquiredDate: z.union([z.iso.datetime(), z.null()]).optional(),
  acquiredCondition: z.string().optional().nullable(),
  licensePlate: z.string().optional().nullable(),
  licenseState: z.string().optional().nullable(),
  equipmentTag: z.string().min(1, "equipmentTag is required"),
  status: z.string().optional(),
  state: z.string().optional(),
  approvalStatus: z.string().optional(),
  isDisabledByAdmin: z.boolean().optional(),
  overWeight: z.boolean().nullable().optional(),
  currentWeight: z.number().nullable().optional(),
  createdById: z.string().optional(),
  qrId: z.string().optional(),
});

/**
 * Zod schema for updating equipment (PUT /api/v1/admins/equipment/:id)
 * All fields optional for PATCH-like flexibility
 */
export const updateEquipmentSchema = z.object({
  code: z.string().optional(),
  name: z.string().optional(),
  description: z.string().optional(),
  memo: z.string().optional(),
  ownershipType: z.string().optional().nullable(),
  make: z.string().optional().nullable(),
  model: z.string().optional().nullable(),
  year: z.string().optional().nullable(),
  color: z.string().optional().nullable(),
  serialNumber: z.string().optional().nullable(),
  acquiredDate: z.union([z.iso.datetime(), z.null()]).optional(),
  acquiredCondition: z.string().optional().nullable(),
  licensePlate: z.string().optional().nullable(),
  licenseState: z.string().optional().nullable(),
  equipmentTag: z.string().optional(),
  status: z.string().optional(),
  state: z.string().optional(),
  approvalStatus: z.string().optional(),
  isDisabledByAdmin: z.boolean().optional(),
  overWeight: z.boolean().nullable().optional(),
  currentWeight: z.number().nullable().optional(),
  creationReason: z.string().optional(),
  registrationExpiration: z.union([z.iso.datetime(), z.null()]).optional(),
});

/**
 * Zod schema for archiving equipment (PUT /api/v1/admins/equipment/:id/archive)
 * No body expected, so use an empty object schema
 */
export const archiveEquipmentSchema = z.object({});

/**
 * Zod schema for restoring equipment (PUT /api/v1/admins/equipment/:id/restore)
 * No body expected, so use an empty object schema
 */
export const restoreEquipmentSchema = z.object({});
