import { z } from "zod";

// General Timesheet Creation Schema
export const generalTimesheetSchema = z.object({
  date: z.string().min(1, "date is required"),
  jobsiteId: z.string().min(1, "jobsiteId is required"),
  workType: z.string().min(1, "workType is required"),
  userId: z.string().min(1, "userId is required"),
  costCode: z.string().min(1, "costCode is required"),
  startTime: z.string().min(1, "startTime is required"),
  clockInLat: z.number().nullable().optional(),
  clockInLong: z.number().nullable().optional(),
  type: z.string().optional(),
  previousTimeSheetId: z.number().optional(),
  endTime: z.string().optional(),
  previoustimeSheetComments: z.string().optional(),
  clockOutLat: z.number().nullable().optional(),
  clockOutLong: z.number().nullable().optional(),
  sessionId: z.number().nullable().optional(),
});

// Mechanic Timesheet Creation Schema
export const mechanicTimesheetSchema = generalTimesheetSchema.extend({});

// Tasco Timesheet Creation Schema
export const tascoTimesheetSchema = generalTimesheetSchema.extend({
  shiftType: z.string().optional(),
  laborType: z.string().optional(),
  materialType: z.string().optional(),
  equipmentId: z.string().optional(),
});

// Truck Timesheet Creation Schema
export const truckTimesheetSchema = generalTimesheetSchema.extend({
  truckId: z.string().optional(),
  trailerId: z.string().optional(),
  startingMileage: z.number().optional(),
  endingMileage: z.number().optional(),
  refueled: z.boolean().optional(),
  gallons: z.number().optional(),
  stateMileage: z.boolean().optional(),
  material: z.boolean().optional(),
  equipmentHauled: z.boolean().optional(),
});

// Timesheet Update Schema (PUT /:id)
export const updateTimesheetSchema = z.object({
  editorId: z.string().min(1, "editorId is required"),
  changes: z.string().min(1, "changes is required"),
  changeReason: z.string().optional(),
  numberOfChanges: z.number().optional(),
  startTime: z.string().min(1, "startTime is required"),
  endTime: z.string().optional(),
  Jobsite: z.string().optional(),
  CostCode: z.string().optional(),
  comment: z.string().optional(),
});

// Batch Approve Timesheets Schema (POST /approve-batch)
export const approveBatchSchema = z.object({
  id: z.string().min(1, "userId is required"),
  timesheetIds: z
    .array(z.number())
    .min(1, "At least one timesheetId is required"),
  statusComment: z.string().optional(),
  editorId: z.string().min(1, "editorId is required"),
});

// Equipment Log Creation Schema (POST /equipment-log)
export const createEquipmentLogSchema = z.object({
  equipmentId: z.string().min(1, "equipmentId is required"),
  timeSheetId: z.string().min(1, "timeSheetId is required"),
  endTime: z.string().optional(),
  comment: z.string().optional(),
});

// Equipment Log Update Schema (PUT /equipment-log/:logId)
export const updateEquipmentLogSchema = z.object({
  equipmentId: z.string().min(1, "equipmentId is required"),
  startTime: z.string().min(1, "startTime is required"),
  endTime: z.string().optional(),
  comment: z.string().optional(),
  status: z.string().optional(),
  disconnectRefuelLog: z.boolean().optional(),
  refuelLogId: z.string().optional(),
  gallonsRefueled: z.number().optional(),
});

// Clock Out Update Schema (PUT /:id/clock-out)
export const updateClockOutSchema = z.object({
  userId: z.string().min(1, "userId is required"),
  endTime: z.string().min(1, "endTime is required"),
  timeSheetComments: z.string().optional(),
  wasInjured: z.boolean().optional(),
  clockOutLat: z.number().nullable().optional(),
  clockOutLong: z.number().nullable().optional(),
});
