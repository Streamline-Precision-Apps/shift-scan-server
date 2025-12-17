import { z } from "zod";

// POST /:id (create resource for a specific field)
export const createTruckingLogFieldSchema = z.object({
  // No body required for most field operations, but allow optional resource creation
  // For haulingLogs: { name: string, quantity: number, createdAt?: string }
  name: z.string().min(1, "name is required").optional(),
  quantity: z.number().optional(),
  createdAt: z.string().optional(),
});

// PUT /:id (update resource for a specific field)
export const updateTruckingLogFieldSchema = z
  .object({
    // For endingMileage/startingMileage: { value: number }
    value: z.number().optional(),

    // For notes: { notes: string }
    notes: z.string().nullable().optional(),

    // For equipmentHauled: { equipmentId?: string, source?: string, destination?: string, startMileage?: number, endMileage?: number }
    equipmentId: z.string().optional(),
    source: z.string().optional(),
    destination: z.string().optional(),
    startMileage: z.number().nullable().optional(),
    endMileage: z.number().nullable().optional(),

    // For stateMileage: { state?: string, stateLineMileage?: number }
    state: z.string().optional(),
    stateLineMileage: z.number().optional(),

    // For refuelLogs: { gallonsRefueled?: number, milesAtFueling?: number }
    gallonsRefueled: z.number().optional(),
    milesAtFueling: z.number().optional(),

    // For material: { name?: string, quantity?: number, LocationOfMaterial?: string, unit?: string, loadType?: string }
    name: z.string().optional(),
    quantity: z.number().optional(),
    LocationOfMaterial: z.string().optional(),
    unit: z.string().optional(),
    loadType: z.string().nullable().optional(),
  })
  .refine(
    (data) =>
      data.value !== undefined ||
      data.notes !== undefined ||
      data.equipmentId !== undefined ||
      data.source !== undefined ||
      data.destination !== undefined ||
      data.startMileage !== undefined ||
      data.endMileage !== undefined ||
      data.state !== undefined ||
      data.stateLineMileage !== undefined ||
      data.gallonsRefueled !== undefined ||
      data.milesAtFueling !== undefined ||
      data.name !== undefined ||
      data.quantity !== undefined ||
      data.LocationOfMaterial !== undefined ||
      data.unit !== undefined ||
      data.loadType !== undefined,
    {
      message: "At least one field must be provided for update",
      path: ["root"],
    }
  );
