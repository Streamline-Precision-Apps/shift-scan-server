import { z } from "zod";

// --- Timesheet Creation Schema ---
export const createTimesheetSchema = z.object({
  date: z.string().min(1),
  userId: z.string().min(1),
  jobsiteId: z.string().min(1),
  costcode: z.string().min(1),
  nu: z.string().optional().nullable(),
  Fp: z.string().optional().nullable(),
  startTime: z.string().optional().nullable(),
  endTime: z.string().optional().nullable(),
  comment: z.string().optional().nullable(),
  status: z.string().optional().nullable(),
  workType: z.string().optional().nullable(),
  createdAt: z.string().optional().nullable(),
  updatedAt: z.string().optional().nullable(),
  EmployeeEquipmentLogs: z
    .array(
      z.object({
        id: z.string().optional(),
        equipmentId: z.string().min(1),
        startTime: z.string().optional().nullable(),
        endTime: z.string().optional().nullable(),
        Equipment: z
          .object({
            id: z.string().optional(),
            name: z.string().optional(),
          })
          .optional(),
      })
    )
    .optional(),
  TruckingLogs: z
    .array(
      z.object({
        truckNumber: z.string().optional(),
        startingMileage: z.number().optional(),
        endingMileage: z.number().optional(),
        RefuelLogs: z
          .array(
            z.object({
              milesAtFueling: z.number().optional(),
            })
          )
          .optional(),
      })
    )
    .optional(),
  TascoLogs: z
    .array(
      z.object({
        shiftType: z.string().optional(),
        LoadQuantity: z.number().optional(),
      })
    )
    .optional(),
});

// --- Timesheet Update Schema ---
export const updateTimesheetSchema = z.object({
  data: z.record(z.string().min(1), z.any()),
  originalData: z.record(z.string().min(1), z.any()),
  changes: z.record(
    z.string().min(1),
    z.object({ old: z.any(), new: z.any() })
  ),
  editorId: z.string().min(1),
  changeReason: z.string().optional(),
  wasStatusChanged: z.boolean().optional(),
  numberOfChanges: z.number().optional(),
});

// --- Timesheet Status Update Schema ---
export const updateTimesheetStatusSchema = z.object({
  status: z.string().min(1),
  changes: z
    .record(z.string().min(1), z.object({ old: z.any(), new: z.any() }))
    .optional(),
  userId: z.string().min(1),
});

// --- Timesheet Notification Resolution Schema ---
export const resolveTimecardNotificationSchema = z.object({
  timesheetId: z.string().min(1),
  notificationId: z.union([z.string(), z.number()]),
  userId: z.string().min(1),
});
