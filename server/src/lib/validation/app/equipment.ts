import { z } from "zod";

export const createEquipmentSchema = z.object({
  ownershipType: z.string().min(1, "ownershipType is required"),
  createdById: z.string().min(1, "createdById is required"),
  equipmentTag: z.string().min(1, "equipmentTag is required"),
  name: z.string().min(1, "name is required"),
  creationReason: z.string().min(1, "creationReason is required"),
  destination: z.string().optional(),
  qrId: z.string().min(1, "qrId is required"),
  description: z.string().optional(),
});

export type CreateEquipmentInput = z.infer<typeof createEquipmentSchema>;
